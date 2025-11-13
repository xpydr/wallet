
const express = require('express');
const cors = require('cors');
const {body, param, query, validationResult} = require('express-validator');

const ethers = require('ethers');
const dotenv = require('dotenv');

dotenv.config();
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3000;

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.listen(port, () => {console.log(`Server running on port ${port}`)});

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${apiKey}`);

const validate = (req, res, next) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
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
      res.status(201).json({message: "Balance fetched successfully.", balance: ethers.formatEther(balance)});
    } catch (err) {
      res.status(500).json({message: err.message});
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
      const response = await provider.broadcastTransaction(req.body.txSigned);
      res.status(201).json({message: "Balance fetched successfully.", hash: response.hash});
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  }
);
