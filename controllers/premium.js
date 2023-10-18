const userModel = require("../models/user");

const S3Service = require("../services/s3service");

const downloadFile = require("../models/file");
const Expense = require("../models/expense");

exports.showLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await userModel.find()
        .select('name totalExpense -_id')
        .sort({totalExpense: -1})
        res.status(201).json({ leaderboard, isPremium: req.user.isPremium });

    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: "An error occurred" })
    }
}

exports.downloadFile = async (req, res, next) => {

    try {

        if (req.user.isPremium === true) {
            const expense = await Expense.find({userId: req.user._id})
            .select('description amount category -_id')
            const stringifiedExpenses = JSON.stringify(expense);
            const userId = req.user._id;
            const fileName = `Expense${userId}/${new Date()}.txt`;
            const fileUrl = await S3Service.uploadtoS3(stringifiedExpenses, fileName);
            const result = new downloadFile({fileUrl: fileUrl, createdAt: new Date(), userId: userId})
            await result.save()
            res.status(200).json({ fileUrl, success: true, isPremium: req.user.isPremium });
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ Error: "An error occurred" })
    }
}

exports.downloadOldFile = async (req, res, next) => {

    try {
        const allFile = await downloadFile.find({userId: req.user._id})
        .select('fileUrl createdAt -_id');
        res.status(200).json({ allFile, success: true, isPremium: req.user.isPremium });

    } catch (err) {
        console.log(err)
        res.status(500).json({ Error: "An error occurred" })
    }
}


