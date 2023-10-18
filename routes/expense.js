const express = require("express")

const router = express.Router();

const expenseController = require("../controllers/expense");

const userAuthentication = require("../middlewares/auth").authentication;

router.post("", userAuthentication, expenseController.addExpense);

router.get("", userAuthentication, expenseController.getExpense);

router.delete("/:id", userAuthentication, expenseController.deleteExpense);

module.exports = router;