import {baseUrl, routes, callAPI, parameters, addLoader, blogPostUrl, sponsorUrl, postComment, createErrorMessage, createSponsors} from "./components/api_utilities.js"
import { menuBtn, searchBtn, searchForm, sponsorsContainer, fullname, errorName, message, errorMessage, formReporting} from "./constants/constants.js"
import {productSearch, resetBorders, validatedInputLength, openCloseMenu, openCloseSearch, addImageModals} from "./components/components.js"

/*-------------- Query string grabs --------------*/
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
console.log(id)
const url = baseUrl + routes.blogPosts + "/" + id + "?" + parameters.acf;
// const url = baseUrl + routes.blogPosts + "/" + id + "?" + parameters.acf + "&_embed=1";

/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);
//search
searchBtn.addEventListener("click", openCloseSearch);
searchForm.addEventListener("submit", productSearch);

/*-------------- get sponsors data --------------*/

createSponsors(sponsorUrl, sponsorsContainer)

/*-------------- Api Call and Page Creation --------------*/

async function createPageContent(){
  try{
    let postData = await callAPI(url);
    await createPageHTML(postData);
    console.log(postData._embedded)
    addImageModals()
  } catch(error){
    console.log(error);
    createErrorMessage(mainContentContainer)
  }
}

createPageContent();

/*-------------- Page Creation --------------*/
/* sorting data onto page */
const titleContainer = document.querySelector("h1");
const featuredImageContainer = document.querySelector(".featured-image-container");
const mainContentContainer = document.querySelector(".post-content-container");
const postDateContainer = document.querySelector(".post-date");


async function createPageHTML(data){
  const featuredImgSrc = data.featured_image.size_full;
  //using file name for alt probably a better way to do it
  let featuredImgAlt = featuredImgSrc.substring(featuredImgSrc.lastIndexOf('/') + 1);
  featuredImgAlt = featuredImgAlt.split('.').slice(0, -1).join('.').replace(/_/g, ' ');

  titleContainer.innerHTML = data.title.rendered
  featuredImageContainer.innerHTML = `<img src="${featuredImgSrc}" alt="${featuredImgAlt}" class="featured-image">`;
  postDateContainer.innerHTML = `<span>${data.acf.published}</span>
                                 <span class="author-text">Author: ${data.acf.author}</span>
                                 <div class="author-image">
                                  <img src="${data.acf.author_image}" alt="${data.acf.author}">
                                </div>`
  mainContentContainer.innerHTML = data.content.rendered;
}

/*-------------- Get Comments  --------------*/
const commentsContainer = document.querySelector(".comments-container");
const commentUrl = baseUrl + "/comments?post=" + id
async function getComments(){
  try{
    let commentData = await callAPI(commentUrl);
    createComments(commentData);
  } catch(error){
    console.log(error);
    createErrorMessage(commentsContainer)
  }
}
getComments()

function createComments(data){
  commentsContainer.innerHTML ="";
  let countLeft = 1;
  let countRight = 1;
  for(let i = 0; i < data.length; i++){
    if((i+1)%2 !== 0){
      if(countRight%2 !== 0){
        commentsContainer.innerHTML +=`<div class="comment-right">
                                        <img src="/images/head_of_leo.png" alt="image of dog head" class="comment-img" />
                                        <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                        </div>`;
        countRight++;
      } else{ 
        commentsContainer.innerHTML += `<div class="comment-right">
                                      <img src="/images/head_of_dog_2.png" alt="image of dog head" class="comment-img">
                                      <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                      </div>`;
        countRight++;
      }
    } else{
      if(countLeft%2 !== 0){
        commentsContainer.innerHTML +=`<div class="comment-left">
                                        <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                        <img src="/images/head_of_beagle.png" alt="image of dog head" class="comment-img" />
                                        </div>`;
        countLeft++;
      } else{ 
        commentsContainer.innerHTML += `<div class="comment-left">
                                        <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                        <img src="/images/head_of_dog.png" alt="image of dog head" class="comment-img" />
                                        </div>`;
        countLeft++;
      }
    }
  }
}

/*-------------- Comment Posting --------------*/
const commentsForm = document.querySelector("#comment-form");
commentsForm.addEventListener("submit", validateSubmitComment);

//validates inputs and when passed, posts form to server.
function validateSubmitComment(submission) {
  submission.preventDefault();

  //clear success/error container.
  formReporting.innerHTML = "";

  //variables assigned true if they pass, and errors generated on fail.
  const a = validatedInputLength(fullname, 5, errorName);
  const b = validatedInputLength(message, 0, errorMessage);
  // const c = validateEmailInput(email, errorEmail);

  if(a && b) {
  //create data for post with id corresponding to page or post
  const data = JSON.stringify({post: Number(id), author_name: fullname.value, author_email:"anonymous@anonymous.com", content:message.value});
  
  postComment(data, formReporting);

  //give api time to update
  setTimeout(() => {getComments()}, 1000);
  commentsForm.reset();
  resetBorders(fullname);
  resetBorders(message);
  }
}

