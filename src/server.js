const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const UploadImage = require('./models/upload')

const app = express()

app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'ejs')

const MONGO_URL = 'mongodb://127.0.0.1:27017/imagesDB'
mongoose.connect(MONGO_URL).then( console.log('База данных подключена'))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + '-' + Date.now())
    }
}) 

const upload = multer({storage: storage})

app.get('/', (req, res) => {
    res.render('uploadImage')
})

app.get('/upload-ok', (req, res) => {
    UploadImage.find({}).then((data, error) => {
        console.log('data ======', data)

        if(error) {
            throw error
        }

        res.render('files', {items: data})
    })   
})

app.post('/', upload.single('image'), (req, res, next) => {
    const obj = {
        nameFile: req.body.nameFile,
        description: req.body.description,
        image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    UploadImage.create(obj).then(() => {
        res.redirect('/upload-ok')
    })

})


const PORT = 3000
app.listen(PORT, error => {
    if(error) {
        throw error
    }

    console.log(`Сервер запущен на порту ${PORT}`)
})