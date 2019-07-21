import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { getBlockchain } from './block/blockBasis';
import { startP2PServer, connectToPeers } from './p2p';
import { createNewBlockWithBroadCast } from './p2p/p2pMessage';
import { initWallet, getAccountBalance } from './wallet';
import './utils/extensions'; // Array.prototype extension
import { sendTx } from './block';

const PORT = process.env.HTTP_PORT || 3300;

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));

app
  .route('/blocks')
  .get((_req: Request, res: Response) => {
    res.send(getBlockchain());
  })
  .post((req: Request, res: Response) => {
    const newBlock = createNewBlockWithBroadCast();
    res.send(newBlock);
  });

app.post('/peers', (req: Request, res: Response) => {
  const { peer } = req.body;
  connectToPeers(peer);
  res.send('success');
});

app.get('/me/balance', (req: Request, res: Response) => {
  const balance = getAccountBalance();
  res.send({ balance });
});

app
  .route('/transactions')
  .get((req: Request, res: Response) => {})
  .post((req: Request, res: Response) => {
    //try {
    const { address, amount } = req.body;
    if (address === undefined || amount === undefined) {
      throw Error('please specify address and amount');
    } else {
      const tx = sendTx(address, amount);
      res.send(tx);
    }
    //} catch (err) {
    //res.status(400).send(err.message);
    //}
  });

const server = app.listen(PORT, () => console.log(`Nomadcoin HTTP server running on ${PORT}`));

initWallet();
startP2PServer(server);
