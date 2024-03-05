const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema(
{
    name: {
    type: String,
    required: true,
    },
    description: {
    type: String,
    required: true,
    },
    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    },
    favoritedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Plant', plantSchema)
