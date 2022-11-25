// import debounce from 'lodash.debounce';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ImagesApiService from './js/images-service';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(event) {
  event.preventDefault();

  imagesApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();
  imagesApiService.resetPage();

  imagesApiService.fetchImages().then(response => {
    console.log(response);
    const total = response.data.total;
    const totalHits = response.data.totalHits;

    if (total === 0) {
      notifyFailure();
    } else {
      notifySuccess(totalHits);
    }
  });

  // const totalHits = imagesApiService.fetchImages().data.totalHits;
  // total === 0 ? notifyFailure() : notifySuccess(totalHits);
}

function onLoadMoreBtnClick() {
  imagesApiService.fetchImages();
}

function notifySuccess(total) {
  Notify.success(`Hooray! We found ${total} images.`);
}

function notifyFailure() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notifyEndSearch() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}
