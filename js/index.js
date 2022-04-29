
const url = "https://fluffypiranha.one/flowerpower/wp-json/wp/v2/posts?_embeded"
const main = document.querySelector(".main-content");

async function callAPI (url){
  const response = await fetch(url);
  const data = await response.json();
  let content = data[0].content.rendered
  console.log(data);
  main.innerHTML = content;
}
//callAPI (url)