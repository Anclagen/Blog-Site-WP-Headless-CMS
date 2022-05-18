// ------- imports --------
import {createPost, productSearch, openCloseMenu, openCloseSearch} from "./components/components.js"
import {baseUrl, routes, callAPI, parameters, blogPostUrl, sponsorUrl, addLoader, sortOldestUrl, createErrorMessage, createSponsors} from "./components/api_utilities.js"
import {errorMessage, menuBtn, searchBtn, searchForm, sponsorsContainer} from "./constants/constants.js"


/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);
//search
searchBtn.addEventListener("click", openCloseSearch);
searchForm.addEventListener("submit", productSearch);

/*-------------- get sponsors data --------------*/
createSponsors(sponsorUrl, sponsorsContainer)

const diaryMediaUrl = baseUrl + "/media?_embed&categories=11&per_page=100";
const walkiesMediaUrl = baseUrl + "/media?_embed&categories=20&per_page=100";

/*-------------- Create Page Content -----------------*/
const diaryContainer = document.querySelector(".diary-gallery-slide");
// const walkiesContainer = document.querySelector(".walkies-gallery-slide");
let diaryTransform = 0;
let diaryCurrentPage = 0;
let diaryMaxPages = 0;
// let walkiesTransform = 0;
// let walkiesCurrentPage = 0;
// let walkiesMaxPages = 0;

async function CreatePageContent(){
  try{
    const diaryData = await callAPI(diaryMediaUrl);
    const walkiesData = await callAPI(walkiesMediaUrl);
    console.log(diaryData);

    adjustWidths(diaryData.length);
    diaryTransform = 100/diaryData.length
    diaryMaxPages = diaryData.length
    addGalleryImages(diaryData, diaryContainer);
    
    // adjustWidths(diaryData.length, walkiesMaxPages);
    // walkiesTransform = 100/walkiesData.length
    // addGalleryImages(walkiesData, walkiesContainer);

  }catch(error){
    console.log(error);
    errorMessage(diaryContainer);
  }
}

CreatePageContent();


/*------- Image Modal Slider --------*/

function addGalleryImages(data, container){
  for(let i = 0; i < data.length; i++){
    container.innerHTML += `<img src="${data[i].media_details.sizes.full.source_url}" alt="${data[i].alt_text}" />`
  }
}

function adjustWidths(length){
  diaryContainer.style.width = `${(100 * length)}%`;
}

const diaryNextBtn = document.querySelector(".diary-next-arrow");
const diaryPreviousBtn = document.querySelector(".diary-previous-arrow");

diaryNextBtn.addEventListener("click", nextSlide);
diaryPreviousBtn.addEventListener("click", previousSlide);

function nextSlide(){
  if(diaryCurrentPage + 1 === diaryMaxPages){
    diaryCurrentPage = 0;
  } else{
    diaryCurrentPage = diaryCurrentPage + 1;
  }
  let transform = (diaryCurrentPage * diaryTransform);
  diaryContainer.style.transform = `translateX(-${transform}%)`;
}

function previousSlide(){
  if(diaryCurrentPage === 0){
    diaryCurrentPage = diaryMaxPages - 1;
  } else{
    diaryCurrentPage = diaryCurrentPage - 1;
  }
  let transform = (diaryCurrentPage * diaryTransform);
  diaryContainer.style.transform = `translateX(-${transform}%)`;
}

const imageModalBackground = document.querySelector(".diary-modal-background");
const imageModalContainer = document.querySelector(".diary-modal-container");

diaryContainer.addEventListener("click", expandModal);

function expandModal(){
  imageModalBackground.classList.add("expanded-background");
  imageModalContainer.classList.add("expanded-slider");
}

imageModalBackground.addEventListener("click", closeModal);

function closeModal(){
  imageModalBackground.classList.remove("expanded-background");
  imageModalContainer.classList.toggle("expanded-slider");
}