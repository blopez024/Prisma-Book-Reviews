function renderBookCover(title, author, colorStart, colorEnd) {
    return `
    <div class="book-cover" style="background: linear-gradient(to bottom right, ${colorStart}, ${colorEnd});">
      <div class="title">${title}</div>
      <div class="author">by ${author}</div>
    </div>
  `;
}

export { renderBookCover }