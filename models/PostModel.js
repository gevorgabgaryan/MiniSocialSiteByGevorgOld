const mongoose=require("mongoose")

let Schema=mongoose.Schema
const PostSchema=new Schema({
    post:{
        type: String,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId, 
        ref: 'user',
    }
} ,{timestamps:true})

    module.exports=mongoose.model("Post",PostSchema)