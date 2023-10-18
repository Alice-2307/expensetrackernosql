const Sib = require("sib-api-v3-sdk");

const forgotPassword = require("../models/password");

const userModel = require("../models/user");

const bcrypt = require("bcrypt");

exports.forgotPasswordRequest = async (req, res, next) => {
    try {
        const email = req.body.email;

        const checkUser = await userModel.findOne({ email: email });

        if (checkUser) {

            const forgot = new forgotPassword({isActive: true, userId: checkUser._id});
            const result = await forgot.save();

            const client = Sib.ApiClient.instance;

            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.EMAIL_API_KEY

            const transEmailApi = new Sib.TransactionalEmailsApi()

            const sender = {
                email: 'expensetracker@gmail.com'
            }

            const receivers = [
                {
                    email: email
                }
            ]
            const message = await transEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Forget Password',
                htmlContent: `<h3>Click the below link to change your password</h3><a href="http://localhost:3000/resetpassword/${result._id}">Reset password link</a>`,
            })
            console.log(message);
            res.status(201).json({ message: 'Mail successfully sent ', success: true })

        } else {
            res.status(404).json({ Error: "Email does not exist" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: "An error occurred" });
    }

}

exports.resetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;

        const forgot = await forgotPassword.findById(id)

        if (forgot.isActive === true) {

            await forgot.updateOne({ isActive: false });

            res.status(200).send(`<html><form action="/updatepassword/${id}" method="get"><label><for="newpassword">Enter New password</label><input type="password" name="newpassword" required><button>reset password</button></form></html>`
            )
        }
        else {
            res.status(500).send(`<html><h2>Link is expired</h2></html>`)
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: "An error occurred" });
    }
}

exports.updatePassword = async (req, res, next) => {

    try {

        const newPassword = req.query.newpassword;
        const resetPasswordId = req.params.resetpasswordid;

        const check = await forgotPassword.findById(resetPasswordId)

        let changePassword = await userModel.findOne({ _id: check.userId });

        let hashPassword = await bcrypt.hash(newPassword, 10)

        await changePassword.updateOne({ password: hashPassword });

        console.log("Password Change Succesfully")
        res.status(201).send(`<html><h2>Successfully update the password</h2></html>`);

    } catch (err) {
        console.log(err);
        res.status(403).json({ Error: "An error occurred" })
    }
}