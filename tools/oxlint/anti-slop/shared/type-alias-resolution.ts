import type { ESTree } from "@oxlint/plugins";

import { lexicalTypeParameterNames, visibleTypeParameter as lexicalTypeParameter } from "./lexical-type-parameters.ts";

type VisitorKeys = Readonly<Record<string, readonly string[]>>;
type TypeScope = ESTree.Node;

type TypeBinding = {
	readonly declaration: ESTree.Node;
	readonly alias: ESTree.TSTypeAliasDeclaration | null;
	readonly name: string;
	readonly scope: TypeScope;
};

type Substitution = {
	readonly resolvingAliases: ReadonlySet<ESTree.TSTypeAliasDeclaration>;
	readonly substitutions: Substitutions;
	readonly type: ESTree.TSType;
};

type Substitutions = ReadonlyMap<ESTree.TSTypeParameter, Substitution>;

export type TypeAliasEnvironment = {
	readonly program: ESTree.Program;
	readonly aliases: readonly ESTree.TSTypeAliasDeclaration[];
	readonly bindingsByName: ReadonlyMap<string, readonly TypeBinding[]>;
	readonly visitorKeys: VisitorKeys;
};

export type ResolvedTypeMatcher = (
	type: ESTree.TSType,
	matches: (child: ESTree.TSType) => boolean,
) => boolean;

const environmentsByProgram = new WeakMap<ESTree.Program, TypeAliasEnvironment>();

function isNode(value: unknown): value is ESTree.Node {
	return (
		typeof value === "object" &&
		value !== null &&
		"type" in value &&
		typeof value.type === "string"
	);
}

function enclosingTypeScope(node: ESTree.Node): TypeScope {
	let current: ESTree.Node | null = node.parent;
	while (current !== null) {
		if (
			current.type === "Program" ||
			current.type === "BlockStatement" ||
			current.type === "TSModuleBlock" ||
			current.type === "StaticBlock" ||
			current.type === "SwitchStatement"
		) {
			return current;
		}
		current = current.parent;
	}
	return node;
}

function declaredTypeBinding(node: ESTree.Node): {
	readonly alias: ESTree.TSTypeAliasDeclaration | null;
	readonly name: string;
} | null {
	if (node.type === "TSTypeAliasDeclaration") {
		return { alias: node, name: node.id.name };
	}
	if (node.type === "TSImportEqualsDeclaration") return { alias: null, name: node.id.name };
	if (
		node.type === "TSInterfaceDeclaration" ||
		node.type === "TSEnumDeclaration" ||
		node.type === "ClassDeclaration" ||
		node.type === "ClassExpression"
	) {
		return node.id === null ? null : { alias: null, name: node.id.name };
	}
	if (
		node.type === "ImportSpecifier" ||
		node.type === "ImportDefaultSpecifier" ||
		node.type === "ImportNamespaceSpecifier"
	) {
		return { alias: null, name: node.local.name };
	}
	return null;
}

function collectTypeBindings(
	node: ESTree.Node,
	visitorKeys: VisitorKeys,
	bindingsByName: Map<string, TypeBinding[]>,
	aliases: ESTree.TSTypeAliasDeclaration[],
): void {
	const declared = declaredTypeBinding(node);
	if (declared !== null) {
		const bindings = bindingsByName.get(declared.name) ?? [];
		bindings.push({ ...declared, declaration: node, scope: node.type === "ClassExpression" ? node : enclosingTypeScope(node) });
		bindingsByName.set(declared.name, bindings);
		if (declared.alias !== null) aliases.push(declared.alias);
	}

	// SAFETY: Oxlint's visitor keys identify only ESTree child-node properties.
	const fields = node as unknown as Readonly<Record<string, unknown>>;
	for (const key of visitorKeys[node.type] ?? []) {
		const value = fields[key];
		if (isNode(value)) {
			collectTypeBindings(value, visitorKeys, bindingsByName, aliases);
			continue;
		}
		if (!Array.isArray(value)) continue;
		for (const child of value) {
			if (isNode(child)) {
				collectTypeBindings(child, visitorKeys, bindingsByName, aliases);
			}
		}
	}
}

/** Collect every lexical type alias and competing type binding in a program. */
export function createTypeAliasEnvironment(
	program: ESTree.Program,
	visitorKeys: VisitorKeys,
): TypeAliasEnvironment {
	const cached = environmentsByProgram.get(program);
	if (cached !== undefined) return cached;
	const bindingsByName = new Map<string, TypeBinding[]>();
	const aliases: ESTree.TSTypeAliasDeclaration[] = [];
	collectTypeBindings(program, visitorKeys, bindingsByName, aliases);
	const environment = { aliases, bindingsByName, visitorKeys, program };
	environmentsByProgram.set(program, environment);
	return environment;
}

function ancestorDistance(ancestor: ESTree.Node, node: ESTree.Node): number | null {
	let current: ESTree.Node | null = node;
	let distance = 0;
	while (current !== null) {
		if (current === ancestor) return distance;
		current = current.parent;
		distance += 1;
	}
	return null;
}

function nearestTypeBindings(
	name: string,
	use: ESTree.Node,
	environment: TypeAliasEnvironment,
): readonly TypeBinding[] {
	const candidates = environment.bindingsByName.get(name) ?? [];
	let nearestDistance = Number.POSITIVE_INFINITY;
	let nearest: TypeBinding[] = [];
	for (const candidate of candidates) {
		const distance = ancestorDistance(candidate.scope, use);
		if (distance === null || distance > nearestDistance) continue;
		if (distance === nearestDistance) {
			nearest.push(candidate);
			continue;
		}
		nearestDistance = distance;
		nearest = [candidate];
	}
	return nearest;
}

/** Compare generic parameter and ordinary type declaration scopes. */
function parameterShadowsTypeBinding(name: string, use: ESTree.Node, environment: TypeAliasEnvironment): boolean {
	const parameter = lexicalTypeParameter(name, use, environment.visitorKeys);
	if (parameter === null) return lexicalTypeParameterNames(use, environment.visitorKeys).has(name);
	const owner = parameter.parent.parent;
	const parameterDistance = owner === null ? null : ancestorDistance(owner, use);
	if (parameterDistance === null) return false;
	return nearestTypeBindings(name, use, environment).every((binding) =>
		(ancestorDistance(binding.scope, use) ?? Number.POSITIVE_INFINITY) > parameterDistance,
	);
}

/** Resolve a generic parameter only when no nearer declaration shadows it. */
export function visibleTypeParameter(name: string, use: ESTree.Node, environment: TypeAliasEnvironment): ESTree.TSTypeParameter | null {
	return parameterShadowsTypeBinding(name, use, environment)
		? lexicalTypeParameter(name, use, environment.visitorKeys)
		: null;
}

/** Collect interface declarations from the nearest visible type binding scope. */
export function visibleInterfaceDeclarations(
	name: string,
	use: ESTree.Node,
	environment: TypeAliasEnvironment,
): readonly ESTree.TSInterfaceDeclaration[] {
	if (parameterShadowsTypeBinding(name, use, environment)) return [];
	return nearestTypeBindings(name, use, environment).flatMap((binding) =>
		binding.declaration.type === "TSInterfaceDeclaration" ? [binding.declaration] : [],
	);
}

/** Resolve the nearest visible alias with this name, respecting lexical shadowing. */
export function visibleTypeAlias(
	name: string,
	use: ESTree.Node,
	environment: TypeAliasEnvironment,
): ESTree.TSTypeAliasDeclaration | null {
	if (parameterShadowsTypeBinding(name, use, environment)) return null;
	const bindings = nearestTypeBindings(name, use, environment);
	return bindings.length === 1 ? (bindings[0]?.alias ?? null) : null;
}

/** Identify explicit and declaration-script global interface augmentations. */
function isGlobalInterfaceAugmentation(binding: TypeBinding, environment: TypeAliasEnvironment, filename: string): boolean {
	if (binding.declaration.type !== "TSInterfaceDeclaration") return false;
	if (binding.scope.type === "TSModuleBlock" && binding.scope.parent.type === "TSModuleDeclaration") {
		return binding.scope.parent.global;
	}
	if (binding.scope.type !== "Program" || !/\.d\.[cm]?ts$/.test(filename)) return false;
	return !environment.program.body.some((statement) =>
		statement.type === "ImportDeclaration" || statement.type === "ExportNamedDeclaration" ||
		statement.type === "ExportDefaultDeclaration" || statement.type === "ExportAllDeclaration" ||
		statement.type === "TSExportAssignment" ||
		(statement.type === "TSImportEqualsDeclaration" && statement.moduleReference.type === "TSExternalModuleReference"),
	);
}

/** Return whether a local declaration shadows a built-in type at this use. */
export function hasVisibleTypeBinding(
	name: string,
	use: ESTree.Node,
	environment: TypeAliasEnvironment,
	includeGlobalInterfaceAugmentations = true,
	filename = "",
): boolean {
	return (
		parameterShadowsTypeBinding(name, use, environment) ||
		nearestTypeBindings(name, use, environment).some((binding) =>
			includeGlobalInterfaceAugmentations || !isGlobalInterfaceAugmentation(binding, environment, filename),
		)
	);
}

function typeReferenceName(type: ESTree.TSTypeReference): string | null {
	return type.typeName.type === "Identifier" ? type.typeName.name : null;
}

function aliasSubstitutions(
	alias: ESTree.TSTypeAliasDeclaration,
	reference: ESTree.TSTypeReference,
	base: Substitutions,
	resolvingAliases: ReadonlySet<ESTree.TSTypeAliasDeclaration>,
): Substitutions | null {
	const parameters = alias.typeParameters?.params ?? [];
	const arguments_ = reference.typeArguments?.params ?? [];
	const next = new Map(base);
	for (const [index, parameter] of parameters.entries()) {
		const explicitArgument = arguments_[index];
		const argument = explicitArgument ?? parameter.default;
		if (argument === null || argument === undefined) return null;
		const argumentSubstitutions = explicitArgument === undefined ? next : base;
		next.set(parameter, {
			type: argument,
			resolvingAliases,
			substitutions: new Map(argumentSubstitutions),
		});
	}
	return next;
}

/** Match a type after resolving visible aliases and substituting their type parameters. */
export function resolvedTypeMatches(
	type: ESTree.TSType,
	environment: TypeAliasEnvironment,
	matcher: ResolvedTypeMatcher,
): boolean {
	const evaluate = (
		current: ESTree.TSType,
		substitutions: Substitutions,
		resolvingAliases: ReadonlySet<ESTree.TSTypeAliasDeclaration>,
	): boolean => {
		if (current.type === "TSTypeReference") {
			const name = typeReferenceName(current);
			if (name !== null) {
				const parameter = visibleTypeParameter(name, current, environment);
				const substitution = parameter === null ? undefined : substitutions.get(parameter);
				if (substitution !== undefined && !current.typeArguments?.params.length) {
					return evaluate(
						substitution.type,
						substitution.substitutions,
						substitution.resolvingAliases,
					);
				}
				const alias = visibleTypeAlias(name, current, environment);
				if (alias !== null && !resolvingAliases.has(alias)) {
					const nextSubstitutions = aliasSubstitutions(alias, current, substitutions, resolvingAliases);
					if (nextSubstitutions !== null) {
						const nextResolving = new Set(resolvingAliases);
						nextResolving.add(alias);
						return evaluate(alias.typeAnnotation, nextSubstitutions, nextResolving);
					}
				}
			}
		}
		return matcher(current, (child) =>
			evaluate(child, substitutions, resolvingAliases),
		);
	};

	return evaluate(type, new Map(), new Set());
}
