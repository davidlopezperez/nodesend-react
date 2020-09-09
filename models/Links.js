const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LinksSchema = new Schema({

    url: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    filename_original:{
        type: String,
        required: true
    },
    dowmloads: {
        type: Number,
        default: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    created_dated: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('Links', LinksSchema);