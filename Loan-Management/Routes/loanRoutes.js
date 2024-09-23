const express = require("express");
const loanRouter = express.Router();
const userAccessAuth = require("../MiddleWares/userAccessAuth");
const {
        applyForLoan,
        userGetApprovedLoans,
        userGetPendingLoans,
        userGetRejectedLoans,
        repayLoan,
} = require("../Controllers/loanController");

loanRouter.post("/apply", userAccessAuth, applyForLoan);
loanRouter.get(
        "/borrower/approvedLoans/:userId",
        userAccessAuth,
        userGetApprovedLoans,
);
loanRouter.get(
        "/borrower/pendingLoans/:userId",
        userAccessAuth,
        userGetPendingLoans,
);
loanRouter.get(
        "/borrower/rejectedLoans/:userId",
        userAccessAuth,
        userGetRejectedLoans,
);
loanRouter.post("/repay/loan/:loanId", userAccessAuth, repayLoan);

module.exports = loanRouter;
