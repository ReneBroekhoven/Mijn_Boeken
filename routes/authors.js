const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// All the authors
router.get('/', async (req, res ) => {
   //res.send('Hello Wordl')
   let searchOptions = {}
   // met een querystring en geen POST in the body
   if (req.query.name != null && req.query.name !== '') {
      searchOptions.name = new RegExp(req.query.name, 'i')
      //console.log(searchOptions.name)
   }
   try {
      const authors  = await Author.find(searchOptions)
      res.render('authors/index', {
         authors: authors, 
         searchOptions: req.query
      })
   } catch {
      res.redirect('/')
   }
   //await res.render('authors/index') // is de index.ejs file
})

// New author ?? maar deze maakt de nieuwe author niet ??
router.get('/new', (req, res ) => {
   res.render('authors/new', {author: new Author()}) 
})

// Creating New author ; is de ontvangende route van de form in new
 router.post('/', async (req, res ) => {
    const author = new Author({
       name: req.body.name
    })
    try {
       const newAuthor = await author.save()
       res.redirect(`authors/${newAuthor.id}`)
       //res.redirect('authors')
    } catch(error) {
        res.render ('authors/new', {
           author: author,
           errorMessage : 'Error bij aanmeken author'
        })
    }

})


// een browser kan alleen een get of post request doen dus : 
// heb je een method nodig in een package : method-override 
// deze vult de post aan met een extra header dat het eigenlijk een put of delete is
// gebruik NOOIT een get link voor een delete, omdat google searchengine naar alle get's in je code kjkt en dar presneteert als een zoekresultaat: zo kan alles maar gedelete worden


// deze route moet Na de /new omdat ie anders kan denken dat new een is is
router.get('/:id', async (req, res) =>{
   try{
      const author = await Author.findById(req.params.id)
      const books = await Book.find({author: author.id}).limit(6).exec()
      res.render('authors/show', { 
        author: author,
        booksByAuthor : books
      })
   }catch(error){
      //console.log(error)
      res.redirect('/')
   }
})

router.get('/:id/edit', async (req, res) => {
   try{
      const author = await Author.findById(req.params.id)
      res.render('authors/edit', {author: author})
   }catch{
      res.redirect('/authors')
   }
   
})

// update gebruik je put
router.put('/:id', async (req, res) => {
   let author // omdat catch hem ook nodig kan hebben
   try {
    author = await Author.findById(req.params.id)
    author.name = req.body.name
    await author.save()
    res.redirect(`/authors/${author.id}`)
   } catch(error) {
      if(author == null){
         res.redirect('/')
      }else {
       res.render ('authors/edit', {
          author: author,
          errorMessage : 'Error updating author'
       })
      } 
   }
})

router.delete('/:id', async (req, res) => {
   let author // omdat catch hem ook nodig kan hebben
   try {
    author = await Author.findById(req.params.id)
    await author.remove()
    res.redirect('/authors')
   } catch(error) {
      if(author == null){
         res.redirect('/')
      }else {
       res.redirect(`authors/${author.id}`)
      } 
   }
})

module.exports = router