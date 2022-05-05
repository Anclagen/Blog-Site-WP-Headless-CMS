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