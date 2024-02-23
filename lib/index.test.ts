import {describe, it, expect} from 'vitest';
import {remark} from 'remark';
import {queryByText} from '@testing-library/dom';
import remarkMediaCard from '../index.js';

function formatMd(md: string) {
  return md.replace(/^\s+|\s+$/m, '');
}

describe('remark-media-card', () => {
  it('should work', async () => {
    expect(
      formatMd(
        String(
          await remark()
            .use(remarkMediaCard)
            .process(
              [
                '```media-card',
                'cover: https://www.baidu.com',
                'title: aaa',
                'type: book',
                '```',
              ].join('\n'),
            ),
        ),
      ),
    ).toMatch('<div class="media-card"');

    expect(
      formatMd(
        String(
          await remark()
            .use(remarkMediaCard)
            .process(
              ['```media-card', 'url / https://www.baidu.com', '```'].join(
                '\n',
              ),
            ),
        ),
      ),
    ).toEqual(
      ['```media-card', 'url / https://www.baidu.com', '```'].join('\n'),
    );

    expect(
      formatMd(
        String(
          await remark()
            .use(remarkMediaCard)
            .process(['```media-card', '---', '```'].join('\n')),
        ),
      ),
    ).toEqual(['```media-card', '---', '```'].join('\n'));

    expect(
      formatMd(
        String(
          await remark()
            .use(remarkMediaCard)
            .process(
              ['```media-card', 'cover: 1.jpg', 'type: book', '```'].join('\n'),
            ),
        ),
      ),
    ).toEqual(
      ['```media-card', 'cover: 1.jpg', 'type: book', '```'].join('\n'),
    );

    expect(
      formatMd(
        String(
          await remark()
            .use(remarkMediaCard)
            .process(
              ['```media-card', 'title: 1', 'type: book', '```'].join('\n'),
            ),
        ),
      ),
    ).toEqual(['```media-card', 'title: 1', 'type: book', '```'].join('\n'));

    expect(
      formatMd(
        String(
          await remark()
            .use(remarkMediaCard)
            .process(
              ['```media-card', 'cover: 1.jpg', 'title: 1', '```'].join('\n'),
            ),
        ),
      ),
    ).toEqual(['```media-card', 'cover: 1.jpg', 'title: 1', '```'].join('\n'));
  });

  it('should work without media card', async () => {
    expect(
      formatMd(
        String(
          await remark()
            .use(remarkMediaCard)
            .process(['```java', 'abc', '```'].join('\n')),
        ),
      ),
    ).toBe(['```java', 'abc', '```'].join('\n').trim());
  });
  it('should work with parameters', async () => {
    const testParameters = [
      'url: http://baidu.com',
      'cover: ./1.jpg',
      'title: test title',
      'author: test author',
      'artist: test artist',
      'director: test director',
      'rating: 9.9',
      'publishDate: 2023-01-01',
      'actors: test actors',
      'introduction: test introduction',
      'width: 300',
    ];
    const bookHtml = String(
      await remark()
        .use(remarkMediaCard)
        .process(
          [
            '```media-card',
            ...testParameters,
            'type: book',
            '其他: 支持',
            '```',
          ].join('\n'),
        ),
    );
    const bookDiv = document.createElement('div');
    bookDiv.innerHTML = bookHtml;
    expect(queryByText(bookDiv, 'test title')).toBeTruthy();
    expect(queryByText(bookDiv, '出版时间：2023-01-01')).toBeTruthy();
    expect(queryByText(bookDiv, '作者：test author')).toBeTruthy();
    expect(queryByText(bookDiv, '评分：9.9')).toBeTruthy();
    expect(queryByText(bookDiv, '艺术家：test artist')).toBeFalsy();
    expect(queryByText(bookDiv, '导演：test director')).toBeFalsy();
    expect(queryByText(bookDiv, '主演：test actors')).toBeFalsy();
    expect(queryByText(bookDiv, '其他：支持')).toBeTruthy();
    expect(bookDiv.querySelector('.media-card-introduction')).toBeTruthy();
    expect(
      bookDiv.querySelector('.media-card-cover')?.getAttribute('src'),
    ).toBe('./1.jpg');
    expect(bookDiv.querySelector('a')).toBeTruthy();

    const musicHtml = String(
      await remark()
        .use(remarkMediaCard)
        .process(
          ['```media-card', ...testParameters, 'type: music', '```'].join('\n'),
        ),
    );
    const musicDiv = document.createElement('div');
    musicDiv.innerHTML = musicHtml;
    expect(queryByText(musicDiv, 'test title')).toBeTruthy();
    expect(queryByText(musicDiv, '发行时间：2023-01-01')).toBeTruthy();
    expect(queryByText(musicDiv, '作者：test author')).toBeFalsy();
    expect(queryByText(musicDiv, '艺术家：test artist')).toBeTruthy();
    expect(queryByText(musicDiv, '导演：test director')).toBeFalsy();
    expect(queryByText(musicDiv, '主演：test actors')).toBeFalsy();

    const movieHtml = String(
      await remark()
        .use(remarkMediaCard)
        .process(
          ['```media-card', ...testParameters, 'type: movie', '```'].join('\n'),
        ),
    );
    const movieDiv = document.createElement('div');
    movieDiv.innerHTML = movieHtml;
    expect(queryByText(movieDiv, 'test title')).toBeTruthy();
    expect(queryByText(movieDiv, '上映时间：2023-01-01')).toBeTruthy();
    expect(queryByText(movieDiv, '作者：test author')).toBeFalsy();
    expect(queryByText(movieDiv, '艺术家：test artist')).toBeFalsy();
    expect(queryByText(movieDiv, '导演：test director')).toBeTruthy();
    expect(queryByText(movieDiv, '主演：test actors')).toBeTruthy();
  });
  it('should work without introduction', async () => {
    const html = String(
      await remark()
        .use(remarkMediaCard)
        .process(['```media-card', 'type: book', '```'].join('\n')),
    );
    const div = document.createElement('div');
    div.innerHTML = html;
    expect(div.querySelector('.media-card-introduction')).toBeFalsy();
  });
  it('should work without url', async () => {
    const html = String(
      await remark()
        .use(remarkMediaCard)
        .process(['```media-card', 'type: book', '```'].join('\n')),
    );
    const div = document.createElement('div');
    div.innerHTML = html;
    expect(div.querySelector('a')).toBeFalsy();
  });
});
