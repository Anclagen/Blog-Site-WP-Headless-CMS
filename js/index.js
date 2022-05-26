// ------- imports --------
import {createPost, createPostCompressed, createErrorMessage} from "./components/components.js"
import {callAPI, latestPostsUrl, baseUrl, routes, parameters} from "./components/api_utilities.js"


/*-------------- Creating main page content --------------*/
const latestContainer = document.querySelector(".latest-post-slider");
const newestContainer = document.querySelector(".newest-posts");
const popularContainer = document.querySelector(".most-commented");
const bannerImageContainer = document.querySelector(".index-heading");
const additionalContentContainer = document.querySelector(".additional-content");

// variables for slider functionality.
let sliderLengthMax = 20;
let latestPostsData = [];

async function createPageContent(){
  try{
    //updates header image, and any additional content user wants to add
    const homeData = await callAPI(baseUrl + routes.page + "/168" + "?" + parameters.embed);
    bannerImageContainer.style.backgroundImage = `url("${homeData.featured_image.size_full}")`;
    additionalContentContainer.innerHTML = homeData.content.rendered;

    //grabs post data
    latestPostsData = await callAPI(latestPostsUrl);
    //latestPostsData = latestPostsData.concat(latestPostsData)
    
    //adds page content for slider and new
    createSliderContent(latestPostsData, latestContainer);
    // resize slider listener
    window.addEventListener("resize", adjustSliderWidths);

    createPosts(latestPostsData , newestContainer, 2);

    //filtering results for commented posts and sorting by most commented
    const commentedPosts = latestPostsData.filter(filterCommentedPosts);
    const sortedCommentedPosts = sortMostCommented(commentedPosts);

    createPosts(sortedCommentedPosts, popularContainer, 4);
  } catch(error){
    console.log(error)
    createErrorMessage(latestContainer)
  }
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

//filters out undefined(posts with no embedded replies)
function filterCommentedPosts(data){
  if(data._embedded !== undefined){
    if(data._embedded.replies !== undefined){
      return true
    }
  }
}

//sorts high to low
function sortMostCommented(data){
  return data.sort((a, b) => b._embedded.replies[0].length - a._embedded.replies[0].length);
}

/*-------------- Responsive Latest content slider -----------------*/

/* Limited to 20 posts max, resizes from 1 to 2 to 4 posts at a time 
   depending on the screen size, and*/

//
let slidePercentage = 5;
let transformMax = 95;
let transform = 0;

//create slider content
function createSliderContent(data, container){
  container.innerHTML= "";
  sliderLengthMax = data.length;
  disableButtons();
  for(let i = 0; i < data.length; i++){
    if(i === 20){
      sliderLengthMax = 20
      break
    }
    container.innerHTML += `<div class="latest-slider-content">${createPostCompressed(data[i])}</div>`;
  }
}

//function for resize listener to update slider on window resize.
function adjustSliderWidths(){
  calculateTransform(0);
  transformSlider();
  disableButtons();
}

// calculates the amount of transform depending on screen width
function transformSlider(){
    //transform = (latestPageCurrent - 1) * slidePercentage;
      if(window.innerWidth >= 1100){
        if(transform > ((sliderLengthMax-4) * slidePercentage)){
          transform = (sliderLengthMax-4) * slidePercentage;
        }
      }else if(window.innerWidth >= 720){
        if(transform > ((sliderLengthMax-2) * slidePercentage)){
          transform = (sliderLengthMax-2) * slidePercentage;
      };
      }
    latestContainer.style.transform = `translateX(-${transform}%)`;
}

/*  function to update the page number 
throw in 0 just for resize, 1 for next, -1 for previous page changes*/
function calculateTransform(num){
  if(window.innerWidth < 720){
    transform += (5*num)
  }else if(window.innerWidth >= 1100){
    transform += (20*num)
  }else if(window.innerWidth >= 720){
    transform += (10*num)
  };
  if(transform < 0){
    transform = 0;
  }
}

// disables buttons and adjust the max transform according to screen size
function disableButtons(){
  if(transform === 0){
    latestPrevious.setAttribute('disabled', 'disabled');
    latestPreviousArrow.style.display = "none";
  } else {
    latestPrevious.disabled = false;
    latestPreviousArrow.style.display = "block";
  }
  if(window.innerWidth < 720){
    transformMax = (sliderLengthMax-1) * slidePercentage;
  }if(window.innerWidth >= 1100){
    transformMax = (sliderLengthMax-4) * slidePercentage;
  }else if(window.innerWidth >= 720){
    transformMax = (sliderLengthMax-2) * slidePercentage;
  }
  if(transform === transformMax){
      latestNext.setAttribute('disabled', 'disabled');
      latestNextArrow.style.display = "none";
  }
    if(transform  < transformMax){
      latestNext.disabled = false;
      latestNextArrow.style.display = "block";
    }
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
  calculateTransform(-1);
  transformSlider();
  disableButtons();
}

function nextPage(){
  calculateTransform(1);
  transformSlider();
  disableButtons();
}