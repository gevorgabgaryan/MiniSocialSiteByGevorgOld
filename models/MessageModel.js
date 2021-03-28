const mongoose=require("mongoose")

let Schema=mongoose.Schema
const MessageSchema=new Schema({
    text:{
        type: String,
        required: true
    },
    attach:{
       type:"String"
    },
    from:{
        type: Schema.Types.ObjectId, 
        ref: 'user',
    },
    to:{
        type: Schema.Types.ObjectId, 
        ref: 'user',
    }
} ,{timestamps:true})

const MessageModel=mongoose.model("Message",MessageSchema)

async function getAllMessages() {
    return MessageModel.find({}).sort({ createdAt: -1 });
  }
  
  async function getOneMessage(messageId) {
    return MessageModel.findOne({ _id: messageId });
  }
  
  async function createMessage(data) {
    const message = new MessageModel(data);
    return message.save();
  }
  
  async function updateMessage(messageId, data) {
    const message = await getOne(messageId);
  
    if (!message) throw new Error('Could not find the requested message');
  
    Object.keys(data).forEach((key) => {
      message[key] = data[key];
    });
    return message.save();
  }
  
  async function removeMessage(query) {
    const result = await MessageModel.remove(query);
    return result.result.n;
  }
  
  module.exports = {
    getAllMessages,
    getOneMessage,
    createMessage,
    updateMessage,
    removeMessage,
    MessageModel
  };
  