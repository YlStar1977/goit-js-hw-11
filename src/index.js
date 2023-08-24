import axios from 'axios';
import Notiflix from 'notiflix';

const apiKey = '39007423-a1409bfea0ef7b11f585a3f27';
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;
let currentQuery = '';
let isFirstLoad = true;

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  gallery.innerHTML = '';
  currentPage = 1;
  currentQuery = e.target.searchQuery.value;
  
  if (currentQuery.trim() === '') {
    Notiflix.Notify.failure('Please enter a search query.');
  } else {
    await fetchImages(currentQuery, currentPage);
  }
});

loadMoreBtn.style.display = 'none';

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  await fetchImages(currentQuery, currentPage);
});

async function fetchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.hits.length > 0) {
      data.hits.forEach(image => {
        const card = createImageCard(image);
        gallery.appendChild(card);
      });

      if (data.totalHits <= currentPage * 40) {
        loadMoreBtn.style.display = 'none';
        gallery.insertAdjacentHTML('beforeend', '<p class="end-message">We\'re sorry, but you\'ve reached the end of search results.</p>');
      } else {
        loadMoreBtn.style.display = 'block';
      }
    } else {
      if (page === 1) {
        gallery.innerHTML = '<p class="no-results">Sorry, there are no images matching your search query. Please try again.</p>';
      }
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('Error fetching images. Please try again later.');
  }
}
function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const labelsRow = document.createElement('div');
  labelsRow.classList.add('info-row');

  const valuesRow = document.createElement('div');
  valuesRow.classList.add('info-row');

  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  labelsRow.appendChild(likes.label);
  labelsRow.appendChild(views.label);
  valuesRow.appendChild(likes.value);
  valuesRow.appendChild(views.value);

  labelsRow.appendChild(comments.label);
  labelsRow.appendChild(downloads.label);
  valuesRow.appendChild(comments.value);
  valuesRow.appendChild(downloads.value);

  info.appendChild(labelsRow);
  info.appendChild(valuesRow);

  card.appendChild(img);
  card.appendChild(info);

  return card;
}

function createInfoItem(labelText, valueText) {
  const label = document.createElement('p');
  label.classList.add('info-item', 'info-label');
  label.textContent = labelText;

  const value = document.createElement('p');
  value.classList.add('info-item', 'info-value');
  value.textContent = valueText;

  return { label, value };
}