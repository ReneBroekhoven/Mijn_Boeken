if (process.env.NODE_ENV !== 'production') {
   require('dotenv').config()
 }

const express = require('express')
const app = express()
const expressLayouts =  require('express-ejs-layouts')
var bodyParser = require('body-parser')
const methodOverride = require('method-override')

// met een relative path
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

// de views folder is voor de server
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
// soort standaard html voor all de views
app.set('layout', 'layouts/layout.ejs' )
//dit gebruikt de <body> element (zie layout.ejs) van hetgeen je in de route opgeeft
app.use(expressLayouts)
app.use(methodOverride('_method'))

// zit er tegenwoordige standaard in !!
app.use(express.json())
app.use(express.urlencoded({extended: false}))
//app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser : true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => { console.error(error)})
db.once('open', () => console.log('Database is open'))

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

// waar de public files zullen zijn html en css files en is voor de client
// is hier eigenlijk niet nodig
// omdat ie NA de routes komt wordt ie bij de homepage url niet eens geraakt
// als deze boven de routes had gestaan dan zou de test html page zijn weergegeven
app.use(express.static('public'))

app.listen(process.env.PORT || 3000)


