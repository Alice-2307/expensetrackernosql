const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadFileSchema = new Schema({
    fileUrl: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: Date
})

module.exports = mongoose.model('File', downloadFileSchema);

