
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


/*---------- image modal ----------*/

export function addImageModals(){
  const imageModalBackground = document.querySelector(".modal-background-container");
  const imageModal = document.querySelector(".image-modal");
  const imageModalCaption = document.querySelector(".image-modal-caption");
  const imageModalContent = document.querySelector(".image-modal-content")
  const imagesModals = document.querySelectorAll(".modal-image, .featured-image");
  
  imagesModals.forEach(function(image) {
    //assign event listener to all checkboxes
    image.addEventListener('click', function() {
      imageModal.src = this.src;
      imageModal.alt = this.alt;
      imageModalCaption.innerText = this.alt
      imageModalContent.classList.add("image-modal-content-expanded");
      imageModalBackground.style.display = "block";
    })  
  });

  //assign event listener to background for closing modal
  imageModalBackground.addEventListener("click", function(){
  imageModal.src = "";
  imageModal.alt = "";
  imageModalCaption.innerText = "";
  imageModalContent.classList.remove("image-modal-content-expanded");
  imageModalBackground.style.display = "none";
})
}

/*---------- create comments ----------*/
export function createComments(data, commentsContainer){
  commentsContainer.innerHTML ="";
  let countLeft = 1;
  let countRight = 1;
  for(let i = 0; i < data.length; i++){
    if((i+1)%2 !== 0){
      if(countRight%2 !== 0){
        commentsContainer.innerHTML +=`<div class="comment-right">
                                        <img src="/images/head_of_leo.png" alt="image of dog head" class="comment-img hidden-on-mobile" />
                                        <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                        </div>`;
        countRight++;
      } else{ 
        commentsContainer.innerHTML += `<div class="comment-right">
                                      <img src="/images/head_of_dog_2.png" alt="image of dog head" class="comment-img hidden-on-mobile">
                                      <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                      </div>`;
        countRight++;
      }
    } else{
      if(countLeft%2 !== 0){
        commentsContainer.innerHTML +=`<div class="comment-left">
                                        <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                        <img src="/images/head_of_beagle.png" alt="image of dog head" class="comment-img hidden-on-mobile" />
                                        </div>`;
        countLeft++;
      } else{ 
        commentsContainer.innerHTML += `<div class="comment-left">
                                        <div><p><b>${data[i].author_name}</b>, posted on: ${data[i].date_gmt.slice(0, -9)}</p>${data[i].content.rendered}</div>
                                        <img src="/images/head_of_dog.png" alt="image of dog head" class="comment-img hidden-on-mobile" />
                                        </div>`;
        countLeft++;
      }
    }
  }
}

