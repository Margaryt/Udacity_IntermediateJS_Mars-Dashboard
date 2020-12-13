require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))
    
// API calls


app.get(`/photos`, async (req, res) => {  
    try {
        var data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.query.rover}/photos?sol=1000&api_key=${process.env.API_KEY}`)
        .then(res => res.json())
        res.send({ data })
    } catch (err) {
        console.log('error:', err);
    }
})

app.get(`/info`, async(req, res) => {
    try{
        var info = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${req.query.rover}?api_key=${process.env.API_KEY}`)
        .then(res => res.json())
        res.send({ info })
    } catch (err) {
        console.log("error", err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))