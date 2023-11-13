const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    Pan_No: {
        type: String,
        min: 10,
        required: true,
        trim: true
    },
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Mobile_no: {
        type: String,
        min: 10,
        max : 10,
        required: true,
        trim: true,
    },
    DOB: {
        type: String,
        required: true,
        trim: true,
        default : Date.now()
    },
    Unit: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps : true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task