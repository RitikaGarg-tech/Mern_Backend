require('dotenv').config()

const express = require('express')

const mongoose = require('mongoose')

const eventRoutes = require('./backend_/routes/events')
const userRoutes = require('./backend_/routes/user')
const registrationRoutes = require('./backend_/routes/registrations')
const adminRoutes = require('./backend_/routes/admin')
const { application } = require('express')
const cors = require('cors');

const app = express()

app.use(express.json())
app.use(cors());
// app.use((req, res, next) => {
//     console.log(req.path,req.method,req.params)
//     next()
// })

app.use('/api/events',eventRoutes)

app.use('/api/user',userRoutes)
app.use('/api/admin',adminRoutes)

app.use('/api/registrations',registrationRoutes)

mongoose.connect(process.env.MONGO_UI).then(()=>{
    app.listen(process.env.PORT, () => {
        console.log('connected to db and listening on port ',process.env.PORT)
    })
})
.catch((error) => {
    console.log(error)
})


