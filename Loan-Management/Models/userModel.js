const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  phoneNumber:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:['admin','user'],
    default:'user',
    required:true
  },
  loan:{
    type:Schema.Types.ObjectId,
    ref:'loan'
  }
});

const User = mongoose.model('user', userSchema);
module.exports = User
 