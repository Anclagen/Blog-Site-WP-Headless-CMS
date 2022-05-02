// ------- imports --------
import {baseUrl, routes, callAPI, parameters, addLoader} from "./components/api_utilities.js"
import {menuLinks, menuBtn, searchBtn, searchContainer, hamBotLine, hamMidLine, hamTopLine} from "./constants/constants.js"
import {} from "./components/components.js"
//const corsUrl = "https://noroffcors.herokuapp.com/";
const latestContainer = document.querySelector(".latest-post-slider");
const sponsorsContainer = document.querySelector(".sponsors-post-container");

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

// callAPI (url) and return data
const sponsorUrl = baseUrl + routes.sponsors + "?" + parameters.acf;
const blogPostUrl = baseUrl + routes.blogPosts + "?" + parameters.acf

// variables for next and previous button functions of latest images slider.
let latestPageCurrent = 1;
let latestPageMax = 1;
let slidePercentage = 0;

async function createPageContent(){
  const sortNewPostData = await callAPI(blogPostUrl);
  //set page max for latest
  latestPageMax = Math.ceil(sortNewPostData.length/4);

  const doubletime = sortNewPostData.concat(sortNewPostData.reverse());
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
  let sliderWidth = `${100 * Math.ceil(data.length/4)}%`;
  slidePercentage = 100/Math.ceil(data.length/4);
  console.log(slidePercentage)
  let slideWidth = `${100/Math.ceil(data.length/4)}%`;
  console.log(slideWidth)
  container.style.width = sliderWidth;
  
  let slide = document.createElement("div");
  slide.classList = "latest-slider-content";
  slide.style.width = slideWidth;

  for(let i = 0; i < data.length; i++){
    if(i!== 0 && i%4 === 0){
      container.appendChild(slide);
      slide = document.createElement("div");
      slide.classList = "latest-slider-content";
      slide.style.width = slideWidth;
    }

    let tags ="";
     data[i].post_category.forEach(element => {
       tags += element.name + ", ";
     });

    let post = `
                <div class="post-container">
                  <div class="post-image-container">
                    <a href="post_specific.html?id=${data[i].id}"><img src="${data[i].featured_image.size_large}" alt="${data[i].acf.post_summary}" class="post-image"></a>
                    <div class="author-image">
                      <img src="images/leo_bow_tie_square.jpg" alt="Leo">
                    </div>
                    <div class="post-date">
                      <span>${data[i].date}</span><span class="author-text">Author: ${data[i].acf.author}</span>
                    </div>
                  </div>
                  <div class="post-heading">
                    <a href="post_specific.html?id=${data[i].id}" ><h3>${data[i].title.rendered}</h3></a>
                    <p>${data[i].acf.post_summary}</p>
                  </div>
                  <div class="post-details">
                    <span>Tags: ${tags}</span>
                  </div>
                </div>
                `;
    slide.innerHTML+=post;
    }

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

/*-------------- sponsor content creator slider -----------------*/

function createSponsoredContent(sponsorData, sponsorsContainer){
  sponsorsContainer.innerHTML="";
  let sponsorPost = "<p>No Sponsors, No Money!</p>";
  for(let i = 0; i < sponsorData.length; i++){
    sponsorPost = `<div>
                    <a href="${sponsorData[i].acf.sponsor_url}">
                      <img src="${sponsorData[i].acf.logo}" alt="${sponsorData[i].acf.name}'s logo" class="sponsor-logo-image">
                    <a>
                  </div>
                  <div class="leo-sponsor-comment">
                    <p>${sponsorData[i].acf.our_quote}</p>
                    <img src="${sponsorData[i].acf.our_image}" alt="Leo giving his speech"/>
                  </div>`
    sponsorsContainer.innerHTML += sponsorPost
  }
}