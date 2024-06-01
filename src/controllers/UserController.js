const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');

const {
	User,
} = require('../models')

exports.me = async (req, res) => {
  const user = req.user;
  const data = await User.findOne({_id: mongoose.Types.ObjectId(user._id)})
  try {
    return res.status(200).json({ success: true, data: data });
  } catch (err) {
  }

};

exports.updateUser = async (req, res) => {
    const { fullName, username, password } = req.body;
    const userId = req.user._id;
  
    try {
      let updateFields = { fullName, username };
  
      if (password) {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updateFields.password = hashedPassword;
      }
  
      const updatedUser = await User.updateOne(
        { _id: userId },
        updateFields
      );
  
      if (updatedUser.nModified === 1) {
        const user = await User.findOne({ _id: userId });
        return res.status(200).json({ success: true, data: user });
      } else {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };