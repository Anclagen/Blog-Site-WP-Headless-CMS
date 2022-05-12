// ------- imports --------
import {createPost, productSearch, openCloseMenu, openCloseSearch} from "./components/components.js"
import {baseUrl, routes, callAPI, parameters, blogPostUrl, sponsorUrl, addLoader, sortOldestUrl, createErrorMessage, createSponsors} from "./components/api_utilities.js"
import {menuBtn, searchBtn, searchForm, sponsorsContainer} from "./constants/constants.js"


/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);
//search
searchBtn.addEventListener("click", openCloseSearch);
searchForm.addEventListener("submit", productSearch);

/*-------------- get sponsors data --------------*/
createSponsors(sponsorUrl, sponsorsContainer)