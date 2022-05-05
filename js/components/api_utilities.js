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
  results25: "posts_per_page=25",
  results50: "posts_per_page=50",
  search: "search=", //add search terms
}

// reused urls
export const blogPostUrl = baseUrl + routes.blogPosts + "?" + parameters.acf + "&" + parameters.results50;
export const sponsorUrl = baseUrl + routes.sponsors + "?" + parameters.acf;
export const categoriesUrl = baseUrl + routes.categories + "?" + parameters.acf + "&" + parameters.results50;


// callAPI (url) and return data
export async function callAPI (url){
  const response = await fetch(url);
  const data = await response.json();
  
 return data
}

//callApi and returns data and updates a pages variable
export async function callApiGetPages (url){
  const response = await fetch(url);
  //might be needed for blog posts in the long run
  const pages = response.headers.get("X-WP-TotalPages");
  console.log(pages)
  const numberPosts = response.headers.get("X-WP-Total");
  console.log(numberPosts)
  return [pages, numberPosts]
}

export function addLoader(container){
  container.innerHTML = `<div class="loader">
                          <div class="outer-loader"></div>
                          <div class="inner-loader"></div>
                          <p>Getting products, please wait...</p>
                        </div>`;
}

/*---------- Posts --------------*/

// Subscriber key for posting comments only.
export const subscriberUsername = "Anonymous"
export const commentKey = "Eukx 4nvk mFvr Leod G1ld afv1";

export async function postComment(data, formReportingContainer){
  try{
    await fetch("https://fluffypiranha.one/exam_project_1/wp-json/wp/v2/comments", 
          {method: "POST",
          headers:{"Content-Type": "application/json",
                     "Authorization": "Basic " + btoa("Anonymous" + ":" + "Eukx 4nvk mFvr Leod G1ld afv1")},
                     body: data});
    formReportingContainer.innerHTML = `<p class="success">Success your message has been posted</p>`
  } catch(error){
    console.log(error)
    formReportingContainer.innerHTML = `<p class="error">An error occurred when posting your message</p>`
  }
}