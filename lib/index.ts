import type {Code, Html, Root} from 'mdast';
import {visit} from 'unist-util-visit';
import {parse} from 'yaml';
import tinyhtml from '@triskel/tinyhtml';
import {template} from './utils.js';

export default function remarkMediaCard() {
  return function (syntaxTree: Root) {
    visit(syntaxTree, 'code', (node: Code) => {
      const {lang, value} = node;
      if (!value || lang !== 'media-card') {
        return;
      }

      try {
        const data = parse(value) as ICardMeta;
        if (typeof data !== 'object' || !data) {
          return;
        }

        const {type, cover, title} = data;
        if (!type || !cover || !title) {
          return;
        }

        (node as unknown as Html).type = 'html';
        node.value = tinyhtml(template(data));
      } catch (error) {
        console.log(error);
      }
    });
  };
}
