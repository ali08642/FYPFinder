const BlogPost = require('../models/BlogPost')

const getPosts = async (req, res) => {
  const posts = await BlogPost.find().populate('author', 'name').sort({ createdAt: -1 })
  res.json(posts)
}

const createPost = async (req, res) => {
  const post = await BlogPost.create({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id
  })
  res.status(201).json(post)
}

const deletePost = async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id)
  res.json({ message: 'Post deleted' })
}

module.exports = { getPosts, createPost, deletePost }