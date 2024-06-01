const mongoose = require('mongoose')

const { Schema } = mongoose

const ModelSchema = Schema(
	{
	user_id: { type: Schema.Types.ObjectId, ref: 'User' },
	bmi: { type: Number },
    age: { type: Number },
    weight: { type: Number },
    height: { type: Number }, // general, shipper, transporter
    insulin: { type: Number },
    glucose: { type: Number },
	},
	{
		timestamps: true,
	},
)

module.exports = mongoose.model('DataUser', ModelSchema)
