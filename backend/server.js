const express = require('express')

const app = express()

/* The api/backend route */
app.get('/api/hello/', async (req, res, next) => {
  try {
    res.json({ text: 'Hello from the API!' })
  } catch (err) {
    next(err)
  }
})

/* The client/frontend route */
const path = require('path')
app.use(express.static(path.join(__dirname, '../frontend/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../frontend/build/index.html'))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})