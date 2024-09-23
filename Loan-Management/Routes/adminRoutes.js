const express = require("express");
const adminRoutes = express.Router();
const adminAccesAuth = require("../MiddleWares/adminAccessAuth");
const {
       updateLoan,
       approveLoan,
       rejectLoan,
       getBorrowerLoans,
       ApprovedLoans,
       pendingLoans,
       rejectedLoans,
       repaidLoans,
       getTotalAmountOnLoan,
} = require("../Controllers/loanController");

adminRoutes.post("/updateLoan", adminAccesAuth, updateLoan);
adminRoutes.post("/approveLoan", adminAccesAuth, approveLoan);
adminRoutes.post("/rejectLoan", adminAccesAuth, rejectLoan);
adminRoutes.get("/getBorrowerLoans", adminAccesAuth, getBorrowerLoans);
adminRoutes.get("/getApprovedLoans", adminAccesAuth, ApprovedLoans);
adminRoutes.get("/pendingLoans", adminAccesAuth, pendingLoans);
adminRoutes.get("/rejectedLoans", adminAccesAuth, rejectedLoans);
adminRoutes.get("/repaidLoans", adminAccesAuth, repaidLoans);
adminRoutes.get("/total/loansgivenout", adminAccesAuth, getTotalAmountOnLoan);

module.exports = adminRoutes;
