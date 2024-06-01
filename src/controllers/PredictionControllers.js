const axios = require("axios");
const FormData = require("form-data");
const { User, Result, DataUser } = require("../models");

exports.prediction = async (req, res) => {
  const { height, weight, age, insulin, glucose } = req.body;
  const user = req.user;
  const heightInMeter = Number(height) ? Number(height) / 100 : 1;
  const bmi = Number(weight) / (heightInMeter * heightInMeter);
  const form = new FormData();
  form.append("Glucose Level", glucose);
  form.append("Insulin", insulin);
  form.append("BMI", bmi);
  form.append("Age", age);

  const apiResponse = await axios.post(
    "https://dimasfrmnsyah-ppl-prediction.hf.space/predict",
    form,
    {
      headers: {
        ...form.getHeaders(),
      },
    }
  );
  const dataUser = new DataUser({
    user_id: user._id,
    bmi: bmi,
    age: age,
    weight: weight,
    height: height,
    insulin: insulin,
    glucose: glucose,
  });

  const savedDataUser = await dataUser.save();

  const newResult = new Result({
    data_user_id: savedDataUser._id,
    predictionNumber: apiResponse.data.score,
    predictionMessage: apiResponse.data.prediction,
  });
  await newResult.save();

  try {
    return res
      .status(200)
      .json({
        sucess: true,
        data: { dataPrediksi: dataUser, hasilPrediksi: apiResponse.data },
      });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};
