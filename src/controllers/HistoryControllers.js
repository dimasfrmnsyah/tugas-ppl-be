const { DataUser } = require("../models");
const mongoose = require('mongoose');

exports.history = async (req, res) => {
  const { page, limit } = req.query;
  const user = req.user;
  const data = await DataUser.aggregate([
    {
      $match: {
        user_id: mongoose.Types.ObjectId(user._id)
      },
    },
    {
      $lookup: {
        from: "results",
        localField: "_id",
        foreignField: "data_user_id",
        as: "history",
      },
    },
    { $unwind: '$history' },
    {
      $addFields: {
        predictionNumber: '$history.predictionNumber',
        predictionMessage: '$history.predictionMessage',
      }
    },
    {
      $project: {
        _id: 1,
        user_id: 1,
        bmi: 1,
        age: 1,
        weight: 1,
        height: 1,
        insulin: 1,
        glucose: 1,
        createdAt: 1,
        updatedAt: 1,
        predictionNumber: 1,
        predictionMessage: 1,
      }
    }
  ]);
  try {
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
	const { id } = req.params
  const user = req.user;
  const data = await DataUser.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(id)
      },
    },
    {
      $lookup: {
        from: "results",
        localField: "_id",
        foreignField: "data_user_id",
        as: "history",
      },
    },
    { $unwind: '$history' },
    {
      $addFields: {
        predictionNumber: '$history.predictionNumber',
        predictionMessage: '$history.predictionMessage',
      }
    },
    {
      $project: {
        _id: 1,
        user_id: 1,
        bmi: 1,
        age: 1,
        weight: 1,
        height: 1,
        insulin: 1,
        glucose: 1,
        createdAt: 1,
        updatedAt: 1,
        predictionNumber: 1,
        predictionMessage: 1,
      }
    },
  ]);
  try {
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};


exports.historyTesting = async (req, res) => {
  const { page, limit, dateFrom, dateTo } = req.query;
  const user = req.user;

  // Convert dateFrom and dateTo to Date objects
  const dateFromObj = dateFrom ? new Date(dateFrom) : null;
  const dateToObj = dateTo ? new Date(dateTo) : null;

  const matchStage = {
    user_id: mongoose.Types.ObjectId(user._id),
  };

  if (dateFromObj && dateToObj) {
    matchStage['historyCreatedAt'] = { $gte: dateFromObj, $lte: dateToObj };
  } else {
    matchStage['_id'] = {$exists:true}
  }

  const data = await DataUser.aggregate([
    {
      $lookup: {
        from: "results",
        localField: "_id",
        foreignField: "data_user_id",
        as: "history",
      },
    },
    { $unwind: '$history' },
   
    {
      $addFields: {
        predictionNumber: '$history.predictionNumber',
        predictionMessage: '$history.predictionMessage',
      }
    },
    {
      $project: {
        _id: 1,
        user_id: 1,
        bmi: 1,
        age: 1,
        weight: 1,
        height: 1,
        insulin: 1,
        glucose: 1,
        createdAt: 1,
        updatedAt: 1,
        predictionNumber: 1,
        predictionMessage: 1,
        historyCreatedAt:'$history.createdAt'
      }
    },
    {
      $match: matchStage,
    },
  ]);

  try {
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
