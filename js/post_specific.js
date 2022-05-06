import {baseUrl, routes, callAPI,parameters, addLoader, blogPostUrl, sponsorUrl, categoriesUrl, postComment} from "./components/api_utilities.js"
import { menuBtn, searchBtn, searchForm, sponsorsContainer, fullname, errorName, email, errorEmail, message, errorMessage, formReporting} from "./constants/constants.js"
import {createPost, createSponsoredContent, productSearch, resetBorders, validateEmailInput, validatedInputLength, openCloseMenu, openCloseSearch} from "./components/components.js"

/*-------------- Query string grabs --------------*/
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
console.log(id)
const url = baseUrl + routes.blogPosts + "/" + id + "?" + parameters.acf;

/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);
//search
searchBtn.addEventListener("click", openCloseSearch);
searchForm.addEventListener("submit", productSearch);

/*-------------- Api Call and Page Creation --------------*/
async function createPageContent(){
  try{
    let postData = await callAPI(url);
    console.log(postData);
    await createPageHTML(postData);
    addImageModals()
    //fill sponsor content
    const sponsorData = await callAPI(sponsorUrl);
    createSponsoredContent(sponsorData, sponsorsContainer);
    
  } catch(error){
    console.log(error);
  }
}

createPageContent();

/* sorting data onto page */
const titleContainer = document.querySelector("h1");
const featuredImageContainer = document.querySelector(".featured-image-container");
const mainContentContainer = document.querySelector(".post-content-container");
const postDateContainer = document.querySelector(".post-date");
const commentsContainer = document.querySelector(".comments-container");
const postCommentForm = document.querySelector("#comments-form");

async function createPageHTML(data){
  const featuredImgSrc = data.featured_image.size_full;
  //using file name for alt probably a better way to do it
  let featuredImgAlt = featuredImgSrc.substring(featuredImgSrc.lastIndexOf('/') + 1);
  featuredImgAlt = featuredImgAlt.split('.').slice(0, -1).join('.').replace(/_/g, ' ');

  console.log(featuredImgAlt)

  titleContainer.innerHTML = data.title.rendered
  featuredImageContainer.innerHTML = `<img src="${featuredImgSrc}" alt="${featuredImgAlt}" class="featured-image">`;
  postDateContainer.innerHTML = `<span>${data.acf.published}</span>
                                 <span class="author-text">Author: ${data.acf.author}</span>
                                 <div class="author-image">
                                  <img src="images/leo_bow_tie_square.jpg" alt="Leo">
                                </div>`
  mainContentContainer.innerHTML = data.content.rendered;
  
  
}

/*---------- image modal ----------*/
const imageModalBackground = document.querySelector(".modal-background-container");
const imageModal = document.querySelector(".image-modal");


function addImageModals(){
  const imagesModals = document.querySelectorAll(".modal-image");
  
  console.log(imagesModals);
  imagesModals.forEach(function(image) {
    //assign event listener to all checkboxes
    image.addEventListener('click', function() {
      imageModal.src = this.src;
      imageModal.alt = this.alt;
      imageModal.classList.add("expanded-image-modal");
      imageModalBackground.style.display = "block";
    })  
  });
}

imageModalBackground.addEventListener("click", function(){
  imageModal.src = "";
  imageModal.alt = "";
  imageModal.classList.remove("expanded-image-modal");
  imageModalBackground.style.display = "none";
})

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

  commentsForm.reset();
  resetBorders(fullname);
  resetBorders(message);
  resetBorders(email);
  }
}

