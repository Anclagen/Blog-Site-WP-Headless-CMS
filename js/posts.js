import {baseUrl, routes, callAPI, callApiGetPages, parameters, addLoader, blogPostUrl, sponsorUrl, categoriesUrl} from "./components/api_utilities.js"
import {menuBtn, searchBtn, searchForm, sponsorsContainer} from "./constants/constants.js"
import {createPost, createSponsoredContent, productSearch, openCloseMenu, openCloseSearch} from "./components/components.js"

/*-------------- navigation menu --------------*/
menuBtn.addEventListener("click", openCloseMenu);

//search
searchBtn.addEventListener("click", openCloseSearch);

searchForm.addEventListener("submit", productSearch);

/*-------------- API and Page Creation --------------*/


let currentPostCreated = 0;
let postData = [];
let pagesAndPosts = [];

async function createPageContent(){
  //getting additional header info for total posts and if results are paginated.
  const categoriesData = await callAPI(categoriesUrl);
  //creates options for tags filter
  createFilterOptions(categoriesData);
  const data = await callApiGetPages(blogPostUrl);
  postData = data[0]
  pagesAndPosts = [data[1], data[2]];

  //get number of results
  if(postData.length < 10){
    currentPostCreated = postData.length
  } else {
    currentPostCreated = 10;
  }
  
  fillResultsDetails(postData);
  createPageHTML(postData);

  //fill sponsor content
  const sponsorData = await callAPI(sponsorUrl);
  createSponsoredContent(sponsorData, sponsorsContainer);
}

createPageContent();

//create page html
const postResultsContainer = document.querySelector(".post-results-container");

function createPageHTML(data){
  postResultsContainer.innerHTML = "";
  let count = 0;
  for(let i = 0; i < data.length; i++){
    count += 1;
    let post = createPost(data[i])
    postResultsContainer.innerHTML += post;
    if(count === currentPostCreated){
      break
    }
  }
}

//fill in results showing containers
const numberShownPostsContainer = document.querySelector(".current-shown-results");
const totalNumberPostsContainer = document.querySelector(".total-results");

function fillResultsDetails(data){
  if(data.length >=10){
    numberShownPostsContainer.innerText = 10;
  } else {
    numberShownPostsContainer.innerText = data.length;
  }
  totalNumberPostsContainer.innerText = pagesAndPosts[1];
}

//show more button functionality
const showMoreBtn = document.querySelector(".show-more-results");
showMoreBtn.addEventListener("click", showMorePosts);

function showMorePosts(){
  if(currentPostCreated + 10 >= postData.length){
    currentPostCreated = postData.length
    showMoreBtn.disabled = true;
  } else{
    currentPostCreated += 10}
  numberShownPostsContainer.innerHTML = currentPostCreated;
  createPageHTML(postData)
}

//create filter options
const pageHeading = document.querySelector("h1");

let filterSelectContainer = document.querySelector("#filter");

function createFilterOptions(data){
  data.forEach(element => {
    const option = `<option value="${element.id}" name="${element.name}"> ${element.name}</option>`;
    filterSelectContainer.innerHTML += option;
  });
}

//add filter sort to data
filterSelectContainer.addEventListener("change", filterDataCreateHTML)

async function filterDataCreateHTML(){
  if(filterSelectContainer.value === "All Posts"){
    createPageContent();
  } else {
    postResultsContainer.innerHTML = "";
    let filteredPostData = postData.filter(data => {
      return data.categories.includes(Number(filterSelectContainer.value))});
    fillResultsDetails(filteredPostData);
    totalNumberPostsContainer.innerText = filteredPostData.length;
    createPageHTML(filteredPostData);
  }
  
  pageHeading.innerHTML = filterSelectContainer.options[filterSelectContainer.selectedIndex].text;
}






/*-------- Trying to do too much at once ----------*/
// with pagination I can just run query parameters through the initial page build function


// filterSelectContainer.addEventListener("change", filterDataCreateHTML)

// async function filterDataCreateHTML(){
//   if(filterSelectContainer.value === "All Posts"){
//     createPageHTML(postData);
//   } else if(postData.length < 50){
//     postResultsContainer.innerHTML = "";
//     let filteredPostData = postData.filter(data => {
//       return data.categories.includes(Number(filterSelectContainer.value))});
//     createPageHTML(filteredPostData);
//   } else {
//     //for when the number of posts cause pagination
//     addLoader(postResultsContainer);
//     let filterUrl = baseUrl + routes.categories + "/" + filterSelectContainer.value + "?" + parameters.acf + "&" + parameters.results50
//     let filteredPostData = await callAPI(filterUrl);
//     console.log(filteredPostData);
//     createPageHTML(filteredPostData);
//   }
  
//   pageHeading.innerHTML = filterSelectContainer.options[filterSelectContainer.selectedIndex].text;
// }