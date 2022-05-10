// API constants
export const baseUrl = "https://fluffypiranha.one/exam_project_1/wp-json/wp/v2";

// routes 
export const routes = {
  page: "/pages",
  posts: "/posts",
  blogPosts: "/blog_posts",
  sponsors: "/sponsor",
  media: "/media",
  tags: "/tags",
  categories: "/categories",
}

// parameters
export const parameters = {
  acf: "acf_format=standard",
  results25: "per_page=25",
  results50: "per_page=50",
  search: "search=", //add search terms
}

// reused urls
export const blogPostUrl = baseUrl + routes.blogPosts + "?" + parameters.acf + "&" + parameters.results50;
export const sponsorUrl = baseUrl + routes.sponsors + "?" + parameters.acf;
export const categoriesUrl = baseUrl + routes.categories + "?" + parameters.acf + "&" + parameters.results50;
export const sortOldestUrl = baseUrl + routes.blogPosts + "?" + "filter[orderby]=date&order=asc" + parameters.acf + "&" + parameters.results50;
export const searchBlogPostsUrl = baseUrl + "/search?"+ parameters.acf + "&" + parameters.results50 +"&type=post&subtype=blog_posts&search=";

// callAPI (url) and return data
export async function callAPI (url){
  const response = await fetch(url);
  const data = await response.json();
  
 return data
}

//callApi and returns data and updates a pages variable
export async function callApiGetPages (url){
  const response = await fetch(url);
  const data = await response.json();
  //might be needed for blog posts in the long run
  const pages = response.headers.get("X-WP-TotalPages");
  const numberPosts = response.headers.get("X-WP-Total");
  return [data, pages, numberPosts]
}

export function addLoader(container){
  container.innerHTML = `<div class="loader">
                          <div class="outer-loader"></div>
                          <div class="inner-loader"></div>
                          <p>Getting products, please wait...</p>
                        </div>`;
}

// catch error message generator
export function createErrorMessage(container){
  container.innerHTML = `<div class="error message">
                          <p> An error occurred while fetching the data </p>
                          <p> Please try reloading the page, if this error persists please contact us using a query form </p>
                        </div>`;
}

/*---------- Posts --------------*/

// Subscriber key can only post comments.
export const subscriberUsername = "Anonymous"
export const commentKey = "Eukx 4nvk mFvr Leod G1ld afv1";

export async function postComment(data, formReportingContainer){
  try{
    const response = await fetch("https://fluffypiranha.one/exam_project_1/wp-json/wp/v2/comments", 
          {method: "POST",
          headers:{"Content-Type": "application/json",
                     "Authorization": "Basic " + btoa("Anonymous" + ":" + "Eukx 4nvk mFvr Leod G1ld afv1")},
                     body: data});
    console.log(response.json)
    formReportingContainer.innerHTML = `<p class="success">Success your message has been posted</p>`
  } catch(error){
    console.log(error)
    formReportingContainer.innerHTML = `<p class="error">An error occurred when posting your message</p>`
  }
}

/*---------- Sponsored ------------*/

export async function createSponsors(sponsorUrl, sponsorsContainer){
  try{
  //fill sponsor content
  const sponsorData = await callAPI(sponsorUrl);
  createSponsoredContent(sponsorData, sponsorsContainer);
  } catch(error){
    console.log(error);
    createErrorMessage(sponsorsContainer);
  }
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