const express = require('express')
const Article = require('./../models/blog')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('blog/new', { blog: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const blog = await Article.findById(req.params.id)
  res.render('blog/edit', { blog: blog })
})

router.get('/:slug', async (req, res) => {
  const blog = await Article.findOne({ slug: req.params.slug })
  if (blog == null) res.redirect('/')
  res.render('blog/show', { blog: blog })
})

router.post('/', async (req, res, next) => {
  req.blog = new Article()
  next()
}, saveArticleAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
  req.blog = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let blog = req.blog
    blog.title = req.body.title
    blog.author = req.body.author
    blog.description = req.body.description
    blog.markdown = req.body.markdown
    try {
      blog = await blog.save()
      res.redirect(`/blog/${blog.slug}`)
    } catch (e) {
      res.render(`blog/${path}`, { blog: blog })
    }
  }
}

module.exports = router 