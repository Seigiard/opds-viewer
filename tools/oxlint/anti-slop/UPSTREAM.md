# Upstream source

- Repository: https://github.com/dmmulroy/anti-slop
- Commit: `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b`
- Copied from: `skills/install-anti-slop/assets/anti-slop/`, verified by upstream `scripts/sync-skill-assets.mjs --check` against canonical `src/`.
- Installed at: `tools/oxlint/anti-slop/`, including Effect sources and vendored Stylistic license and provenance.
- Added files: this provenance record and upstream root `LICENSE`. Upstream tests are omitted by its installer.
- Local fixes: dictionary type substitutions retain their argument environment; explicit arguments use the caller environment and defaults use earlier parameters. Interface classification uses the nearest lexical declarations. These changes affect `shared/dictionary-types.ts`, `shared/type-alias-resolution.ts`, `shared/lexical-type-parameters.ts` and `rules/no-unknown-returns.ts`; other production files retain the recorded upstream bytes.
- Parameter substitutions and alias cycle guards use declaration identity. Argument evaluation restores the caller's cycle-resolution context, so finite nested applications remain distinct from recursive alias bodies. Same-name lexical declarations keep separate bindings.
- Mapped/inferred binders stop lookup of shadowed outer parameters. Class-expression names remain inside the class scope. Generic key aliases retain their argument context during open-dictionary classification.
- Nested conditional types own their infer parameters. Nearer block declarations take precedence over outer generic parameters. Generic unknown/object widening remains classified. Return checks distinguish local Promise contracts from built-in Promise types.
- Infer lookup skips a nested conditional's extends clause while retaining its other branches in the enclosing scope. Import-equals declarations participate in type shadowing. Global Promise interface augmentations retain built-in unknown-return checks.
- Declaration-script `.d.ts`, `.d.mts` and `.d.cts` interface augmentations retain built-in checks; import/export declaration modules keep local interface shadowing.
- Local regression coverage: `bun test tools/oxlint/anti-slop/dictionary-regression.test.ts` exercises accepted and rejected dictionary contracts through the real Oxlint CLI. The lint workflow runs these tests after owned-source lint.
- Coverage: all 18 generic rules plus `oxc/no-accumulating-spread`; Effect rules are enabled only for direct Effect dependencies.
