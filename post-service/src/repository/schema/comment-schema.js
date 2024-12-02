const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
   
    author:{
        type:String,
        required:true
    },
    postID:{
        type:mongoose.Schema.ObjectId,
        ref:"Posts",
        required:true
    },
    comment:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})


module.exports = new mongoose.model('Comments',commentSchema)