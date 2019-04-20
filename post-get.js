// const fetch = require('node-fetch');

// function bodyParse (body) {
//     document.body.getElementbyId()
// }

// fetch('https://docs.google.com/document/d/e/2PACX-1vRVEKTAjqZiiRc5-OHQ_JfXmfxC1k2YIMcFxImsYQQF50Y45s9dulKCGi2u6TsYEVykx3zjTU-qKNAp/pub')
//     .then(res => res.text())
//     .then(body => bodyParse(body));

// I. post published
//II. generate html/js
//III. trigger site 'build'



//requiring path and fs modules
const path = require('path')
const fs = require('fs')
const showdown = require('showdown')
const converter = new showdown.Converter()


const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}


const directoryPath = path.join(__dirname, 'public/posts')

function createPost(title, content) {
    fs.readdir(directoryPath, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err)
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file)
            fs.readFile(path.join(__dirname, 'public/posts', file), 'utf8', function (err, contents) {
                let postHTML = converter.makeHtml(contents)
                console.log(postHTML)
                let post = {
                    title: title,
                    link: title.split(" ").join("-").toLowerCase(),
                    content: postHTML
                }
                const postPath = path.join(__dirname, 'public/posts/posts.json')
                fs.writeFileSync(postPath, JSON.stringify(post))
            })
        })
    })
}

function createRoute (title) {
    //title = key 
    //post url = value
    //add to routes
}