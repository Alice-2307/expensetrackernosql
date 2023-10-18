const mongoose = require('mongoose');
const Expense = require("../models/expense");
const User = require("../models/user");

exports.addExpense = async (req, res, next) => {
    let s;
    try {
        const desc = req.body.description;
        const amount = req.body.amount;
        const category = req.body.category

        s = await mongoose.startSession()
        s.startTransaction();

        const expense = new Expense({ description: desc, amount: amount, category: category, userId: req.user._id })
        const result = await expense.save({ session: s })
        let totEx = req.user.totalExpense;
        totEx += parseInt(amount);
        await User.updateOne({ _id: req.user._id }, { totalExpense: totEx }, { session: s })
        await s.commitTransaction();
        s.endSession();
        console.log("Expense Added")
        res.status(201).json({ expenseData: result })

    } catch (err) {
        await s.abortTransaction()
        showError(err, res);
    }
}

exports.getExpense = async (req, res, next) => {
    try {
        const ITEMS_PER_PAGE = +req.query.item || 5;
        const page = +req.query.page || 1;
        const count = await Expense.countDocuments({ userId: req.user._id });
        const allExpenseData = await Expense.find({ userId: req.user._id })
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)

        let lastPage;
        if (Math.ceil(count / ITEMS_PER_PAGE) == 0) {
            lastPage = 1;
        }
        else {
            lastPage = Math.ceil(count / ITEMS_PER_PAGE)
        }
        res.status(200).json({
            allExpense: allExpenseData,
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < count,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: lastPage,
            isPremium: req.user.isPremium
        })

    } catch (err) {
        showError(err, res);
    }
}

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        await Expense.findByIdAndRemove(expenseId);
        console.log("Delete Successfully");
    } catch (err) {
        showError(err, res);
    }
}

function showError(err, res) {
    console.log(err);
    res.status(500).json({ Error: "An error occurred" })
}