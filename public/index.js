/**
 * CONTENT
 */
let contentDiv = document.getElementById('content')

const person = {
  name: 'Jonathan James',
  job: '',
  city: 'St. Louis',
  bio: 'Ideas revealed.'
}

const headerContent = `
 <div class="person">
    <h1 class='title' >
        ${person.name}
    </h1>
    <p class="bio">${person.bio}</p>

    <nav class="navbar">
      <ul class="navbar-list">
        <li class="nav-item"><a href="./" onclick="onNavItemClick('/'); return false;">Home</a></li>
        <li class="nav-item"><a href="./about" onclick="onNavItemClick('/about'); return false;">About</a></li>
        <li class="nav-item"><a href="./blog" onclick="onNavItemClick('/blog'); return false;">Blog</a></li>
        <li class="nav-item"><a href="./contact" onclick="onNavItemClick('/contact'); return false;">Contact</a></li>
      </ul>
    </nav>
 </div>
`;


const footerContent = `<footer class="footer">
<a href="mailto:jonjamesit@gmail.com">jonjamesit@gmail.com</a> |
<!--<a href="tel:"></a> |-->
<a href="https://www.linkedin.com/in/jonathandavidjames/">linkedin</a>
</footer>`;

/**
 * HEADER AND FOOTERS 
 */
document.body.onload = header(headerContent)
function header(content) {
  const header = document.createElement("div")
  header.innerHTML = content
  const first = document.body.firstChild
  document.body.insertBefore(header, first)
}
function footer(content) {
  const footer = document.createElement("div")
  footer.innerHTML = content
  const last = document.body.lastChild
  document.body.insertBefore(footer, last)
}


/**
 * ROUTING
 */
let routes = {
  '/': home,
  '/index.html': home,
  '/about': about,
  '/blog': blog,
  '/contact': contact
}
window.onpopstate = () => contentDiv.innerHTML = routes[window.location.pathname]
let onNavItemClick = (pathName) => {
  window.history.pushState({}, pathName, window.location.origin + pathName)
  contentDiv.innerHTML = routes[pathName]
}
contentDiv.innerHTML = routes[window.location.pathname]

/**
 * BLOG
 */

let post = {}
post.date = ''
post.title = ''
// post.link = contents.title.split(" ").join("-").toLowerCase()

// let blog = `
//     <ul class="posts">
//     ${posts.map(post => `<li class="post-title"><a href="/${post.title}">${post.title}</a></li>`).join('')}
//     </ul>
// `
