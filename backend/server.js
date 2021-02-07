const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors());

const helloRouter = require('./routes/hello.js');
app.use('/api/hello', helloRouter);

/* Route the frontend */
const path = require('path')
app.use(express.static(path.join(__dirname, '../frontend/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '../frontend/build/index.html'))
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
