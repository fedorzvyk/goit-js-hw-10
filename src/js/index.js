import '../css/styles.css';
import countryListMarkup from '../templates/countriesList.hbs';
import countryInfoMarkup from '../templates/countryInfo.hbs';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
let name = '';

const notifyOptions = {
  cssAnimationStyle: 'from-left',
};

const inputRef = document.querySelector('#search-box');
const countyList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

countyList.addEventListener('click', choiseCountryOnClick);

function onInput() {
  name = inputRef.value.trim();
  renderHTML(name);
}

function choiseCountryOnClick(e) {
  const elem = e.target.parentNode;
  if (elem.nodeName == 'LI') {
    name = elem.lastElementChild.textContent;
    renderHTML(name);
    // inputRef.value = name;
  }
}

function renderHTML(name) {
  if (name != '') {
    countyList.innerHTML = '';
    countryInfo.innerHTML = '';

    fetchCountries(name)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.',
            notifyOptions
          );
        } else if (data.length > 2) {
          countyList.innerHTML = countryListMarkup(data);
        } else if ((data.length = 1)) {
          countryInfo.innerHTML = countryInfoMarkup(data);
        }
      })
      .catch(error => {
        console.log(error);
        Notify.failure(
          'Oops, there is no country with that name',
          notifyOptions
        );
      });
  }
}
