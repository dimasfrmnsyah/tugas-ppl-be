const mongoose = require('mongoose')

const { Schema } = mongoose

const ModelSchema = Schema(
	{
	data_user_id: { type: Schema.Types.ObjectId, ref: 'DataUser' },
    predictionMessage: { type: String },
    predictionNumber: { type: String },
	},
	{
		timestamps: true,
	},
)

module.exports = mongoose.model('Result', ModelSchema)
