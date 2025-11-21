
const express = require('express');
const cors = require('cors');
const { body, param, query, validationResult } = require('express-validator');

const ethers = require('ethers');
const dotenv = require('dotenv');

dotenv.config();
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173', // dev
  'https://wallet-client-45bdfca79764.herokuapp.com' // production
];

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.listen(port, () => { console.log(`Server running on port ${port}`) });

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`);

const validate = (req, res, next) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

app.post('/api/v1/get-balance',
  [
    body('address').isString().trim().notEmpty()
  ],
  validate,
  async (req, res) => { // get native balance by address
    try {
      const balance = await provider.getBalance(req.body.address);
      res.status(200).json({ message: "Balance fetched successfully.", balance: ethers.formatEther(balance) });
      console.log(res)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: err.message });
    }
  }
);

app.post('/api/v1/send-tx',
  [
    body('txSigned').isString().trim().notEmpty()
  ],
  validate,
  async (req, res) => { // broadcast signed tx (hex string)
    try {
      const txResponse = await provider.broadcastTransaction(req.body.txSigned);
      if (!txResponse || !txResponse.hash) {
        return res.status(500).json({
          message: "Transaction submission failed: no hash returned"
        });
      }

      res.status(202).json({
        message: "Transaction submission successful",
        hash: txResponse.hash
      });

    } catch (error) {
      console.error("Error broadcasting transaction:", error);
      res.status(500).json({
        message: "Transaction submission failed",
        error: error.message
      });
    }
  }
);

app.post('api/v1/get-tx-data',
  [
    body('address').isString().trim().notEmpty(),
  ],
  validate,
  async (req, res) => {
    try {
      const nonce = await provider.getTransactionCount(req.body.address);
      const feeData = await fetchFeeData();
      res.status(200).json({
        message: "Data retrieval successful",
        nonce,
        feeData,
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message, error: err, nonce: null, feeData: null });
    }
  }
);

async function fetchFeeData() {
  try {
    const feeData = await provider.getFeeData();
    if (!feeData.maxFeePerGas || !feeData.maxPriorityFeePerGas) throw new Error("Error fetching feeData");
    
    feeData.maxFeePerGas = ethers.formatUnits(feeData.maxFeePerGas, "gwei");
    feeData.maxPriorityFeePerGas = ethers.formatUnits(feeData.maxPriorityFeePerGas, "gwei");
    feeData.gasPrice = ethers.formatUnits(feeData.gasPrice, "gwei");

    return feeData;
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message, error: err });
  }
}
