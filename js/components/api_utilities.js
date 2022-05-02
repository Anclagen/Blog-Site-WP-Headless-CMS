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

//might be needed for blog posts in the long run
export async function callApiGetPages (url, pages){
  const response = await fetch(url);
  const data = await response.json();
  pages = response.headers.get("X-WP-TotalPages");
 return data
}

export function addLoader(container){
  container.innerHTML = `<div class="loader">
                          <div class="outer-loader"></div>
                          <div class="inner-loader"></div>
                          <p>Getting products, please wait...</p>
                        </div>`;
}