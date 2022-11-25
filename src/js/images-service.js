import axios from 'axios';
const BASE_URL = 'https://pixabay.com';
const KEY = '31487195-9d4b254f893254d6179d6b379';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchImages() {
    const url = `${BASE_URL}/api/?page=${this.page}&key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;

    const response = await axios.get(url);
    console.log(this);
    this.incrementPage();
    return response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
