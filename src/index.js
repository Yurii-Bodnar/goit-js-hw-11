import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '29465886-f70572c8b9c11640077f8b34a';
const BASE_URL = 'https://pixabay.com/api/';
// const FILTER_RESPONSE = 'q,image_type=photo,orientation,safesearch=true'

const SearchFormRef = document.querySelector('.search-form');
const gelaryRef = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let currentPage = 1;
async function getAxios(value) {
  let options = {
    baseURL: `${BASE_URL}?key=${API_KEY}`,
    method: 'GET',
    params: {
      page: currentPage,
      per_page: 40,
      q: value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  };

//   try {
    const response = await axios(options);
    console.log(response);

    return response.data;
//   } catch (error) {
//     console.log(error);
//   }
}

SearchFormRef.addEventListener('submit', onFormSubmitt);

function onFormSubmitt(event) {
  event.preventDefault();

  const inputValue = SearchFormRef.elements.searchQuery.value;
  gelaryRef.innerHTML = '';
  if (inputValue === '') {
    Notiflix.Notify.warning('Ви ввели пусту строку');
  } else {
    getPhotoForPage();
  }
}

async function getPhotoForPage() {
  const inputValue = SearchFormRef.elements.searchQuery.value;
  const response = await getAxios(inputValue);

  if (response.total == 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const maxPage = Math.ceil(response.totalHits / 40);

  gelaryRef.innerHTML += renderMurcup(response.hits);

  let gallery = new SimpleLightbox('.gallery a');
  gallery.on('show.simplelightbox', function () {
    captionsDelay: 250;
  });
  if(maxPage == currentPage){
    Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.")
    // loadMore.setAttribute("hidden","hidden")
    loadMore.classList.add("load-more--hidden")
  }else{
    // loadMore.removeAttribute('hidden');
    loadMore.classList.remove("load-more--hidden")
  }
  
}

loadMore.addEventListener('click', () => {
  currentPage += 1;
  getPhotoForPage();
});

function renderMurcup(imiges) {
  const marcup = imiges
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card"> 
                <a class="photo-link" href="${largeImageURL}" >
                
                    <img class="photo-img"
                    src="${webformatURL}" alt="${tags}" loading="lazy" />
              
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b> ${likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>  ${views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>  ${comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>  ${downloads}
                    </p>
                </div>
            </a> 
        </div>`;
      }
    )
    .join('');
  return marcup;
}
