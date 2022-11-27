// import debounce from 'lodash.debounce';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './js/images-service';
import { getImageCardMarkup } from './js/image-markup';
import LoadMoreBtn from './js/load-more-btn';

const refs = {
  form: document.querySelector('#search-form'),
  galleryList: document.querySelector('.gallery-list'),
  // endSearchMessage: document.querySelector('.end-search-message'),
};

const lightbox = new SimpleLightbox('.gallery a', {
  captions: false,
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });

const imagesApiService = new ImagesApiService();

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtnClick);

// smoothScroll();

async function onFormSubmit(event) {
  event.preventDefault();

  imagesApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();

  if (imagesApiService.query === '') {
    return notifyEpmtyInput();
  }

  loadMoreBtn.hide();
  imagesApiService.resetPage();
  clearImagesMarkup();
  // refs.endSearchMessage.classList.add('is-hidden');

  try {
    await imagesApiService.fetchImages().then(data => {
      if (data.total === 0) {
        notifyFailure();
      } else if (data.hits.length === data.totalHits) {
        appendImagesMarkup(data.hits);
        notifySuccess(data.totalHits);
        notifyEndOfSearch();
        // refs.endSearchMessage.classList.remove('is-hidden');
      } else {
        appendImagesMarkup(data.hits);
        notifySuccess(data.totalHits);
        loadMoreBtn.show();
        loadMoreBtn.enable();
      }
    });
  } catch (error) {
    Notify.failure(error.message);
    clearImagesMarkup();
  }
}

async function onLoadMoreBtnClick() {
  loadMoreBtn.disable();

  try {
    await imagesApiService.fetchImages().then(data => {
      const pageCount = data.totalHits / imagesApiService.per_page;

      if (pageCount <= imagesApiService.page - 1) {
        appendImagesMarkup(data.hits);
        smoothScroll();
        loadMoreBtn.hide();
        notifyEndOfSearch();
        // refs.endSearchMessage.classList.remove('is-hidden');
      } else {
        appendImagesMarkup(data.hits);
        smoothScroll();
        loadMoreBtn.enable();
      }
    });
  } catch (error) {
    Notify.failure(error.message);
    clearImagesMarkup();
    loadMoreBtn.hide();
  }
}

function appendImagesMarkup(images) {
  refs.galleryList.insertAdjacentHTML('beforeend', getImageCardMarkup(images));
  lightbox.refresh();
}

function clearImagesMarkup() {
  refs.galleryList.innerHTML = '';
}

function notifySuccess(total) {
  Notify.success(`Hooray! We found ${total} images.`);
}

function notifyFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notifyEpmtyInput() {
  Notify.info('The input field is empty. Please enter some query.');
}

function notifyEndOfSearch() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}

function smoothScroll() {
  const { height: cardHeight } =
    refs.galleryList.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
