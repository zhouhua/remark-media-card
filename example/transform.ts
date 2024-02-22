import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {unified} from 'unified';
import remarkMediaCard from '../index.js';

const __dirname = fileURLToPath(new URL('./', import.meta.url));

const markdown = await readFile(resolve(__dirname, 'origin.md'));

const file = await unified()
  .use(remarkParse)
  .use(remarkMediaCard)
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeStringify, {allowDangerousHtml: true})
  .process(markdown);

await writeFile(resolve(__dirname, 'output.html'), file.toString());
