import {baseUrl, routes, callAPI, callApiGetPages, parameters, addLoader, blogPostUrl, sponsorUrl, categoriesUrl} from "./components/api_utilities.js"
import {menuBtn, searchBtn, searchForm, sponsorsContainer} from "./constants/constants.js"
import {createSponsoredContent, productSearch, openCloseMenu, openCloseSearch} from "./components/components.js"


/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);
//search
searchBtn.addEventListener("click", openCloseSearch);
searchForm.addEventListener("submit", productSearch);


const aboutContentContainer = document.querySelector(".about-content-container")
async function createPageContent(){
  try{
    let aboutData = await callAPI(baseUrl + routes.page + "/90");
    console.log(aboutData);
    aboutContentContainer.innerHTML = aboutData.content.rendered;

    //fill sponsor content
    const sponsorData = await callAPI(sponsorUrl);
    createSponsoredContent(sponsorData, sponsorsContainer);
  } catch(error){
    console.log(error);
  }

}

createPageContent()