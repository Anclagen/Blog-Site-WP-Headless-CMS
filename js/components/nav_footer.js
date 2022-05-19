import {createSponsoredContent, createErrorMessage} from "./components.js"
import {callAPI, sponsorUrl, } from "./api_utilities.js"
/*-------------------- Navigation -------------------------*/

/*--------  Menu Open/Close --------*/
//navigation variables
const menuBtn = document.querySelector(".menu-button");
const searchBtn = document.querySelector(".search-button");
const searchForm = document.querySelector(".search-form");

//menu on phone
function openCloseMenu(){
  const menuLinks = document.querySelector(".navigation-menu");
  const hamTopLine = document.querySelector(".line1");
  const hamMidLine = document.querySelector(".line2");
  const hamBotLine = document.querySelector(".line3");
  menuLinks.classList.toggle("hide-menu");
  hamTopLine.classList.toggle("menu-open-rotate1");
  hamBotLine.classList.toggle("menu-open-rotate3");
  hamMidLine.classList.toggle("menu-open-transparent");
}

//displays search input
function openCloseSearch(){
  const searchContainer = document.querySelector(".search-container");
  searchContainer.classList.toggle("hidden-search");
  focus(document.querySelector(".search-input"));
}

/*--------- search function ---------*/
function productSearch(submit) {
  submit.preventDefault();
  //define the search input and value
  const searchInput = document.querySelector(".search-input");
  const searchTerms = searchInput.value.split(" ");
  window.location = `posts.html?search=${searchTerms}`;
}

/*------- Add Listeners -------*/
menuBtn.addEventListener("click", openCloseMenu);
searchBtn.addEventListener("click", openCloseSearch);
searchForm.addEventListener("submit", productSearch);

/*--------------------- Footer ------------------------*/

//sponsor variables
const sponsorsContainer = document.querySelector(".sponsors-post-container");

/*---------- Sponsored ------------*/
async function createSponsors(sponsorUrl, sponsorsContainer){
  try{
  //fill sponsor content
  const sponsorData = await callAPI(sponsorUrl);
  createSponsoredContent(sponsorData, sponsorsContainer);
  } catch(error){
    console.log(error);
    createErrorMessage(sponsorsContainer);
  }
}

createSponsors(sponsorUrl, sponsorsContainer);
