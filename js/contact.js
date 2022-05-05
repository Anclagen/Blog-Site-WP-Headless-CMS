import {baseUrl, routes, callAPI, callApiGetPages, parameters, addLoader, blogPostUrl, sponsorUrl, categoriesUrl} from "./components/api_utilities.js"
import {menuLinks, menuBtn, searchBtn, searchContainer, searchForm, hamBotLine, hamMidLine, hamTopLine, sponsorsContainer} from "./constants/constants.js"
import {createPost, createSponsoredContent, productSearch} from "./components/components.js"

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









//comments 
const commentsForm = document.querySelector("#contact-form");
console.log(commentsForm)
commentsForm.addEventListener("submit", submitComment);
const key = "Eukx 4nvk mFvr Leod G1ld afv1";
const testUrl = "https://fluffypiranha.one/exam_project_1/wp-json/wp/v2/comments/?author_name=Bob&author_email=bobs@bobsworld.com&author_name=bobe&content=jstest222&post=78";

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
  const [name, email, subject, comment] = submission.target.elements;
  const data = JSON.stringify({post: 106, author_name: name.value, author_email:email.value, content:`<b>${subject.value}:</b  style="font-size:2rem" >\n ${comment.value}`})
  postComment(data);
}
