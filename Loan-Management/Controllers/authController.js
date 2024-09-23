const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');

const loginUser = async(req,res)=>{
  try{
  const {email,password} = req.body;
  if(!email && !password){
    return res.status(400).json({message:'Please provide email and password'})
  }
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).json({message:'Invalid email or password'})
  }
  const isPasswordMatch = await bcrypt.compare(password,user.password);
  if(!isPasswordMatch){
    return res.satus(400).json({message:'Invalid email or password'})
  }
    req.user = user;
     const token = jwt.sign({_id:savedUser._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.cookie('token',token,{httpOnly:true,secure:true,sameSite:'strict'})
    res.status(200).json({message:'Login successful',user})
    //res.status(200).redirect('/dashboard')
  }catch(err){
    console.log(e)
    res.statu(500).json({message:'Internal server error'})
  }
}

const registerUser = async(req,res)=>{
  try{
    const {name,email,password,phoneNumber} = req.body;
    if(!name || !email || !password || !phoneNumber){
      return res.status(400).json({message:'Please provide all the fields'})
    }
    if(!validator.isEmail(email)){
      return res.status(400).json({message:'Please provide a valid email'})
    }
    if(password.length < 8){
      return res.status(400).json({message:'Password must be at least 8 characters long'})
    }
    const user = await User.findOne({email});
    if(user){
      return res.status(400).json({message:'Email already exists'})
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({name,email,password:hashedPassword,phoneNumber});
    const savedUser = await newUser.save();
    req.user = savedUser;
    const token = jwt.sign({_id:savedUser._id},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.cookie('token',token,{httpOnly:true,secure:true,sameSite:'strict'})
    res.status(201).json({message:'User registered successfully',token})
    console.log(savedUser)
   // res.status(200).redirect('/dashboard')
  }catch(err){
    console.log(err)
    res.status(500).json({message:'Internal server error'})
  }
}

const logoutUser = (req,res)=>{
  res.clearCookie('token');
  res.status(200).json({message:'User logged out successfully'})
 // res.status(200).redirect('/login')
}

module.exports = {loginUser,registerUser,logoutUser}