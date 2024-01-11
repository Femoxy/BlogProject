const express = require('express')

require('./config/config')
require('dotenv').config()
const userRouter = require("./routers/router")

const app = express();

const port = process.env.port

app.use(express.json());
app.get('/api/v1', (req, res) => {
    res.send("Welcome to Authentication World")
});

app.use("/api/v1", userRouter)

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})
