const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static(__dirname + "/html"));


app.get('/', (req, res) => {
  res.send('Hello')
})
/*
app.get('/login', (req, res) => {
  res.send('Login')
})

app.get('/signup', (req, res) => {
  res.send('Signup')
})
*/
 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})