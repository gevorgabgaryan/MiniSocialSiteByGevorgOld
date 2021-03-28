const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const SALT_ROUNDS = 12;
let Schema=mongoose.Schema

const UserSchema=new Schema({
   username:{
       type:String,
       required:true,
       min:6,
       trim:true,
   },
   email:{
    type:String,
    required:true,
    min:6,
    trim:true,
    email:true,
    lowercase:true,
    unique:true
    },
    password:{
         type: String,
         trim: true

     
    },
    image:{
                type:String,
                default:"/default_profile.png"
    },
  
   firstname:{
    type:String,
  },
  lastname:{
     type:String,
     trim:true,
  },
  workplace:{
     type:String,
     trim:true, 
  }, 
  education:{
     type:String,
     trim:true, 
  }, 
  city:{
     type:String,
     trim:true, 
  }, 
  phone:{
     type:String,
     trim:true, 
  },
  messages: [{
             type: Schema.Types.ObjectId, 
             ref: 'user',
         }],
   friends: [{ type: Schema.Types.ObjectId, 
                 ref: 'user'
          }],
         
   friendRequest: [{
                 type: Schema.Types.ObjectId, 
                 ref: 'user'
   }],
   status:{
      online:{
         type:Boolean,
         default:false
      },
      socketId:{
         type:String,
       }
   },  
   
   adminRole:{
      type:String,
      default:"user"
   },

  
},{timestamps:true})


UserSchema.pre("save", async function(next){
     const user=this

     if(!user.isModified("password")) return next()
   try{
       console.time("hash")
     let hash=await  bcrypt.hash(user.password, SALT_ROUNDS)
     console.log(hash)
     user.password=hash
     console.timeEnd("hash")
     return next()


        }catch(err){
            return   next(err)
        }
}) 

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
      return await bcrypt.compare(candidate, this.password);
 };
    


const UserModel=mongoose.model("user", UserSchema)

async function getAllUsers() {
    return UserModel.find({}).sort({ createdAt: -1 });
  }
  
  async function getOneUser(UserId) {
    return UserModel.findOne({ _id: UserId });
  }
  
  async function createUser(data) {
    const user = new UserModel(data);
    return user.save();
  }
  
  async function updateUser(UserId, data) {
    const user = await getOne(UserId);
  
    if (!user) throw new Error('Could not find the requested User');
  
    Object.keys(data).forEach((key) => {
      user[key] = data[key];
    });
    return user.save();
  }
  
  async function removeUser(query) {
    const result = await UserModel.remove(query);
    return result.result.n;
  }
  
  module.exports = {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    removeUser,
    UserModel
  };
  