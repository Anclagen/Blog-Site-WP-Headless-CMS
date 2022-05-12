import {baseUrl, routes, callAPI, parameters, addLoader, blogPostUrl, sponsorUrl, postComment, createErrorMessage, createSponsors} from "./components/api_utilities.js"
import { menuBtn, searchBtn, searchForm, sponsorsContainer, fullname, errorName, message, errorMessage, formReporting} from "./constants/constants.js"
import {productSearch, resetBorders, validatedInputLength, openCloseMenu, openCloseSearch, addImageModals, createComments} from "./components/components.js"

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
    createHeadInformation(postData);
    console.log(postData)
    addImageModals()
  } catch(error){
    console.log(error);
    createErrorMessage(mainContentContainer)
  }
}

createPageContent();

/*-------------- Page Information --------------*/
const title = document.querySelector("title");

function createHeadInformation(data){
  console.log(data.title.rendered)
  title.innerText = `The Fluffy Piranha | ${data.title.rendered} `;
}

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
    if(commentData.length === 0){
      commentsContainer.innerHTML=`<p>No comments yet be the first!</p>`;
    } else{
      createComments(commentData, commentsContainer);
    }
    
  } catch(error){
    console.log(error);
    createErrorMessage(commentsContainer)
  }
}

getComments()


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

