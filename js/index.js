// ------- imports --------
import {createPost, productSearch, openCloseMenu, openCloseSearch} from "./components/components.js"
import {baseUrl, routes, callAPI, parameters, blogPostUrl, sponsorUrl, addLoader, sortOldestUrl, createErrorMessage, createSponsors} from "./components/api_utilities.js"
import {menuBtn, searchBtn, searchForm, sponsorsContainer} from "./constants/constants.js"

//const corsUrl = "https://noroffcors.herokuapp.com/";
const latestContainer = document.querySelector(".latest-post-slider");


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
let latestPageMax = 1;
let slidePercentage = 0;

async function createPageContent(){
  const sortNewPostData = await callAPI(blogPostUrl);
  
  //set page max for latest
  latestPageMax = Math.ceil(sortNewPostData.length/4);
  createPostImageSlider(sortNewPostData, latestContainer);
  }

createPageContent()


/*-------------- Latest content slider -----------------*/

//create responsive image slider my head now hurts a little!
function createPostImageSlider(data, container){
  container.innerHTML= "";

  //adjusting width variables for container style updates
  let sliderWidth = `${100 * Math.ceil(data.length/4)}%`;
  let slideWidth = `${100/Math.ceil(data.length/4)}%`;
  container.style.width = sliderWidth;
  //variable for translate percentage on buttons.
  slidePercentage = 100/Math.ceil(data.length/4);

  let slide = document.createElement("div");
  slide.classList = "latest-slider-content";
  slide.style.width = slideWidth;

  for(let i = 0; i < data.length; i++){
    //every 4 posts creates new slide
    if(i!== 0 && i%4 === 0){
      container.appendChild(slide);
      slide = document.createElement("div");
      slide.classList = "latest-slider-content";
      slide.style.width = slideWidth;
    }
    //create post and adds to slide
    let post = createPost(data[i]);
    slide.innerHTML+=post;
    }
  //appends last slide
  container.appendChild(slide);
}

//grabs for variables
const latestNext = document.querySelector(".latest-next");
const latestPrevious = document.querySelector(".latest-previous");
const latestPosts = document.getElementById('latest-posts');

//event listeners for next and previous buttons
latestPrevious.addEventListener("click", previousPage);
latestNext.addEventListener("click", nextPage);

//change page functions for latest posts
function previousPage(){
  latestPageCurrent -= 1;
  let transform = (latestPageCurrent - 1) * slidePercentage;
  latestContainer.style.transform = `translateX(-${transform}%)`
  latestNext.disabled = false;
  //disables button on first page
  if(latestPageCurrent === 1){
    latestPrevious.setAttribute('disabled', 'disabled');
  }
  //added to move screen to top of slider on mobile
  latestPosts.scrollIntoView()
}

function nextPage(){
  latestPageCurrent += 1;
  let transform = (latestPageCurrent - 1) * slidePercentage;
  latestContainer.style.transform = `translateX(-${transform}%)`
  latestPrevious.disabled = false;
  //disables button on last page
  if(latestPageCurrent === latestPageMax){
    latestNext.setAttribute('disabled', 'disabled');
  }
  //added to move screen to top of slider on mobile
  latestPosts.scrollIntoView()
}

