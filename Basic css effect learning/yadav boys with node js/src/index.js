const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const path = require('path')
// const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT

const publicDir = path.join(__dirname,'../public')
app.set('view engine', 'hbs');

// app.use(bodyParser.json())
app.use(express.static(publicDir))
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

