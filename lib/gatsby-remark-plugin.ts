import type {Root} from 'mdast';
import remarkMediaCard from './index.js';

const plugin = ({markdownAST}: {markdownAST: Root}) => {
  // Manipulate AST
  remarkMediaCard()(markdownAST);
  return markdownAST;
};

export default plugin;
