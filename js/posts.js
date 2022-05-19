import {callAPI, callApiGetPages, blogPostUrl, categoriesUrl, searchBlogPostsUrl} from "./components/api_utilities.js"
import {createPost, createErrorMessage, addLoader} from "./components/components.js"

/*-------------- query string grabs --------------*/

const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const tags = params.get("tags");
let searchTerms = params.get("search");

/*-------------- defining the initial url --------------*/
const title = document.querySelector("title");
let initialUrl = blogPostUrl;

if(tags !== null){
  initialUrl = blogPostUrl + "&categories=" + tags;
} else if(searchTerms !== null){
  initialUrl = searchBlogPostsUrl + searchTerms;
  title.innerText = `Searching Posts For; ${searchTerms} | The Fluffy Piranha`
}

/*-------------- Main Page Content Creation --------------*/

const postResultsContainer = document.querySelector(".post-results-container");
let currentPostCreated = 0;
let postData = [];
let pagesAndPosts = [];

// get data and creates page content
async function createPageContent(){
  try{
    //initial api call, also grabbing headers for pages and results
    let data = await callApiGetPages(initialUrl);
    
    //search data lacking some info so additional call done with post ids for more data
    if(searchTerms !== null ){
      if(data[0].length > 0){
        data = await getSearchData(data);
      }
    }
  
    postData = data[0];
    //pages could be used later
    pagesAndPosts = [data[1], data[2]];

    //get number of results
    if(postData.length <= 10){
      currentPostCreated = postData.length;
      showMoreBtn.disabled = true;
    } else {
      currentPostCreated = 10;
      showMoreBtn.disabled = false;
    }

    createPageHTML(postData);
    fillResultsDetails(postData);
    updateHeading();
  }catch(error){
    console.log(error)
    createErrorMessage(postResultsContainer);
  }
}

// add filter options 
async function addFilterOptions(){
  const categoriesData = await callAPI(categoriesUrl);
  createFilterOptions(categoriesData);
  //sets category drop down to selected tag
  if(tags !== null){
    filterSelectContainer.value = tags;
  }
}

//do extra api call with search ids
async function getSearchData(data){
  let searchIds = "";
  data[0].forEach(element => {
    searchIds += element.id + ",";
  })
  const searchResultsUrl = blogPostUrl + "&include=" + searchIds;
  data = await callApiGetPages(searchResultsUrl);
  return data
}

/*function to fill the initial page kept getting intermittent
random errors if filters weren't filled first*/
async function fillPage(){
  await addFilterOptions();
  createPageContent();
}

fillPage();

//create page html
function createPageHTML(data){
  postResultsContainer.innerHTML = "";
  let count = 0;
  for(let i = 0; i < data.length; i++){
    count += 1;
    let post = createPost(data[i]);
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
    numberShownPostsContainer.innerText = currentPostCreated;
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
    currentPostCreated = postData.length;
    showMoreBtn.disabled = true;
  } else{
    currentPostCreated += 10}
  numberShownPostsContainer.innerHTML = currentPostCreated;
  createPageHTML(postData);
}

//create filter options
let filterSelectContainer = document.querySelector("#filter");
let sortSelector = document.querySelector("#sort");

function createFilterOptions(data){
  filterSelectContainer.innerHTML =`<option value="All" selected> All</option>`;
  data.forEach(element => {
    const option = `<option value="${element.id}" name="${element.name}"> ${element.name}</option>`;
    filterSelectContainer.innerHTML += option;
  });
  //sets category drop down to selected tag
  if(tags !== null){
    filterSelectContainer.value = tags;
  }
}

//update heading
const pageHeading = document.querySelector("h1");
function updateHeading(){
  if(searchTerms !== null ){
    pageHeading.innerText = `Search Results For; ${searchTerms}`;
    title.innerText = `Searching Posts For; ${searchTerms} | The Fluffy Piranha`;
    searchTerms = null;
  } else{
    pageHeading.innerHTML = filterSelectContainer.options[filterSelectContainer.selectedIndex].text;
    title.innerText = `${filterSelectContainer.options[filterSelectContainer.selectedIndex].text} Posts | The Fluffy Piranha`;
  }
}

//add filter for categories to data
filterSelectContainer.addEventListener("change", updateResults);
sortSelector.addEventListener("change", updateResults);

//combines filter and sort url additions to generate results
function updateResults(){
  addLoader(postResultsContainer);
  filterResults();
  sortResults();
  createPageContent();
}

//updates the categories for url
function filterResults(){
  //stops search query string over writing heading
  searchTerms = null;
  if(filterSelectContainer.value === "All"){
    initialUrl = blogPostUrl;
  } else {
    initialUrl = blogPostUrl + "&categories=" + filterSelectContainer.value;
  }
}

//add appropriate sort to the url
function sortResults(){
  if(sortSelector.value === "Oldest"){
    initialUrl = initialUrl + "&filter[orderby]=date&order=asc";
  } 
}