// API constants

export const baseUrl = "https://fluffypiranha.one/exam_project_1/wp-json/wp/v2";

export const routes = {
  page: "/pages",
  posts: "/posts",
  blogPosts: "/blog_posts",
  sponsors: "/sponsor",
  media: "/media",
  tags: "/tags",
  categories: "/post_category",
}

export const parameters = {
  acf: "acf_format=standard",
  results25: "posts_per_page=25",
}

// callAPI (url) and return data
export async function callAPI (url){
  const response = await fetch(url);
  const data = await response.json();
 return data
}

export function addLoader(container){
  container.innerHTML = `<div class="loader">
                          <div class="outer-loader"></div>
                          <div class="inner-loader"></div>
                          <p>Getting products, please wait...</p>
                        </div>`;
}