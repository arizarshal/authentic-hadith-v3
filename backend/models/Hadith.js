const mongoose = require('mongoose');

const HadithSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "A name is required"],
        trim: true,
    },
    referenceNo : {
        type: String,
        required: [true, "A reference number is required"],
        unique: true
    },
    title: {
        type: String,
        required: [true, "A title is required"],
        unique: false,
        trim: true
    },
    hadith: {
        type: String,
        required: [true, "A hadith is required"],
        trim: true
    }  
})

module.exports = mongoose.model('Hadith', HadithSchema )
