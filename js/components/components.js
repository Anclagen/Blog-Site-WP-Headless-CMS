
/*-------------- standard post layout creator -----------------*/
export function createPost(data){
  let tags ="";
  data.category.forEach((tag, i) => {
    if(i !== 0){
      tags += ", ";
    }
    tags += `<a href="posts.html?tags=${tag.id}" class="post-tags">${tag.name}</a>`;
  });

  let post = `
                <div class="post-container">
                  <div class="post-image-container">
                    <a href="post_specific.html?id=${data.id}"><img src="${data.featured_image.size_large}" alt="${data.acf.post_summary}" class="post-image"></a>
                    <div class="author-image">
                      <img src="${data.acf.author_image}" alt="Picture of ${data.acf.author}">
                    </div>
                    <div class="post-date">
                      <span>${data.acf.published}</span><span class="author-text">Author: ${data.acf.author}</span>
                    </div>
                  </div>
                  <div class="post-heading">
                    <a href="post_specific.html?id=${data.id}" ><h3>${data.title.rendered}</h3></a>
                    <p>${data.acf.post_summary}</p>
                  </div>
                  <div class="post-details">
                    <span>Tags: ${tags}</span>
                  </div>
                </div>
                `;
  return post
}

/*-------------- sponsor content creator -----------------*/
export function createSponsoredContent(sponsorData, sponsorsContainer){
  sponsorsContainer.innerHTML="";
  let sponsorPost = "<p>No Sponsors, No Money!</p>";
  for(let i = 0; i < sponsorData.length; i++){
    sponsorPost = `<div>
                    <a href="${sponsorData[i].acf.sponsor_url}">
                      <img src="${sponsorData[i].acf.logo}" alt="${sponsorData[i].acf.name}'s logo" class="sponsor-logo-image" loading=lazy>
                    <a>
                  </div>
                  <div class="leo-sponsor-comment">
                    <p>${sponsorData[i].acf.our_quote}</p>
                    <img src="${sponsorData[i].acf.our_image}" alt="Leo giving his speech"/>
                  </div>`
    sponsorsContainer.innerHTML += sponsorPost
  }
}

/*-----------------  Menu Open/Close -----------------*/
//menu on phone
export function openCloseMenu(){
  const menuLinks = document.querySelector(".navigation-menu");
  const hamTopLine = document.querySelector(".line1");
  const hamMidLine = document.querySelector(".line2");
  const hamBotLine = document.querySelector(".line3");
  menuLinks.classList.toggle("hide-menu");
  hamTopLine.classList.toggle("menu-open-rotate1");
  hamBotLine.classList.toggle("menu-open-rotate3");
  hamMidLine.classList.toggle("menu-open-transparent");
}

//displays search input
export function openCloseSearch(){
  const searchContainer = document.querySelector(".search-container");
  searchContainer.classList.toggle("hidden-search"); 
}

/*----------------- search function -----------------*/
export function productSearch(submit) {
  submit.preventDefault();
  //define the search input and value
  const searchInput = document.querySelector(".search-input");
  const searchTerms = searchInput.value.split(" ");
  window.location = `posts.html?search=${searchTerms}`;
}

/*----------------- Form Validation -----------------*/

//validates text inputs
export function validatedInputLength(input, length, errorContainer) {
  if (input.value.trim().length > length) {
    errorContainer.innerText = "";
    input.style.border ="2px solid green";
    return true;
  } else {
    input.style.border ="2px solid red";
    errorContainer.innerText = `Your ${input.name} must have a minimum of ${length + 1} characters.`;
  }
}

//validates number only inputs
export function validatedNumberInputLength(input, length, errorContainer){
  const numberRegEx = /^\d+$/;
  const validInput = numberRegEx.test(input.value);
  if(validInput && input.value.trim().length === length){
    errorContainer.innerText = "";
    input.style.border ="2px solid green";
    return true;
  } else {
    errorContainer.innerText = `Please enter a ${length} digit number.`
    input.style.border ="2px solid red";
  }
}

//validate emails
export function validateEmailInput(email, errorContainer) {
  const emailRegEx = /^([a-z0-9_\.\+-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
  const validateEmail = emailRegEx.test(email.value);
  if (validateEmail){ 
    errorContainer.innerText = "";
    email.style.border ="2px solid green";
    return true;
  } else {
    errorContainer.innerText = `Please enter a valid email address`;
    email.style.border ="2px solid red";
  }
}

export function resetBorders(input){
  input.style.border = "2px solid grey";
}