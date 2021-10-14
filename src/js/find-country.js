import markupCountry from "../templates/countries-markup.hbs";
import countryList from "../templates/country-list.hbs";
import API from "./fetchCountries.js";
import getRefs from "./get-refs.js";
import { debounce } from "debounce";
import pnotify from "./pnotify";

const refs = getRefs();

refs.input.addEventListener(
  "input",
  debounce((e) => {
    onInputValue(e);
  }, 500)
);

function onInputValue(e) {
  e.preventDefault();
  const value = e.target.value;
  if (!value) {
    clearMarkup();
    return;
  }
  searchCountry(value);
}

function searchCountry(value) {
  API.fetchCountry(value)
    .then((country) => {
      if (!country) {
        return;
      } else if (country.length > 10) {
        clearMarkup();

        const message =
          "Too many matches found. Please enter a more specific query!";

        pnotify({
          title: "Error",
          text: message,
          delay: 1500,
        });
      } else if (country.length >= 2 && country.length <= 10) {
        createCountryListMarkup(country);
      } else if (country.length === 1) {
        createMarkup(country);
      } else {
        pnotify({
          title: "Eror",
          text: "No country has been found. Please enter a more specific query!",
          delay: 1500,
        });
      }
    })
    .catch((error) => {
      onError();
    });
}

function createMarkup(country) {
  const markup = markupCountry(country);
  refs.markup.innerHTML = markup;
}

function createCountryListMarkup(list) {
  const markup = countryList(list);
  refs.markup.innerHTML = markup;
}

function clearMarkup() {
  refs.markup.innerHTML = "";
}

function onError() {
  pnotify({
    title: "Critical error",
    text: "Something went wrong.",
    delay: 500,
  });
}
