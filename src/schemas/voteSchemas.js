import mongoose from "mongoose";


const voteSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    choiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Choice' },
});

const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;