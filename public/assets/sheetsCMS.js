/**
 * CMS - Blog
 */

const apikey = 'AIzaSyDLgbHuIKYEhhDoVz9pdwkU4LgqNGMQT3A'
const sheetid = '17mMZ4fb-IpTDbqoTxdjF_EeRpnoJuef58yMHIQI9Ri4'
const base = 'https://sheets.googleapis.com/v4/spreadsheets/'
// sheets
let sheetPosts = 'CMS!'
let sheetPages = 'pages!'
// column letters
let titles = 'A'
let urls = 'B'
let tags = 'C'
let dates = 'D'
let contents = 'E'
let postlastEdit = 'F'
// details 
let firstContentRow = 4
let totalColumns = 6
//special queries
let lastEdit = sheetPosts + 'B1'
let lastEditPages = sheetPages + 'B1'

// parsers
let getAllPosts = (column, row) => sheetPosts + column + row + ':' + column
let getPost = (column, row) => sheetPosts + column + row
let getPage = (column, row) => sheetPages + column + row

// pre-built queries
const queries = {
    titles: getPost(titles, firstContentRow),
    links: getPost(urls, firstContentRow),
    tags: getPost(tags, firstContentRow),
    dates: getPost(dates, firstContentRow),
    contents: getPost(contents, firstContentRow),
    routes: [
        getPost(titles, firstContentRow),
        getPost(urls, firstContentRow),
        lastEdit
    ],
    posts: [
        getPost(titles, firstContentRow),
        getPost(urls, firstContentRow),
        getPost(dates, firstContentRow),
        getPost(contents, firstContentRow),
        getPost(postlastEdit, firstContentRow),
    ],
    pages: [
        getPage(titles, firstContentRow),
        getPage(urls, firstContentRow),
        getPage(contents, firstContentRow),  
    ]
}

const buildQuery = (query) => new Promise((resolve, reject) => {
    if (!query) {
        reject('404')
    }
    else if (Array.isArray(query)) {
        console.log('building batch query')
        let ranges = ''
        query.map((range, index) => (index === 0) ? ranges += 'ranges=' + range : ranges += '&ranges=' + range)
        let url = base + sheetid + '/values:batchGet?' + ranges + '&key=' + apikey
        console.log(url)
        resolve(url)
    }
    else {
        console.log('building single query')
        let url = base + sheetid + '/values/' + query + '?key=' + apikey
        console.log(url)
        resolve(url)
    }
})

const getQuery = async (url) => new Promise((resolve, reject) => {
    fetch(url)
        .then(response => response.json())
        .then(query => resolve(query))
        .catch(err => reject(err))
})

const parseQuery = async (query) => new Promise((resolve, reject) => {
    let result = {}
    if (typeof query !== 'object') {
        console.log('query not object')
        reject('404')
    }
    else if (query.valueRanges) {
        if (query.valueRanges.length === 4) {
            result.title = query.valueRanges[0].values[0][0]
            result.date = query.valueRanges[1].values[0][0]
            result.post = query.valueRanges[2].values[0][0]
            result.lastEdit = query.valueRanges[3].values[0][0]
            resolve(result) // post
        } 
        else if (query.valueRanges.length === 4) {
            result.title = query.valueRanges[0].values[0][0]
            result.page = query.valueRanges[2].values[0][0]
            result.lastEdit = query.valueRanges[3].values[0][0]
            resolve(result) // page
        }
        else if (query.valueRanges.length === 3) {
            result.titles = query.valueRanges[0].values
            result.links = query.valueRanges[1].values
            result.lastEdit = query.valueRanges[2].values[0][0]
            resolve(result) // routes

        } 
        else if (query.valueRanges.length === totalColumns) {
            result.titles = query.valueRanges[0].values
            result.links = query.valueRanges[1].values
            result.tags = query.valueRanges[2].values
            result.dates = query.valueRanges[3].values
            result.content = query.valueRanges[4].values
            result.lastEdit = query.valueRanges[5].values[0][0]
            resolve(result) // all posts
        } 
        else {
            console.log('query incorrect length')
            reject('404')
        }
    }
    else if (query.values) {
        result.post = query.values
        resolve(result)
    }
})