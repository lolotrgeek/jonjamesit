/**
 * CONTENT
 */
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
 *  CONTENT 
 */

let content = document.getElementById('content')

const buildPage = (result) => new Promise((resolve, reject) => {
    let page = `<h1>${result.title}</h1>
        <div class='content'>${result.post}</div>`
    resolve(page)
})

const buildBlog = (result) => new Promise((resolve, reject) => {
    let blog = `<ul class="posts">
      ${result.titles.map((title, index) => `<li class="post-title"><a href="/${result.links[index]} ">${title}</a></li>`).join('')}
      </ul>`
    resolve(blog)
})

const buildPost = (result) => new Promise((resolve, reject) => {
    let post = `<h2 class='post-title'>${result.title}</h2>
        <h3 class='post-date'>${result.date}</h3>
        <div class='post-content'>${result.post}</div>`
    resolve(post)
})

/**
 * ROUTING
 */
let routes = {
    '/': home,
    '/index.html': home,
    // '/about': about,
    '/contact': contact
}
// window.onpopstate = () => contentDiv.innerHTML = routes[window.location.pathname]
// let onNavItemClick = (pathName) => {
//   window.history.pushState({}, pathName, window.location.origin + pathName)
//   contentDiv.innerHTML = routes[pathName]
// }
// contentDiv.innerHTML = routes[window.location.pathname]



const buildRoutes = async (result) => new Promise((resolve, reject) => {
    console.log('building routes')
    routes.lastEdit = result.lastEdit
    buildBlog(result)
        .then(blog => {
            routes['/blog'] = blog
        })
        .then(() => result.links.map((link, index) => routes['/' + link] = index + firstContentRow))
        .then(() => console.log('routes: ' + JSON.stringify(routes)))
        .then(() => resolve(routes))
})


const localStore = (entry, result) => new Promise((resolve, reject) => {
    let storeentry = {}
    storeentry.entry = entry
    storeentry.lastEdit = result.lastEdit
    console.log('saving entry')
    window.localStorage.setItem(path.toString(), JSON.stringify(storeentry))
    resolve(entry)
})

const runQuery = (post, err) => new Promise((resolve, reject) => {
    console.log(err)
    buildQuery(post)
        .then(url => getQuery(url))
        .then(query => parseQuery(query))
        .then(result => resolve(result))
        .catch(err => reject(err))
})

const parseResult = (result) => new Promise((resolve, reject) => {
    if (result.page) {
        buildPage(result)
            .then(page => localStore(page, result))
            .then(page => resolve(page))
            .catch(err => reject(err))
    } else {
        buildPost(result)
            .then(post => localStore(post, result))
            .then(post => resolve(post))
            .catch(err => reject(err))
    }
})

const checkCache = (name) => new Promise((resolve, reject) => {
    let localItem = window.localStorage.getItem(name)
    console.log('looking for newest item: ' + name)
    if (!localItem) {
        reject('No local ' + name + ' found')
    } else {
        buildQuery(lastEdit)
            .then(url => getQuery(url))
            .then(result => {
                let serverTime = parseInt(result.values[0][0])
                console.log('Server Last Edit: ' + serverTime)
                if (!serverTime || typeof serverTime !== 'number') {
                    reject('invalid lastEdit')
                }
                else {
                    let foundItem = JSON.parse(localItem)
                    console.log('Local Last Edit: ' + foundItem.lastEdit)
                    if (!foundItem.lastEdit || !parseInt(foundItem.lastEdit)) {
                        window.localStorage.removeItem(name)
                        reject('local item invalid, get new one')
                    }
                    else if (serverTime > foundItem.lastEdit) {
                        // window.localStorage.clear()
                        window.localStorage.removeItem(name)
                        reject('local item old, get new one')
                    }
                    else {
                        resolve(foundItem)
                    }
                }
            })
    }
})

const followRoute = (routes) => {
    let path = routes[window.location.pathname]
    return new Promise((resolve, reject) => {
        // get a post
        if (typeof path === 'number') {
            let post = [getPost(titles, path), getPost(dates, path), getPost(contents, path), getPost(postlastEdit, path)]
            checkCache(path.toString())
                .then(posts => {
                    console.log('found post in cache')
                    console.log(posts)
                    resolve(posts.post)
                })
                .catch(err => {
                    runQuery(post, err)
                        .then(result => parseResult(result))
                        .then(content => resolve(content))
                        .catch(err => reject(err))
                })
        }
        else {
            resolve(path)
        }
    })
}

const renderRoutes = (routes) => {
    window.onpopstate = () => {
        followRoute(routes)
            .then(route => content.innerHTML = route)
            .catch(err => content.innerHTML = err) // TODO: retry fetch
    }
    followRoute(routes)
        .then(route => content.innerHTML = route)
        .catch(err => content.innerHTML = err) // TODO: retry fetch
}

const buildSite = async () => {
    checkCache('routes')
        .then(routes => {
            console.log('found routes in cache')
            console.log(routes)
            renderRoutes(routes)
        })
        .catch(err => {
            console.log(err)
            // get from cms
            buildQuery(queries.routes)
                .then(url => getQuery(url))
                .then(query => parseQuery(query))
                .then(result => buildRoutes(result))
                .then(routes => {
                    console.log('getting routes from cms')
                    console.log(routes)
                    renderRoutes(routes)
                    console.log('caching routes')
                    window.localStorage.setItem('routes', JSON.stringify(routes))
                })
                .catch(err => console.log(err))
        })
}
buildSite()