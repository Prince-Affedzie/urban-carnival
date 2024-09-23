const mongoose = require("mongoose");
const Loan = require("../Models/loanModel");
const repayment = require("../Models/repaymentModel");
const User = require("../Models/userModel");

const applyForLoan = async (req, res) => {
  try {
    const { loanAmount, interestRate, durationMonths } = req.body;
    if (!loanAmount || !interestRate || !durationMonths) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }
    const borrower = req.user._id;
    const loan = new Loan({
      borrower,
      loanAmount,
      interestRate,
      durationMonths,
    });
    const savedLoan = await loan.save();
    res.status(201).json({ message: "Loan applied successfully", savedLoan });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    if (!loanId) {
      return res.status(400).json({ message: "Please no loan found " });
    }
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(400).json({ message: "Loan not found" });
    }
    if (loan.status === "approved") {
      return res.status(400).json({ message: "Loan already approved" });
    }
    loan.status = "approved";
    loan.approvedBy = req.user._id;
    loan.approvedDate = Date.now();
    const updatedLoan = await loan.save();
    res
      .status(200)
      .json({ message: "Loan approved successfully", updatedLoan });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(400).json({ message: "Loan not found" });
    }
    if (loan.status === "rejected") {
      return res.status(400).json({ message: "Loan already rejected" });
    }
    loan.status = "rejected";
    loan.approvedBy = req.user._id;
    loan.approvedDate = Date.now();
    const updatedLoan = await loan.save();
    res
      .status(200)
      .json({ message: "Loan rejected successfully", updatedLoan });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateLoan = async (req, res) => {
  const { loanId } = req.params;
  try {
    const { loanAmount, interestRate, durationMonths, status } = req.body;
    const loan = await loan.findByIdAndUpdate(
      loanId,
      { loanAmount, interestRate, durationMonths, status },
      { new: true },
    );
    res.status(200).json({ message: "Loan updated successfully", loan });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const repayLoan = async (req, res) => {
  const { amountpaid, paymentdate } = req.body;
  try {
    const loan = await Loan.findById(req.params.loanId).populate(
      "repaymentSchedule",
    );
    if (!loan) {
      return res.status(400).json({ message: "Loan not found" });
    }
    const nextPayment = loan.repaymentSchedule.find(
      (repayment) => repayment.status === "pending",
    );
    if (!nextPayment) {
      return res.status(400).json({ message: "All payments have been made" });
    }
    if (amountpaid > nextPayment.loanAmount) {
      return res
        .status(400)
        .json({
          message: "Amount paid is greater than the next payment amount",
        });
    }
    nextPayment.amountPaid = amountpaid;
    nextPayment.paymentDate = paymentdate;
    nextPayment.status = "paid";
    await nexPayment.save();
    res.status(200).json({ message: "Payment made successfully", loan });
  } catch (err) {
    console.log(err);
  }
};
// When an admin wants to see a particular user's loan details
const getBorrowerLoans = async (req, res) => {
  try {
    const borrower = await User.findById(req.params.userId).populate("loans");
    if (!borrower) {
      return res.status(400).json({ message: "Borrower not found" });
    }
    res.status(200).json({ message: "Borrower loans", borrower });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//When a user wants to view his or her loans
const viewLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ borrower: req.user.id }).populate(
      "repaymentSchedule",
    );
    res.status(200).json({ message: "All loans", loans });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// when a user wants to see his or her approved loans
const userGetApprovedLoans = async (req, res) => {
  try {
    const loans = await Loan.find({
      status: "approved",
      borrower: req.user.id,
    }).populate("repaymentSchedule");
    res.status(200).json({ message: "All loans", loans });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const showUserAmountPayable = async(req, res)=>{
  try{
    const loans = await Loan.find({
      status: "approved",
      borrower: req.user.id,
    }).populate("repaymentSchedule");
    const totalAmountPayable = loans.reduce((acc, loan) => {
      const nextPayment = loan.repaymentSchedule.find(
        (repayment) => repayment.status === "pending",
      );
      if (nextPayment) {
        acc += nextPayment.loanAmount;
      }
      return acc;
    }, 0);
    res.status(200).json({ message: "All loans", totalAmountPayable });
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}
//When a user wants to see his or her pending loans
const userGetPendingLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "pending", borrower: req.user.id });
    res.status(200).json({ message: "All loans", loans });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
/*When a user wants to see his or her rejected loans*/
const userGetRejectedLoans = async (req, res) => {
  try {
    const loans = await Loan.find({
      status: "rejected",
      borrower: req.user.id,
    });
    res.status(200).json({ message: "All loans", loans });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
//When admin wants to view all approved loans
const ApprovedLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "approved" });
    res.status(200).json({ message: "All approved loans", loans });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// pending loans view for admins only
const pendingLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "pending" });
    res.status(200).json({ message: "All pending loans", loans });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// rejected loans view for admins only
const rejectedLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "rejected" });
    if (!loans) {
      return res.status(400).json({ message: "No Rejected loans found" });
    }
    res.status(200).json({ message: "All rejected loans", loans });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
// When an admin wants to see all paid loans in the system
const repaidLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "paid" })
      .populate("borrower")
      .populate("repaymentSchedule");
    if (!loans) {
      return res.statu(400).json({ message: "No repaid loans found" });
    }
    res.status(200).json({ message: "All repaid loans", loans });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTotalAmountOnLoan = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "approved" });
    let totalAmount = 0;
    for (let i = 0; i < loans.length; i++) {
      totalAmount += loans[i].loanAmount;
    }
    res.status(200).json({ message: "Total amount on loans", totalAmount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTotalIncomeOnInterest = async (req, res) => {
  try {
    const loans = await Loan.find({ status: "approved" });
    let totalAmount = 0;
    for (let i = 0; i < loans.length; i++) {
      const principal = loans[i].loanAmount;
      const interest = loans[i].interestRate;
      const time = loans[i].durationMonths;
      const interestAmount = principal * interest * time;
      totalAmount += interestAmount;
    }
    res.status(200).json({ message: "Total amount on interest", totalAmount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTotalRepaymentAmount = async (req, res) => {
  try {
    const repayments = await repayment.find({ status: "paid" });
    const totalRepaymentAmount = 0;
    for (let i = 0; i < repayments.length; i++) {
      const repaymentAmount = repayments[i].amountPaid;
      totalRepaymentAmount += repaymentAmount;
    }
    res
      .status(200)
      .json({ message: "Total amount on repayments", totalRepaymentAmount });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  applyForLoan,
  approveLoan,
  rejectLoan,
  updateLoan,
  getBorrowerLoans,
  pendingLoans,
  rejectedLoans,
  repaidLoans,
  userGetApprovedLoans,
  userGetPendingLoans,
  userGetRejectedLoans,
  viewLoans,
  repayLoan,
  getTotalAmountOnLoan,
  ApprovedLoans,
  getTotalIncomeOnInterest,
  getTotalRepaymentAmount,
};
