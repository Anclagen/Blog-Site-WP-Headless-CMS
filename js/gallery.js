// ------- imports --------
import {keyDown} from "./components/nav_footer";
import {baseUrl, callAPI} from "./components/api_utilities.js";
import {errorMessage} from "./constants/constants.js";

const diaryMediaUrl = baseUrl + "/media?_embed&categories=11&per_page=100";

/*-------------- Create Page Content -----------------*/
const diaryContainer = document.querySelector(".diary-gallery-slide");

//slider variables
let diaryTransform = 0;
let diaryCurrentPage = 0;
let diaryMaxPages = 0;

async function CreatePageContent(){
  try{
    const diaryData = await callAPI(diaryMediaUrl);

    adjustWidths(diaryData.length);
    diaryTransform = 100/diaryData.length;
    diaryMaxPages = diaryData.length;
    addGalleryImages(diaryData, diaryContainer);
    const images = document.querySelectorAll(".gallery-image");

    images.forEach(element => {
      element.style.width = `${diaryTransform}%`;
    });

  }catch(error){
    console.log(error);
    errorMessage(diaryContainer);
  }
}

CreatePageContent();

/*------- Image Modal Slider --------*/
function addGalleryImages(data, container){
  for(let i = 0; i < data.length; i++){
    container.innerHTML += `<img src="${data[i].media_details.sizes.full.source_url}" class="gallery-image"alt="${data[i].alt_text}" />`;
  }
}

//adjust sliders width base on number of images
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
