const mongoose = require('mongoose')

const UploadSchema = new mongoose.Schema({
    nameFile: String,
    description: String,
    image: {
        data: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model('UploadImage', UploadSchema)