import {baseUrl, routes, callAPI, parameters, addLoader, blogPostUrl, sponsorUrl, categoriesUrl} from "./components/api_utilities.js"
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

/*-------------- API and Page Creation --------------*/
const postResultsContainer = document.querySelector(".post-results-container");
let currentPostCreated = 10;

let postData = [];
async function createPageContent(){
  postData = await callAPI(blogPostUrl);
  const categoriesData = await callAPI(categoriesUrl);
  
  
  //con
  createFilterOptions(categoriesData);

  let doubletime = postData.concat(postData.reverse());
  doubletime = doubletime.concat(doubletime);

  //generate 10 items
  
  
  createPageHTML(doubletime);

  //fill sponsor content
  const sponsorData = await callAPI(sponsorUrl);
  createSponsoredContent(sponsorData, sponsorsContainer);
}

//create page html
function createPageHTML(postData){
  let count = 0;
  for(let i = 0; i < postData.length; i++){
    count += 1;
    let post = createPost(postData[i])
    postResultsContainer.innerHTML += post;
    if(count === 10){
      break
    }
  }
}

createPageContent();

//create filter options
const pageHeading = document.querySelector("h1");

let filterSelectContainer = document.querySelector("#filter");

function createFilterOptions(data){
  data.forEach(element => {
    const option = `<option value="${element.id}" name="${element.name}"> ${element.name}</option>`;
    filterSelectContainer.innerHTML += option;
  });
}

filterSelectContainer.addEventListener("change", filterDataCreateHTML)

async function filterDataCreateHTML(){
  console.log(postData.length)
  if(filterSelectContainer.value === "All Posts"){
    createPageHTML(postData);
  } else if(postData.length < 50){
    postResultsContainer.innerHTML = "";
    let filteredPostData = postData.filter(data => {
      return data.categories.includes(Number(filterSelectContainer.value))});
    createPageHTML(filteredPostData);
  } else {
    addLoader(postResultsContainer);
    let filterUrl = baseUrl + routes.categories + "/" + filterSelectContainer.value + "?" + parameters.acf + "&" + parameters.results50
    let filteredPostData = await callAPI(filterUrl);
    console.log(filteredPostData);
    createPageHTML(filteredPostData);
  }
  
  pageHeading.innerHTML = filterSelectContainer.options[filterSelectContainer.selectedIndex].text;
}