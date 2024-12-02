const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({

    author:{
        type:String,
        required:true,
    },
    content:{
        
        image:{
            type:String,
            default:""
        },
        text:{
            type:String,
            default:''
        }
    },
    caption:{
        type:String,
        default:''
    },
    likes:{
        type:Map,
        of:String,
        default: ()=> new Map()
    },
    comments:{
        type:Map,
        of:Number,
        default:()=>new Map()
    }
},{
    timestamps:true
})

// That's correct! In MongoDB (using Mongoose), when defining a Map field,
// you only need to specify the value type (e.g., Number for integers) and not the key type.
// In this case, the keys are always treated as strings by default. The value type is specified
// using the of property, but you don't need to explicitly define the type of the key.


module.exports = new mongoose.model('Posts',postSchema)