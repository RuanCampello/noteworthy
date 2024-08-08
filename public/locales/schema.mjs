import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { generateSchema } from '@noteworthy-modules/utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputFilePath = resolve(__dirname, './english/translation.json');
const outputFilePath = resolve(__dirname, 'schema.json');

generateSchema(inputFilePath, outputFilePath);
