// Lets `node --test` run the TypeScript sources directly (Node ≥ 22.18 strips
// types natively). Resolves the "@/..." alias and extensionless imports the
// way Next.js does.
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src');

registerHooks({
  resolve(specifier, context, nextResolve) {
    let target = null;
    if (specifier.startsWith('@/')) target = path.join(srcRoot, specifier.slice(2));
    else if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:'))
      target = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);

    if (target && !path.extname(target)) {
      for (const candidate of [`${target}.ts`, `${target}.tsx`, path.join(target, 'index.ts')]) {
        if (existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
    return nextResolve(target ? pathToFileURL(target).href : specifier, context);
  },
});
