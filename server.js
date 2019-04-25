const express = require('express')
const server = express()
const path = require('path')

const home = path.join(__dirname, '/public/index.html')

server.use(express.static('public'))

server.listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
})

// route for single page app
server.get('/*', (req, res) => {
    res.sendFile(home, (err) => {
        if (err) res.status(500).send(err)
    })
})

server.get('*',function(req,res){
    res.sendFile(home, (err) => {
        if (err) res.status(500).send(err)
    })
})