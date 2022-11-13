import '../css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
let name = '';

const notifyOptions = {
  cssAnimationStyle: 'from-left',
};

const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

countryList.addEventListener('click', choiseCountryOnClick);

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
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';

    fetchCountries(name)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.',
            notifyOptions
          );
        } else if (data.length > 1) {
          const markupcountryList = data
            .map(
              item => `<li class="country-item">
            <img src = "${item.flags.svg}" alt="Flag" width = "50px"/>
            <h3>${item.name.official}</h3>
            </li>`
            )
            .join('');
          countryList.innerHTML = markupcountryList;
        } else {
          const markupcountryInfo = `
          <img class="flag" src = "${
            data[0].flags.svg
          }" alt="Flag" width="100px"/>
            <h2 class="country-name">${data[0].name.official}</h2>
                     <p class="capital-name"><span style="font-weight:700">Capital:</span> ${
                       data[0].capital
                     }</p>
                     <p class="population"><span style="font-weight:700">Population:</span> ${
                       data[0].population
                     }</p>
                     <p class="languages"><span style="font-weight:700">Languages:</span> ${Object.values(
                       data[0].languages
                     )}</p>`;
          countryInfo.innerHTML = markupcountryInfo;
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
