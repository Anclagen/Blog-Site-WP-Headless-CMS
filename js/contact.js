import {baseUrl, routes, callAPI, parameters, sponsorUrl, postComment} from "./components/api_utilities.js"
import {menuLinks, menuBtn, searchBtn, searchContainer, searchForm, hamBotLine, hamMidLine, hamTopLine, sponsorsContainer, fullname, errorName, email, errorEmail, subject, errorSubject, message, errorMessage, formReporting} from "./constants/constants.js"
import {createSponsoredContent, productSearch, resetBorders, validateEmailInput, validatedInputLength} from "./components/components.js"

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

//contact forms id for posting info to.
const id = 106;
const url = baseUrl + routes.page + "/" + id;

/*-------------- Api Call and Page Creation --------------*/
const additionalDetailsContainer = document.querySelector(".extra-contact-info")

async function createPageContent(){
  try{
    let contactDetails = await callAPI(url);
    console.log(contactDetails);
    additionalDetailsContainer.innerHTML = contactDetails.content.rendered

    //fill sponsor content
    const sponsorData = await callAPI(sponsorUrl);
    createSponsoredContent(sponsorData, sponsorsContainer);
  } catch(error){
    console.log(error);
  }
}

createPageContent();

/*-------------- Contact Form Posting --------------*/

// const commentsForm = document.querySelector("#contact-form");
// commentsForm.addEventListener("submit", validateSubmitComment);

// //validates inputs and when passed, posts form to server.
// function validateSubmitComment(submission) {
//   submission.preventDefault();

//   //clear success/error container .
//   formReporting.innerHTML = "";

//   //variables assigned true if they pass, and errors generated on fail.
//   const a = validatedInputLength(fullname, 5, errorName);
//   const b = validatedInputLength(message, 25, errorMessage);
//   const c = validateEmailInput(email, errorEmail);
//   const d = validatedInputLength(subject, 15, errorSubject);

  
//   if(a && b && c && d) {
//   //create data for post with id corresponding to page or post
//   const data = JSON.stringify({post:Number(id), author_name: fullname.value, author_email:email.value, content:`<b>${subject.value}:</b>\n ${message.value}`});
  
//   postComment(data, formReporting);

//   commentsForm.reset();
//   resetBorders(fullname);
//   resetBorders(message);
//   resetBorders(email);
//   resetBorders(subject);
//   }
// }


const commentsForm = document.querySelector("#contact-form");
commentsForm.addEventListener("submit", validateSubmitComment);

//validates inputs and when passed, posts form to server.
function validateSubmitComment(submission) {
  submission.preventDefault();

  //clear success/error container .
  formReporting.innerHTML = "";

  //variables assigned true if they pass, and errors generated on fail.
  const a = validatedInputLength(fullname, 5, errorName);
  const b = validatedInputLength(message, 25, errorMessage);
  const c = validateEmailInput(email, errorEmail);
  const d = validatedInputLength(subject, 15, errorSubject);

  
  if(a && b && c && d) {
  //create data for post with id corresponding to page or post
  const data = {your_name: fullname.value, your_email:email.value, subject: subject.value, message:message.value};
  console.log(data)
  postQuery(data, formReporting);

  commentsForm.reset();
  resetBorders(fullname);
  resetBorders(message);
  resetBorders(email);
  resetBorders(subject);
  }
}

function postQuery(data, formReportingContainer){
  
    fetch("https://fluffypiranha.one/exam_project_1/wp-json/contact-form-7/v1/contact-forms/114/feedback", 
          {method: "POST",
          'Content-Type':'multipart/form-data',
          your_name: data.your_name, 
          your_email: data.your_email, 
          subject: data.subject, 
          message:data.message}).then((data) => {
            console.log(data.message)
          })
    formReportingContainer.innerHTML = `<p class="success">Success your message has been posted</p>`

}

