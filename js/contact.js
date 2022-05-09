import {baseUrl, routes, callAPI, parameters, sponsorUrl, createErrorMessage} from "./components/api_utilities.js"
import {menuBtn, searchBtn, searchForm, sponsorsContainer, fullname, errorName, email, errorEmail, subject, errorSubject, message, errorMessage, formReporting} from "./constants/constants.js"
import {createSponsoredContent, productSearch, resetBorders, validateEmailInput, validatedInputLength, openCloseMenu, openCloseSearch} from "./components/components.js"

/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);

//search
searchBtn.addEventListener("click", openCloseSearch);
searchForm.addEventListener("submit", productSearch);

/*-------------- get sponsors data --------------*/

async function createSponsors(){
  try{
  //fill sponsor content
  const sponsorData = await callAPI(sponsorUrl);
  createSponsoredContent(sponsorData, sponsorsContainer);
  } catch(error){
    console.log(error);
    createErrorMessage(sponsorsContainer);
  }
}
createSponsors()

/*-------------- Api Call and Page Creation --------------*/
const additionalDetailsContainer = document.querySelector(".extra-contact-info")

//contact forms id for posting info to.
const id = 106;
const url = baseUrl + routes.page + "/" + id;

async function createPageContent(){
  try{
    let contactDetails = await callAPI(url);
    console.log(contactDetails);
    additionalDetailsContainer.innerHTML = contactDetails.content.rendered
  } catch(error){
    console.log(error);
    createErrorMessage(additionalDetailsContainer);
  }
}

createPageContent();

/*-------------- Contact Form Posting --------------*/

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
  let formData = new FormData();
  formData.append("your-name", fullname.value);
  formData.append("your-subject", subject.value);
  formData.append("your-message", message.value);
  formData.append("your-email", email.value);

  postQuery(formData, formReporting);

  commentsForm.reset();
  resetBorders(fullname);
  resetBorders(message);
  resetBorders(email);
  resetBorders(subject);
  }
}

function postQuery(data, formReportingContainer){
  
    fetch("https://fluffypiranha.one/exam_project_1/wp-json/contact-form-7/v1/contact-forms/113/feedback", 
          {method: "POST",
          body: data, 
          redirect: 'follow'
           }).then((response) => {
            console.log(response)
          }).catch(error => 
            console.log('error', error),
            createErrorMessage(formReporting));

    formReportingContainer.innerHTML = `<p class="success">Success your message has been posted</p>`
}

/* old way using comments on the contact page but technically anyone can read your queries.
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
  const data = JSON.stringify({post:Number(id), author_name: fullname.value, author_email:email.value, content:`<b>${subject.value}:</b>\n ${message.value}`});
  
  postComment(data, formReporting);

  commentsForm.reset();
  resetBorders(fullname);
  resetBorders(message);
  resetBorders(email);
  resetBorders(subject);
  }
}*/
