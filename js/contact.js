import {baseUrl, routes, callAPI} from "./components/api_utilities.js";
import { fullname, errorName, email, errorEmail, subject, errorSubject, message, errorMessage, formReporting} from "./constants/constants.js";
import {resetBorders, validateEmailInput, validatedInputLength, createErrorMessage, validateLength, validateEmail} from "./components/components.js";

/*-------------- Api Call and Page Creation --------------*/
const additionalDetailsContainer = document.querySelector(".extra-contact-info");

//contact forms id for posting info to.
const id = 106;
const url = baseUrl + routes.page + "/" + id;

async function createPageContent(){
  try{
    let contactDetails = await callAPI(url);
    additionalDetailsContainer.innerHTML = contactDetails.content.rendered;
  } catch(error){
    console.log(error);
    createErrorMessage(additionalDetailsContainer);
  }
}

createPageContent();

/*-------------- Contact Form Posting --------------*/

const contactForm = document.querySelector("#contact-form");
const contactFormSubmit = document.querySelector("#contact-form-submit");
contactForm.addEventListener("submit", submitForm);

//validates inputs and when passed, posts form to server.
function submitForm(submission) {
  submission.preventDefault();
  //probably not needed but just in case some manages to clear an input and submit or something
  if(validateLength(fullname, 5) && validateLength(message, 25) && validateEmail(email) && validateLength(subject, 15)){
    //clear success/error container .
    formReporting.innerHTML = "";
    //create data for post with id corresponding to page or post
    let formData = new FormData();
    formData.append("your-name", fullname.value);
    formData.append("your-subject", subject.value);
    formData.append("your-message", message.value);
    formData.append("your-email", email.value);
    //post form
    postQuery(formData, formReporting);

    //reset contact form
    contactForm.reset();
    resetBorders(fullname);
    resetBorders(message);
    resetBorders(email);
    resetBorders(subject);
    contactFormSubmit.setAttribute('disabled', 'disabled');
  }
}

/*validates inputs as they are filled in, displaying green when valid, 
orange if not valid, and red with error if invalid when focus lost. 
When all inputs are valid submit button is enabled */ 
function validateInputs(event){
  //probably could of used a switch
  if(event.target.name === "name"){
    if(!validatedInputLength(fullname, 5, errorName)){
      fullname.style.border ="4px solid orange";
      errorName.innerText = "";
      event.target.addEventListener("focusout", function(){validatedInputLength(fullname, 5, errorName);});
    }
  } else if(event.target.name === "email"){
    if(!validateEmailInput(email, errorEmail)){
      email.style.border ="4px solid orange";
      errorEmail.innerText = "";
      event.target.addEventListener("focusout", function(){validateEmailInput(email, errorEmail);});
    }
  } else if(event.target.name === "subject"){
    if(!validatedInputLength(subject, 15, errorSubject)){
      subject.style.border ="4px solid orange";
      errorSubject.innerText = "";
      event.target.addEventListener("focusout", function(){validatedInputLength(subject, 15, errorSubject);});
    }
  }else if(event.target.name === "message"){
    if(!validatedInputLength(message, 25, errorMessage)){
      message.style.border ="4px solid orange";
      errorMessage.innerText = "";
      event.target.addEventListener("focusout", function(){validatedInputLength(message, 25, errorMessage);});
    }
  } 

  //check if all inputs are valid to enable button
  if(validateLength(fullname, 5) && validateLength(message, 25) && validateEmail(email) && validateLength(subject, 15)){
    contactFormSubmit.disabled = false;

  } else{
    contactFormSubmit.setAttribute('disabled', 'disabled');
  }
}

contactForm.addEventListener("input", validateInputs);

function postQuery(data, formReportingContainer){
  fetch("https://fluffypiranha.one/exam_project_1/wp-json/contact-form-7/v1/contact-forms/113/feedback", 
        {method: "POST",
        body: data, 
          }).then((response) => {
            if(response.status === 200){
              formReportingContainer.innerHTML = `<p class="success">Success your message has been posted</p>`;
              console.log(response);
            }
        }).catch(error => 
          console.log('error', error),
          createErrorMessage(formReporting));
  formReportingContainer.innerHTML = `<p class="success">Success your message has been posted</p>`;
}

//old form validation
// const contactForm = document.querySelector("#contact-form");
// contactForm.addEventListener("submit", validateSubmitComment);

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
//   let formData = new FormData();
//   formData.append("your-name", fullname.value);
//   formData.append("your-subject", subject.value);
//   formData.append("your-message", message.value);
//   formData.append("your-email", email.value);

//   postQuery(formData, formReporting);
//   contactForm.reset();
//   resetBorders(fullname);
//   resetBorders(message);
//   resetBorders(email);
//   resetBorders(subject);
//   }
// }