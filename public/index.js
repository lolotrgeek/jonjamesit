let home = ''
let blog = 'hello world'
let contact = 'contact'


const person = {
    name: 'Jonathan James',
    job: '',
    city: '',
    bio: 'Ideas revealed.'
}

const markup = `
 <div class="person">
    <h1 class='title' >
        ${person.name}
    </h1>
    <p class="bio">${person.bio}</p>

    <nav class="navbar">
      <ul class="navbar-list">
        <li class="nav-item"><a href="/" onclick="onNavItemClick('/'); return false;">Home</a></li>
        <li class="nav-item"><a href="/about" onclick="onNavItemClick('/about'); return false;">About</a></li>
        <li class="nav-item"><a href="/contact" onclick="onNavItemClick('/contact'); return false;">Contact</a></li>
      </ul>
    </nav>
 </div>
`;


/**
 * HEADER AND FOOTERS 
 */
document.body.onload = header(markup)
function header(content) {
    const header = document.createElement("div")
    header.innerHTML = content
    // header.appendChild(content)
    const first = document.body.firstChild
    document.body.insertBefore(header, first)
}
function footer(content){
    const footer = document.createElement("div")
    document.body.insertBefore(footer.appendChild(content), document.body.lastChild)
}

/**
 * ROUTING
 */
let contentDiv = document.getElementById('content')
let routes = {
  '/': home,
  '/index.html': home,
  '/about': about,
  '/contact': contact,
}
window.onpopstate = () => contentDiv.innerHTML = routes[window.location.pathname]

let onNavItemClick = (pathName) => {
  window.history.pushState({}, pathName, window.location.origin + pathName)
  contentDiv.innerHTML = routes[pathName]
}
contentDiv.innerHTML = routes[window.location.pathname]
