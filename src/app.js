const path = require('path')
const express = require('express');
const hbs = require('hbs');
const { title } = require('process');

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const port = process.env.PORT || 3000;

// Define paths for Expres config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup Handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Setup Static directory to serve
app.use(express.static(publicDirectoryPath))


// app.get('', (req, res)=>{
//     res.send("Hello Express")
// })

app.get('', (req, res)=>{
    res.render('index', {
        title: 'Weather App',
        name: 'Andrew Mead'
    })
})

app.get('/about', (req, res)=>{
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Mead'
    })
})

app.get('/help', (req, res)=>{
    res.render('help', {
        title: 'Help Page',
        message: 'This is a help message',
        name: 'Andrew Mead'
    })
})

// app.get('/help', (req, res)=>{
//     res.send("Help Page!")
// })

// app.get('/about', (req, res)=>{
//     res.send("<h1>About Page!</h1>")
// })

// app.get('/weather', (req, res)=>{
//     res.send({
//         location: 'Philadelphia',
//         forecast: 50
//     })
// })

app.get('/weather', (req, res)=>{
    if(!req.query.address){
        return res.send({
            error: 'You must provide an Address'
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {})=>{
        if(error){
            res.send({
                error: error
            })
        }else{
            forecast(latitude, longitude, (error, forecastData) => {
                if(error){
                    res.send({
                        error: error
                    })
                }else{
                    res.send({
                        location: location,
                        forecast: forecastData,
                        address: req.query.address
                    })
                }
                
            })
        }
    })
})

app.get('/products', (req, res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res)=>{
    res.render('error', {
        errorMessage: 'Help Article not Found!',
        title: 'Article Error',
        name: 'Andrew Mead'
    })
})

app.get('*', (req, res)=>{
    res.render('error', {
        errorMessage: 'Page not found',
        title: '404 Error',
        name: 'Andrew Mead'
    })
})

app.listen(port, ()=>{
    console.log(`Server is up on Port ${port} !`)
})