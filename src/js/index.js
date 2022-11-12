import '../css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
let name = '';

const inputRef = document.querySelector('#search-box');
const countyList = document.querySelector('.country-list');
const countyInfo = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput() {
  name = inputRef.value.trim();
  if (name != '') {
    countyList.innerHTML = '';
    countyInfo.innerHTML = '';
    fetchCountries(name)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length > 2) {
          const markupcountyList = data
            .map(
              item => `<li class="country-item">
            <img src = "${item.flags.svg}" alt="Flag" width = "50px"/>
            <h3>${item.name.official}</h3>
            </li>`
            )
            .join('');
          countyList.innerHTML = markupcountyList;
        } else if ((data.length = 1)) {
          const markupcountyInfo = `
          <img class="flag" src = "${
            data[0].flags.svg
          }" alt="Flag" width="75px"/>
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
          countyInfo.innerHTML = markupcountyInfo;
        }
      })
      .catch(error => {
        console.log(error);
        Notify.failure('Oops, there is no country with that name');
      });
  }
}
