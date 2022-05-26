import {createSponsoredContent, createErrorMessage, validateEmailInput} from "./components.js";
import {callAPI, sponsorUrl} from "./api_utilities.js";

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

/* https://dev.to/tylerjdev/when-role-button-is-not-enough-dac
  keyboard input converted to click to open search bar*/
function keyDown(event) {
  const keyD = event.key !== undefined ? event.key : event.keyCode;
    if ( (keyD === 'Enter' || keyD === 13) || (['Spacebar', ' '].indexOf(keyD) >= 0 || keyD === 32)) {
    event.preventDefault();
    this.click();
  }
}

/*--------- search function ---------*/
function productSearch(submit) {
  submit.preventDefault();
  //define the search input and values splitting them for better results
  const searchInput = document.querySelector(".search-input");
  const searchTerms = searchInput.value.split(" ");
  window.location = `posts.html?search=${searchTerms}`;
}

/*------- Add Navigation Listeners -------*/
menuBtn.addEventListener("click", openCloseMenu);
searchBtn.addEventListener("click", openCloseSearch);
searchBtn.addEventListener('keydown', keyDown);
searchForm.addEventListener("submit", productSearch);

/*--------------------- Footer ------------------------*/
//sign up email submission
const signUpForm = document.querySelector(".signup-form");
const signUpInput = document.querySelector("#signup");
const signUpSubmit = document.querySelector(".signup-submit");
const signUpError = document.querySelector("#error-signup-email");

/*---------- Validate Sign Up ------------*/

function validateSignUp(submission){
  submission.preventDefault();
  if(validateEmailInput(signUpInput, signUpError)){
    signUpSubmit.setAttribute('disabled', 'disabled');
    signUpSubmit.value = "Success!";
    signUpSubmit.classList.add("signed-up");
  }
}

signUpForm.addEventListener("submit", validateSignUp);

/*---------- Sponsored ------------*/

//sponsor variables
const sponsorsContainer = document.querySelector(".sponsors-post-container");

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
