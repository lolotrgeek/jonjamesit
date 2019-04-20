//post loop
// date + title


let posts = [
    {
        title: 'First post',
        content: '/posts/firstpost.md'
    },
    {
        title: 'hello world'
    },
    {
        title: 'hello world again'
    },
]



let blog = `
    <ul class="posts">
    ${posts.map(post => `<li class="post-title"><a href="/${post.title}">${post.title}</a></li>`).join('')}
    </ul>
`

// fetch(websiteUrl).then((res) => {
//     res.text().then((htmlTxt) => {
//         var domParser = new DOMParser()
//         let doc = domParser.parseFromString(htmlTxt, 'text/html')
//         var feedUrl = doc.querySelector('link[type="application/rss+xml"]').href


//     }).catch(() => console.error('Error in fetching the website'))

// })

// const feedUrl = 'https://medium.com/feed/@jonjamesit'
// fetch(feedUrl).then((res) => {
//     res.text().then((xmlTxt) => {
//         var domParser = new DOMParser()
//         let doc = domParser.parseFromString(xmlTxt, 'text/xml')
//         doc.querySelectorAll('item').forEach((item) => {
//             let h1 = document.createElement('h1')
//             h1.textContent = item.querySelector('title').textContent
//             document.querySelector('output').appendChild(h1)
//         })
//     })
// })