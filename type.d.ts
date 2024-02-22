declare module '@triskel/tinyhtml' {
  export default function tinyhtml(html: string): string;
}

declare type ICardMeta = {
  title: string;
  cover: string;
  type: 'book' | 'movie' | 'music';
  author?: string;
  publishDate?: string;
  rate?: string;
  url?: string;
  width?: string;
  introdution?: string;
} & Record<string, string>;
