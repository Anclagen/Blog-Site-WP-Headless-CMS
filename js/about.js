import {baseUrl, routes, callAPI, callApiGetPages, parameters, addLoader, blogPostUrl, sponsorUrl, categoriesUrl, createErrorMessage, createSponsors} from "./components/api_utilities.js"
import {menuBtn, searchBtn, searchForm, sponsorsContainer} from "./constants/constants.js"
import { productSearch, openCloseMenu, openCloseSearch} from "./components/components.js"

/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);
//search
searchBtn.addEventListener("click", openCloseSearch);
searchForm.addEventListener("submit", productSearch);

/*-------------- get sponsors data --------------*/
createSponsors(sponsorUrl, sponsorsContainer)


/*-------------- create main page content --------------*/
const aboutContentContainer = document.querySelector(".about-content-container")
async function createPageContent(){
  try{
    let aboutData = await callAPI(baseUrl + routes.page + "/90");
    console.log(aboutData);
    aboutContentContainer.innerHTML = aboutData.content.rendered;
  } catch(error){
    console.log(error);
    createErrorMessage(aboutContentContainer);
  }

}

createPageContent()