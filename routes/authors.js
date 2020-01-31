const express = require('express')
const router = express.Router()
const Author = require('../models/author')

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
      //res.redirect(`authors/${newAuthor.id}`)
       res.redirect('authors')
    } catch(error) {
        res.render ('authors/new', {
           author: author,
           errorMessage : 'Error bij aanmeken author'
        })
    }
    //manier zonder async/await
   //  author.save((err, newAuthor) =>{
   //     if (err) {
   //        // op deze manier zodat ede oorspronkelijk ingegeven waarde opnieuw verschijnt
   //        res.render ('authors/new', {
   //           author: author,
   //           errorMessage : 'Error bij aanmeken author'
   //        })
   //     } else {
   //        //res.redirect(`authors/${newAuthor.id}`)
   //        res.redirect('authors')
   //     }
   //  })
})


module.exports = router