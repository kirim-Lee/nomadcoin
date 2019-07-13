import express = require("express");
import bodyParser = require("body-parser");
import morgan = require("morgan");
// import { getBlockchain, createNewBlock } from "./blockchain";

const PORT = 3300;

const app = express();
app.use(bodyParser.json());
app.use(morgan("combined"));
app.listen(PORT, () => console.log(`Nomadcoin server running on ${PORT}`));
