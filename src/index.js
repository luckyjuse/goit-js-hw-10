import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
  const searchElement = e.target.value.trim();
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';

  if (searchElement) {
    fetchCountries(searchElement)
      .then(countries => {
        if (countries.length > 10) {
          Notify.warning(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
        if (countries.length > 1) {
          renderCountries(countries);
          return;
        } else {
          renderCountry(countries);
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
      });
  }
  return;
}

function renderCountry(country) {
  const markUp = country
    .map(
      country =>
        `<img src="${country.flags.svg}" class = "big-flag" alt="flag">
        <h1>${country.name.official}</h1>
        <p><span class = "country-descriprion">Capital:</span> ${
          country.capital
        }</p>
        <p><span class = "country-descriprion">Population:</span> ${
          country.population
        }</p>
        <p><span class = "country-descriprion">Languages:</span> ${Object.values(
          country.languages
        )}</p>`
    )
    .join('');
  refs.countryInfo.insertAdjacentHTML('afterbegin', markUp);
}

function renderCountries(country) {
  const markUp = country
    .map(
      country =>
        `<li><img src="${country.flags.svg}" class = "small-flag" alt="flag"><p class = "countries-list">${country.name.common}</p></li>`
    )
    .join('');
  refs.countryList.insertAdjacentHTML('afterbegin', markUp);
}
