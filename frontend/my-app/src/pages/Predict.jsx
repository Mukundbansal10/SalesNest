// frontend/src/pages/Predict.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Predict = () => {
  const [prediction, setPrediction] = useState(null);

  const handlePredict = async () => {
    const res = await axios.post("http://localhost:5000/api/predict", {
      data1: 123,
      data2: 456
    });
    setPrediction(res.data.prediction);
  };

  return (
    <div className="p-4">
      <button onClick={handlePredict} className="bg-blue-500 text-white p-2 rounded">Predict Sales</button>
      {prediction && <p className="mt-4">Prediction: {prediction}</p>}
    </div>
  );
};

export default Predict;
