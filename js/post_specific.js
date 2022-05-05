import {baseUrl, routes, callAPI, callApiGetPages, parameters, addLoader, blogPostUrl, sponsorUrl, categoriesUrl} from "./components/api_utilities.js"
import {menuLinks, menuBtn, searchBtn, searchContainer, searchForm, hamBotLine, hamMidLine, hamTopLine, sponsorsContainer} from "./constants/constants.js"
import {createPost, createSponsoredContent, productSearch} from "./components/components.js"

/*-------------- Query string grabs --------------*/
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("id");
console.log(id)
const url = baseUrl + routes.blogPosts + "/" + id + "?" + parameters.acf;

/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);
function openCloseMenu(){
  menuLinks.classList.toggle("hide-menu");
  hamTopLine.classList.toggle("menu-open-rotate1");
  hamBotLine.classList.toggle("menu-open-rotate3");
  hamMidLine.classList.toggle("menu-open-transparent");
}

//search
searchBtn.addEventListener("click", openCloseSearch);
function openCloseSearch(){
  searchContainer.classList.toggle("hidden-search"); 
}
searchForm.addEventListener("submit", productSearch);

/*-------------- Api Call and Page Creation --------------*/
async function createPageContent(){
  try{
    let postData = await callAPI(url);
    console.log(postData);
    createPageHTML(postData);

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

function createPageHTML(data){
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

//comments 

const commentsForm = document.querySelector("#comment-form");
commentsForm.addEventListener("submit", submitComment);

//using a subscriber user, only permissions to comment so not too must of a security risk
function postComment(data){
  try{
    fetch("https://fluffypiranha.one/exam_project_1/wp-json/wp/v2/comments", 
          {method: "POST",
          headers:{"Content-Type": "application/json",
                     "Authorization": "Basic " + btoa("Anonymous" + ":" + "Eukx 4nvk mFvr Leod G1ld afv1")},
                     body: data})
  } catch(error){
    console.log(error)
  }
}

function submitComment(submission) {
  submission.preventDefault();
  const [name, email, comment] = submission.target.elements;
  const data = JSON.stringify({post: Number(id), author_name: name.value, author_email:email.value, content:comment.value})
  postComment(data);
}