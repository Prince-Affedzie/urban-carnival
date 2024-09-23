const mongoose = require('mongoose');
const { Duplex } = require('stream');
const Schema = mongoose.Schema;
const loanSchema = new Schema({
  borrower:{
   type:Schema.Types.ObjectId,
    ref:'User'
  },
  
  loanAmount:{
    type:Number,
    required:true
  },
  interestRate:{
    type:Number,
    required:true
  },
 durationMonths:{
   type:Number,
     required:true
 },
  status:{
    type:String,
    enum:['pending','approved','rejected'],
    default:'pending'
  },
  approvedBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  approvedDate:{
    type:Date,
    default:Date.now
  },
  repaymentSchedule:{
    type:Schema.Types.ObjectId,
    ref:'RepaymentSchedule',
    required:true
  },
  createdDate:{
    type:Date,
    default:Date.now
  }
    
})

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;