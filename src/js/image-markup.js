export { getImageCardMarkup };

function getImageCardMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
                  <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />

            <div class="info">
              <div class="info-block">
                <p class="info-item">
                  <b>Likes</b>
                </p>
                <p class="info-block-value">${likes}</p>
              </div>
              <div class="info-block">
                <p class="info-item">
                  <b>Views</b>
                </p>
                <p class="info-block-value">${views}</p>
              </div>

              <div class="info-block">
                <p class="info-item">
                  <b>Comments</b>
                </p>
                <p class="info-block-value">${comments}</p>
              </div>

              <div class="info-block">
                <p class="info-item">
                  <b>Downloads</b>
                </p>
                <p class="info-block-value">${downloads}</p>
              </div>            
          </div>
        </div>
      </a>
    </li>`;
      }
    )
    .join('');
}
