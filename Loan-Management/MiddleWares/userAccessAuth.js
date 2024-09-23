const jwt = require('jsonwebtoken');

const userAccessAuth = (req, res, next) =>{
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({message:'No token provided'})
  }
  try{
     jwt.verify(token,process.env.JWT_SECRET);
     const user = req.user;
     if(user.role !== 'user'){
      return res.status(401).json({message:'Access denied'})
    }
     next();
  }catch(err){
    res.status(401).json({message:'Invalid token'})
  }
}

module.exports = userAccessAuth;