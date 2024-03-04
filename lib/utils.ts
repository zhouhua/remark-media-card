const langMap: Record<'publishDate', Record<string, string>> = {
  publishDate: {
    book: '出版时间',
    music: '发行时间',
    movie: '上映时间',
  },
};

export function html(strings: TemplateStringsArray, ...values: string[]) {
  let htmlString = '';
  for (const [i, string_] of strings.entries()) {
    htmlString += string_;
    if (i < values.length) {
      htmlString += values[i];
    }
  }

  return htmlString;
}

export function template(cardMeta: ICardMeta): string {
  const {
    url,
    cover,
    author,
    artist,
    director,
    rating,
    title,
    publishDate,
    type,
    actors,
    introduction,
    width,
    ...rest
  } = cardMeta;
  const cardItems: string[] = [`<strong>${title}</strong>`];
  if (author && type === 'book') {
    cardItems.push(`作者：${author}`);
  }

  if (artist && type === 'music') {
    cardItems.push(`艺术家：${artist}`);
  }

  if (director && type === 'movie') {
    cardItems.push(`导演：${director}`);
  }

  if (actors && type === 'movie') {
    cardItems.push(`主演：${actors}`);
  }

  if (langMap.publishDate[type] && publishDate) {
    cardItems.push(`${langMap.publishDate[type]}：${publishDate}`);
  }

  if (rating) {
    cardItems.push(`评分：${rating}`);
  }

  for (const [key, value] of Object.entries(rest)) {
    cardItems.push(`${key}：${value}`);
  }

  return html`
    <div class="media-card-wrap" style="margin: 0 auto;">
      ${url
        ? `<a
            href="${url}"
            target="_blank"
            style="text-decoration: none;"
          >`
        : ''}
      <div
        class="media-card"
        style="
          max-width: 100%;
          ${width ? `width: ${width}px;` : ''}
          display:flex;
          flex-direction: column;
          margin:30px 20px;
          padding: 20px;
          border-radius: 15px;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          z-index: 0;
        "
      >
        <div
          class="media-card-bg"
          style="
            width: 110%;
            height: 110%;
            position: absolute;
            top: -5%;
            left: -5%;
            z-index: -1;
            border-radius: 15px;
            background-color: antiquewhite;
            filter: blur(15px) brightness(0.6);
          "
        >
          <img
            src="${cover}"
            alt="bg"
            referrerpolicy="no-referrer"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </div>
        <div
          class="media-card-main"
          style="
            display: flex;
            flex-direction: column;
            font-family: 'Courier New', Courier, monospace;
            color: antiquewhite;
          "
        >
          <div
            class="media-card-meta"
            style="
              display: flex;
              align-items: center;
              gap: 12px;
            "
          >
            <div
              class="media-card-cover"
              style="
                height: 130px;
                width: 80px;
              "
            >
              <img
                src="${cover}"
                alt="cover"
                referrerpolicy="no-referrer"
                style="width: 100%; height: 100%; object-fit: contain;"
              />
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                gap: 6px;
                line-height: 1.4;
              "
            >
              ${cardItems.map((string_) => `<div>${string_}</div>`).join('')}
            </div>
          </div>
          ${introduction
            ? html`<div
                class="media-card-introduction"
                style="
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                display: -webkit-box;
                font-size: 14px;
                margin-top: 12px;
              "
              >
                ${introduction.replace('\n', '<br />')}
              </div>`
            : ''}
        </div>
      </div>
      ${url ? html`</a>` : ''}
    </div>
  `;
}
