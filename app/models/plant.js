const mongoose = require('mongoose')

const plantSchema = new mongoose.Schema(
{
    id: {type: String},
    similar: [ Array ]
},
{
    timestamps: true,
}
);

module.exports = mongoose.model('Plant', plantSchema)
