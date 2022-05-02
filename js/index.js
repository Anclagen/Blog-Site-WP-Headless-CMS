// ------- imports --------
import {baseUrl, routes, callAPI, parameters, blogPostUrl, sponsorUrl, addLoader} from "./components/api_utilities.js"
import {menuLinks, menuBtn, searchBtn, searchContainer, searchForm, hamBotLine, hamMidLine, hamTopLine, sponsorsContainer} from "./constants/constants.js"
import {createPost, createSponsoredContent, productSearch} from "./components/components.js"
//const corsUrl = "https://noroffcors.herokuapp.com/";
const latestContainer = document.querySelector(".latest-post-slider");


/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);
function openCloseMenu(){
  menuLinks.classList.toggle("hide-menu");
  hamTopLine.classList.toggle("menu-open-rotate1");
  hamBotLine.classList.toggle("menu-open-rotate3");
  hamMidLine.classList.toggle("menu-open-transparent");
}

searchBtn.addEventListener("click", openCloseSearch);
function openCloseSearch(){
  searchContainer.classList.toggle("hidden-search"); 
}

searchForm.addEventListener("submit", productSearch);


// variables for next and previous button functions of latest images slider.
let latestPageCurrent = 1;
let latestPageMax = 1;
let slidePercentage = 0;

async function createPageContent(){
  const sortNewPostData = await callAPI(blogPostUrl);
  //set page max for latest
  latestPageMax = Math.ceil(sortNewPostData.length/4);

  let doubletime = sortNewPostData.concat(sortNewPostData.reverse());
  doubletime = doubletime.concat(doubletime);

  latestPageMax = Math.ceil(doubletime.length/4);

  createPostImageSlider(doubletime, latestContainer);

  const sponsorData = await callAPI(sponsorUrl);
  console.log(sponsorData);
  createSponsoredContent(sponsorData, sponsorsContainer);
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
    let post = createPost(data[i]);
    slide.innerHTML+=post;
    }
    //appends last slide
    container.appendChild(slide);
}



//change page function for latest posts
const latestNext = document.querySelector(".latest-next");
const latestPrevious = document.querySelector(".latest-previous");

latestPrevious.addEventListener("click", previousPage);
latestNext.addEventListener("click", nextPage);

function previousPage(){
  latestPageCurrent -= 1;
  let transform = (latestPageCurrent - 1) * slidePercentage;
  if(latestPageCurrent === 1){
    transform = 0;
  }
  latestContainer.style.transform = `translateX(-${transform}%)`
  latestNext.disabled = false;
  if(latestPageCurrent === 1){
    console.log(latestPageCurrent)
    latestPrevious.setAttribute('disabled', 'disabled');
  }
}

function nextPage(){
  latestPageCurrent += 1;
  latestContainer.style.transform = `translateX(-${(latestPageCurrent - 1) * slidePercentage}%)`
  latestPrevious.disabled = false;
  if(latestPageCurrent === latestPageMax){
    latestNext.setAttribute('disabled', 'disabled');
  }
}

