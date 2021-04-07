const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/blog')
const articleRouter = require('./routes/blog')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/express-blog', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
    const blog = await Article.find().sort({ createdAt: 'desc' })
    res.render('blog/index', { blog: blog })

})

app.use('/blog', articleRouter)

app.listen(5000)