const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true
    },
    isPremium: {
        type: Boolean
    },
    totalExpense: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema);

