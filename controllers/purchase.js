const Razorpay = require("razorpay");

const Purchase = require("../models/purchase");
const User = require("../models/user");

exports.purchasePremium = async (req, res, next) => {
    try {
        const amount = 249900;
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const order = await rzp.orders.create({ amount, currency: "INR" })
        const purchase = new Purchase({orderId: order.id, status: "PENDING", userId: req.user._id})
        await purchase.save();
        res.status(201).json({ order, key_id: rzp.key_id })
    } catch (err) {
        console.log(err);
        res.status(403).json({ Error: "An error occurresd" });
    }
}

exports.updateTransaction = async (req, res, next) => {
    try {
        const paymentId = req.body.payment_id;
        const orderId = req.body.order_id;

        const order = await Purchase.findOne({orderId: orderId})
        if (paymentId !== null) {
            await Promise.all([
                order.updateOne({paymentId: paymentId, status: "successful" }),
                User.updateOne({_id: req.user._id}, { isPremium: true })
            ]);
            res.status(201).json({ success: true, message: "Transaction Successful" });
        } else {
            await Promise.all([
                order.updateOne({ status: "failed" }),
                User.updateOne({_id: req.user._id}, { isPremium: false })
            ]);
            res.status(202).json({ success: false, message: "Transaction failed" });
        }
    } catch (err) {
        console.log(err);
        res.status(403).json({ Error: "An error occurred" })
    }
}

