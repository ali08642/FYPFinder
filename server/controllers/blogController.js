const BlogPost = require('../models/BlogPost')

const getPosts = async (req, res) => {
  const posts = await BlogPost.find().populate('author', 'name role').sort({ createdAt: -1 })
  res.json(posts)
}

const createPost = async (req, res) => {
  const { title, content, tag } = req.body
  if (!title || !content || !tag) {
    return res.status(400).json({ message: 'title, content, and tag are required' })
  }

  const post = await BlogPost.create({
    title,
    content,
    tag,
    author: req.user._id,
    likes: 0,
    likedBy: [],
    comments: []
  })
  res.status(201).json(post)
}

// POST /api/blog/:id/like — toggle like
const toggleLike = async (req, res) => {
  const post = await BlogPost.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found' })

  const userId = req.user._id.toString()
  const likedIndex = post.likedBy.findIndex((id) => id.toString() === userId)

  if (likedIndex >= 0) {
    post.likedBy.splice(likedIndex, 1)
  } else {
    post.likedBy.push(req.user._id)
  }

  post.likes = post.likedBy.length
  const updated = await post.save()
  const populated = await updated.populate('author', 'name role')
  res.json(populated)
}

// POST /api/blog/:id/comment
const addComment = async (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ message: 'text is required' })

  const post = await BlogPost.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found' })

  post.comments.unshift({
    user: req.user._id,
    name: req.user.name,
    text,
    createdAt: new Date()
  })

  const updated = await post.save()
  const populated = await updated.populate('author', 'name role')
  res.json(populated)
}

const deletePost = async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id)
  res.json({ message: 'Post deleted' })
}

module.exports = { getPosts, createPost, toggleLike, addComment, deletePost }