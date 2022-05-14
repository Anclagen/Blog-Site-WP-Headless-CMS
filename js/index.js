// ------- imports --------
import {createPost, productSearch, openCloseMenu, openCloseSearch, createPostCompressed} from "./components/components.js"
import {callAPI, latestPostsUrl, sponsorUrl, addLoader, sortOldestUrl, createErrorMessage, createSponsors} from "./components/api_utilities.js"
import {menuBtn, searchBtn, searchForm, sponsorsContainer} from "./constants/constants.js"

//const corsUrl = "https://noroffcors.herokuapp.com/";
const latestContainer = document.querySelector(".latest-post-slider");
const newestContainer = document.querySelector(".newest-posts");


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
let latestPageMaxMobile = 1;
let latestPageMaxDesktop = 1;
let sortNewPostData = [];

async function createPageContent(){
  sortNewPostData = await callAPI(latestPostsUrl);
  //set page max for latest
  latestPageMaxMobile = Math.ceil(sortNewPostData.length/2);
  latestPageMaxDesktop = Math.ceil(sortNewPostData.length/4);
  
  //adds page content
  createPostImageSlider(sortNewPostData, latestContainer);
  createNewestPosts(sortNewPostData , newestContainer);

  // resize slider listener
  window.addEventListener("resize", adjustSliderWidths);
  }

createPageContent()

/*-------------- Newest Posts -----------------*/

function createNewestPosts(data, container){
  container.innerHTML = "";
  for(let i = 0; i < 2; i++){
    container.innerHTML += createPost(data[i]);
  }
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
    latestPageMax = Math.ceil(sortNewPostData.length/2);
  }
  else if(window.innerWidth >= 720){
    slidePercentage = 20
    latestPageMax = Math.ceil(sortNewPostData.length/4);
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

//function to update the page number and disable buttons (little bit messy)
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

//grabs for variables
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



