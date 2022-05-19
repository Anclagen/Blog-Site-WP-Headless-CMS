import {baseUrl, routes, callAPI} from "./components/api_utilities.js"
import { fullname, errorName, email, errorEmail, subject, errorSubject, message, errorMessage, formReporting} from "./constants/constants.js"
import {resetBorders, validateEmailInput, validatedInputLength, createErrorMessage} from "./components/components.js"

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

const contactForm = document.querySelector("#contact-form");
contactForm.addEventListener("submit", validateSubmitComment);

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
  let formData = new FormData(contactForm);

  postQuery(formData, formReporting);

  contactForm.reset();
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
           }).then((response) => {
            console.log(response)
          }).catch(error => 
            console.log('error', error),
            createErrorMessage(formReporting));

    formReportingContainer.innerHTML = `<p class="success">Success your message has been posted</p>`
}