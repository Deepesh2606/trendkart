/**
 * Lets the test suite import the app's `@/...` paths.
 *
 * Node has no idea about tsconfig path aliases, and there is no test runner
 * installed to do it for us — the sandbox this was built in had no network, so
 * the suite runs on `node:test` and type stripping alone. Twenty lines of resolve
 * hook is the whole price of zero new dependencies.
 *
 * Used as: node --experimental-strip-types --import ./tests/hooks.mjs --test tests/
 */
import { register } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SRC = new URL('../src/', import.meta.url);

export function resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) {
    const rest = specifier.slice(2);
    for (const candidate of [`${rest}.ts`, `${rest}/index.ts`, `${rest}.tsx`, rest]) {
      const url = new URL(candidate, SRC);
      if (existsSync(fileURLToPath(url))) {
        return next(url.href, context);
      }
    }
  }
  return next(specifier, context);
}

register(import.meta.url);
