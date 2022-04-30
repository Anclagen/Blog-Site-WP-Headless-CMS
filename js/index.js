// ------- imports --------
import {baseUrl, routes, callAPI, parameters, addLoader} from "./components/api_utilities.js"

//const corsUrl = "https://noroffcors.herokuapp.com/";
const main = document.querySelector(".main-content");
const latestContainer = document.querySelector(".latest-post-slider");
const featuredContainer = document.querySelector(".featured-slider-content");
const recentContainer = document.querySelector(".recent-slider-content");
const popularContainer = document.querySelector(".popular-post-container");

// callAPI (url) and return data

const sponsorUrl = baseUrl + routes.sponsors + "?" + parameters.acf;
const blogPostUrl = baseUrl + routes.blogPosts + "?" + parameters.acf

//page number for latest posts
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

  //const sponsorData = await callAPI(sponsorUrl);
}

createPageContent()

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
                  <div class="post-image-title">
                    <a href="post_specific.html?id=${data[i].id}"><img src="${data[i].featured_image.size_thumbnail}" alt="${data[i].acf.post_summary}" class="post-thumbnail"></a>
                    <div>
                      <a href="post_specific.html?id=${data[i].id}" class="post-heading"><h3>${data[i].title.rendered}</h3></a>
                      <a href="post_specific.html?id=${data[i].id}" class="post-button">View More</a>
                    </div>
                  </div>
                  <div class="post-details">
                    <span>Author: ${data[i].acf.author}</span>
                    <span>Tags: ${tags}</span>
                    <span>Published: ${data[i].date}</span>
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

console.log(slidePercentage)

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

