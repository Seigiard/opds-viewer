import { expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const cases = [
  ["global d.mts Promise still rejects unknown", "interface Promise<T> {traceId?: string} declare function load(): Promise<unknown>;", 1, "global.d.mts"],
  ["global d.cts Promise still rejects unknown", "interface Promise<T> {traceId?: string} declare function load(): Promise<unknown>;", 1, "global.d.cts"],
  ["module d.mts Promise remains local", "export {}; interface Promise<T> {value:string} declare function load(): Promise<unknown>;", 0, "module.d.mts"],
  ["module d.cts Promise remains local", "export {}; interface Promise<T> {value:string} declare function load(): Promise<unknown>;", 0, "module.d.cts"],
  ["global declaration file Promise still rejects unknown", "interface Promise<T> {traceId?: string} declare function load(): Promise<unknown>;", 1, "global.d.ts"],
  ["module declaration file Promise remains local", "export {}; interface Promise<T> {value:string} declare function load(): Promise<unknown>;", 0, "module.d.ts"],
  ["global Promise augmentation still rejects unknown", "export {}; declare global { interface Promise<T> {traceId?: string} function f(): Promise<unknown>; }", 1],
  ["outer infer inside nested true branch remains scoped", "type Value = object; export type D<T> = T extends (string extends string ? (infer Value extends string) : never) ? Record<string,Value> : never;", 0],
  ["import-equals Promise is a concrete interface", "declare namespace Contracts { export interface Promise<T> {value:string} } import Promise = Contracts.Promise; export declare function f(): Promise<unknown>;", 0],
  ["generic parameter shadows module type in return", "type T = string; type Id<T> = T; export declare function f(): Id<unknown>;", 1],
  ["generic parameter shadows module type in widening", "type T = string; type Id<T> = T; export const value: Id<unknown> = 'ok';", 1],
  ["built-in Promise still rejects unknown", "export declare function f(): Promise<unknown>;", 1],
  ["generic unknown widening remains classified", "type Id<T> = T; export const value: Id<unknown> = 'ok';", 1],
  ["nested infer does not hide module interface", "interface Value {} export type Items<T> = T extends (string extends infer Value ? number : never) ? Record<string,Value> : never;", 1],
  ["nested infer does not hide module alias", "type Value = object; export type D<T> = T extends (string extends infer Value ? Value : never) ? Record<string,Value> : never;", 1],
  ["block alias shadows outer function parameter", "export function f<T>(input:T) { { type T = object; type Items = Record<string,T>; } return input; }", 1],
  ["block return alias shadows outer function parameter", "export function f<T>() { { type T = unknown; function g():T { throw new Error(); } } }", 1],
  ["local Promise is a concrete interface", "interface Promise<T> {value:string} export declare function f(): Promise<unknown>;", 0],
  ["mapped parameter shadows outer parameter", "type Dict<T> = { [T in 'id']: T }; export type Safe = Dict<unknown>;", 0],
  ["class expression name does not shadow module alias", "type Value = {}; export const C = class Value {}; export type Items = Record<string,Value>;", 1],
  ["class expression name does not shadow built-in Record", "export const C = class Record {}; export type Unsafe = Record<string,unknown>;", 1],
  ["generic key alias preserves open dictionary detection", "type Key<K extends PropertyKey> = K; type Dict<K extends PropertyKey,V> = Record<Key<K>,V>; export const value: Dict<string,string> = {id:'ok'};", 1],
  ["distinct same-name aliases resolve to unsafe empty value", "type Value = {}; type Base = Value; export function f() { type Value = Base; type Items = Record<string,Value>; }", 1],
  ["outer function parameter remains captured by dictionary", "export function f<T extends {id: string}>() { type Captured = Record<string,T>; type Wrap<T> = Captured; type Safe = Wrap<unknown>; }", 0],
  ["outer function parameter remains captured by return", "export function f<T extends string>(value: T) { type Local = T; type Wrap<T> = Local; function g(): Wrap<unknown> { return value; } return g; }", 0],
  ["finite module key remains finite", "type V = 'id'; type Keys = V; type Dict<V> = Record<Keys,V>; export const value: Dict<string> = {id: 'ok'};", 0],
  ["recursive dictionary terminates", "export type Recursive<T> = Record<string, Recursive<T>>;", 0],
  ["safe default argument sees earlier parameter", "type Dict<A,B=A> = Record<string,B>; export type Safe = Dict<string>;", 0],
  ["caller parameter does not replace module type", "type T = string; type Base = Record<string,T>; type Wrap<T> = Base; export type Safe = Wrap<unknown>;", 0],
  ["nested identity dictionary remains unsafe", "type Id<T> = T; export type Unsafe = Record<string,Id<Id<unknown>>>;", 1],
  ["caller parameter does not replace module return type", "type T = string; type Base = T; type Wrap<T> = Base; export declare function f(): Wrap<unknown>;", 0],
  ["nested identity return remains unknown", "type Id<T> = T; export declare function f(): Id<Id<unknown>>;", 1],
  ["swapped safe arguments", "type Value<A,B> = Record<string,B>; type Swapped<A,B> = Value<B,A>; export type Safe = Swapped<string,unknown>;", 0],
  ["swapped unsafe arguments", "type Value<A,B> = Record<string,B>; type Swapped<A,B> = Value<B,A>; export type Unsafe = Swapped<unknown,string>;", 1],
  ["safe union argument", "type Dict<T> = Record<string,T>; type OptionalDict<T> = Dict<T | undefined>; export type Safe = OptionalDict<string>;", 0],
  ["unsafe union argument", "type Dict<T> = Record<string,T>; type OptionalDict<T> = Dict<T | undefined>; export type Unsafe = OptionalDict<unknown>;", 1],
  ["concrete local interface shadows empty outer interface", "interface Item {} export function f() { interface Item { id: string } type Items = Record<string,Item>; }", 0],
  ["empty local interface shadows concrete outer interface", "interface Item { id: string } export function f() { interface Item {} type Items = Record<string,Item>; }", 1],
  ["default argument sees earlier parameter", "type Dict<A,B=A> = Record<string,B>; export type Unsafe = Dict<unknown>;", 1],
] as const;

for (const [name, source, status, filename = "input.ts"] of cases) {
  test(name, () => {
    // #given
    const directory = mkdtempSync(join(tmpdir(), "anti-slop-regression-"));
    const config = join(directory, ".oxlintrc.json");
    const input = join(directory, filename);
    writeFileSync(input, source);
    writeFileSync(config, JSON.stringify({
      categories: { correctness: "off" },
      jsPlugins: [{ name: "anti-slop", specifier: resolve(import.meta.dir, "index.ts") }],
      rules: { "anti-slop/no-unsafe-dictionary-type": "error", "anti-slop/no-unknown-returns": "error", "anti-slop/no-known-value-widening": "error" },
    }));
    try {
      // #when
      const result = Bun.spawnSync([resolve(import.meta.dir, "../../../node_modules/.bin/oxlint"), "--config", config, input], { timeout: 10000 });
      // #then
      const output = new TextDecoder().decode(result.stderr) + new TextDecoder().decode(result.stdout);
      expect({ status: result.exitCode, crashed: /RangeError|Maximum call stack/.test(output), rejectedContract: output.includes("unsafe-dictionary-type") || output.includes("no-unknown-returns") || output.includes("no-known-value-widening") }).toEqual({ status, crashed: false, rejectedContract: status === 1 });
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
