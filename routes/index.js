const express = require('express')
const router = express.Router()

router.get('/', (req, res ) => {
   //res.send('Hello Wordl')
   res.render('index') // is de index.ejs file
})

module.exports = router
