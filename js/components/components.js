
/*-------------- standard post layout creator -----------------*/
export function createPost(data){
  let tags ="";
  data.category.forEach((tag, i) => {
    if(i !== 0){
      tags += ", ";
    }
    tags += tag.name;
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

// search function
export function productSearch(submit) {
  submit.preventDefault();
  //define the search input and value
  const searchInput = document.querySelector(".search-input");
  const searchTerms = searchInput.value.split(" ");
  window.location = `posts.html?search=${searchTerms}`;
}