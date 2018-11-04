const mongoose = require('mongoose');

const Schema  = mongoose.Schema;

const PartSchema = new Schema ({
    numberofpart : {
        type: Number
    },
    TimeStamp : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PartHistory',PartSchema,'Part_History');