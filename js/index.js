// ------- imports --------
import {createPost, productSearch, openCloseMenu, openCloseSearch, createPostCompressed} from "./components/components.js"
import {callAPI, latestPostsUrl, sponsorUrl, addLoader, sortOldestUrl, createErrorMessage, createSponsors} from "./components/api_utilities.js"
import {menuBtn, searchBtn, searchForm, sponsorsContainer} from "./constants/constants.js"

//const corsUrl = "https://noroffcors.herokuapp.com/";
const latestContainer = document.querySelector(".latest-post-slider");
const newestContainer = document.querySelector(".newest-posts");
const popularContainer = document.querySelector(".most-commented");


/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);
//search
searchBtn.addEventListener("click", openCloseSearch);
searchForm.addEventListener("submit", productSearch);

/*-------------- get sponsors data --------------*/
createSponsors(sponsorUrl, sponsorsContainer)

/*-------------- Creating main page content --------------*/
// variables for next and previous button functions of latest images slider.
let latestPageCurrent = 1;
let latestPageCurrentMobile = 1;
let latestPageCurrentDesktop = 1;
let latestPageMax = 1;
let latestPageMaxMobile = 10;
let latestPageMaxDesktop = 5;
let latestPostsData = [];

async function createPageContent(){
  latestPostsData = await callAPI(latestPostsUrl);
  //set adjusting max if I don't add more than 20 posts
  if(latestPostsData.length < 20){
  latestPageMaxMobile = Math.ceil(latestPostsData.length/2);
  latestPageMaxDesktop = Math.ceil(latestPostsData.length/4);
  }
  //adds page content
  createPostImageSlider(latestPostsData, latestContainer);
  createPosts(latestPostsData , newestContainer, 2);
  // resize slider listener
  window.addEventListener("resize", adjustSliderWidths);
 
  const commentedPosts = latestPostsData.filter(filterCommentedPosts);
  const sortedCommentedPosts = sortMostCommented(commentedPosts);
  createPosts(sortedCommentedPosts, popularContainer, 4);

  }

createPageContent()

/*-------------- Newest Posts -----------------*/

function createPosts(data, container, amount){
  container.innerHTML = "";
  for(let i = 0; i < amount; i++){
    container.innerHTML += createPost(data[i]);
  }
}

/*--------------- Popular/Most commented posts ----------------*/

//filters out undefined
function filterCommentedPosts(data){
  if(data._embedded !== undefined){
    if(data._embedded.replies !== undefined){
      return true
    }
  }
}

function sortMostCommented(data){
  return data.sort((a, b) => b._embedded.replies[0].length - a._embedded.replies[0].length);
}

/*-------------- Responsive Latest content slider -----------------*/

/* designed to handle the 20 results the call was limited to (also makes
   the math easier) and shrink on mobile to 2 posts at a time from 4*/

let slidePercentage = 10;

//function for resize listener to update slider on window resize.
function adjustSliderWidths(){
  getWidths()
  changePageNumber(0)
  transformSlider()
}

// updates max number of pages and slide % amount
function getWidths(){
  if(window.innerWidth < 720){
    slidePercentage = 10
    latestPageMax = Math.ceil(latestPostsData.length/2);
  }
  else if(window.innerWidth >= 720){
    slidePercentage = 20
    latestPageMax = Math.ceil(latestPostsData.length/4);
  };
}

// calculates the amount of transform depending on screen width
function transformSlider(){
  if(window.innerWidth < 720){
    let transform = (latestPageCurrent- 1) * slidePercentage;
    latestContainer.style.transform = `translateX(-${transform}%)`
  }
  else if(window.innerWidth >= 720){
    let transform = (latestPageCurrent - 1) * slidePercentage;
    latestContainer.style.transform = `translateX(-${transform}%)`
  };
}

/*function to update the page number and disable buttons (little bit messy)
throw in 0 just for resize, 1 for next, -1 for previous page changes*/
function changePageNumber(Num){
  if(window.innerWidth < 720){
    latestPageCurrentMobile = latestPageCurrentMobile + (Num * 1);
    latestPageCurrentDesktop = latestPageCurrentDesktop + (Num * 0.5);
    latestPageCurrent = latestPageCurrentMobile;
    // page 2 button would be disabled
    if(latestPageCurrent > 1){
      latestPrevious.disabled = false;
    }
    if(latestPageCurrent < latestPageMaxMobile){
      latestNext.disabled = false;
    }
  }
  else if(window.innerWidth >= 720){
    latestPageCurrentMobile = latestPageCurrentMobile + (Num * 2);
    latestPageCurrentDesktop = latestPageCurrentDesktop + (Num * 1);
    latestPageCurrent  = Math.floor(latestPageCurrentDesktop);
    if(latestPageCurrent > 1){
      latestPrevious.disabled = false;
    }
    if(latestPageCurrent === latestPageMaxDesktop){
      latestNext.disabled = true;
      latestNextArrow.style.display = "none"
    }
  }
  if(latestPageCurrent === 1){
    latestPrevious.disabled = true;
    latestPreviousArrow.style.display = "none"
    }
}

//create responsive image slider
function createPostImageSlider(data, container){
  container.innerHTML= "";
  latestPageMax = latestPageMaxDesktop;
  //adjusting width variables for container style updates
  getWidths();
  //variable for translate percentage on buttons.
  let slide = document.createElement("div");
  slide.classList = "latest-slider-content";

  for(let i = 0; i < data.length; i++){
    //every 4 posts creates new slide
    if(i!== 0 && i%4 === 0){
      container.appendChild(slide);
      slide = document.createElement("div");
      slide.classList = "latest-slider-content";
    }
    //create post and adds to slide
    let post = createPostCompressed(data[i]);
    slide.innerHTML+=post;
    }
  //appends last slide
  container.appendChild(slide);
  
}

//grabs for arrows and button variables
const latestNext = document.querySelector(".latest-next");
const latestPrevious = document.querySelector(".latest-previous");
const latestPreviousArrow = document.querySelector(".previous-arrow");
const latestNextArrow = document.querySelector(".next-arrow");

//event listeners for next and previous buttons
latestPrevious.addEventListener("click", previousPage);
latestPreviousArrow.addEventListener("click", previousPage);
latestNext.addEventListener("click", nextPage);
latestNextArrow.addEventListener("click", nextPage);
latestPreviousArrow.style.display = "none";

//change page functions for latest posts
function previousPage(){
  changePageNumber(-1);
  transformSlider()
  latestNext.disabled = false;
  latestNextArrow.style.display = "block"
  //disables button on first page
  if(latestPageCurrent === 1){
    latestPrevious.setAttribute('disabled', 'disabled');
    latestPreviousArrow.style.display = "none";
  }
}

function nextPage(){
  changePageNumber(1);
  transformSlider()
  latestPrevious.disabled = false;
  latestPreviousArrow.style.display = "block";
  //disables button on last page
  if(latestPageCurrent === latestPageMax){
    latestNext.setAttribute('disabled', 'disabled');
    latestNextArrow.style.display = "none"
  }
}



