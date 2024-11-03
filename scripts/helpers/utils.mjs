import { resolve as stlResolve, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const requireCore = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const resolve = (...paths) => stlResolve(__dirname, '../../', ...paths);

export const require = (...paths) => requireCore(resolve(...paths));
