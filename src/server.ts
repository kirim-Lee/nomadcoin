import './utils/extensions'; // Array.prototype extension
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import Block, { getBlockchain } from './block/blockBasis';
import { startP2PServer, connectToPeers } from './p2p';
import { createNewBlockWithBroadCast } from './p2p/p2pMessage';
import { initWallet, getAccountBalance, getPublicFromWallet, getBalance } from './wallet';
import { sendTx } from './block';
import { getMemPool } from './memPool/memPoolBasis';
import { Transaction, getUTxOut } from './tx/txBasis';

const PORT = process.env.HTTP_PORT || 3300;

const app = express();
app.use(bodyParser.json());
app.use(cors());
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

app.get('/me/address', (req: Request, res: Response) => {
  res.send(getPublicFromWallet());
});

app.get('/blocks/:hash', (req: Request, res: Response) => {
  const {
    params: { hash }
  } = req;
  const block = getBlockchain().find((block: Block) => block.hash === hash);
  if (block === undefined) {
    res.status(400).send('block not found');
  } else {
    res.send(block);
  }
});

app
  .route('/transactions')
  .get((req: Request, res: Response) => {
    res.send(getMemPool());
  })
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

app.get('/transactions/:id', (req: Request, res: Response) => {
  const {
    params: { id }
  } = req;
  const tx = getBlockchain()
    .map((block: Block): Transaction[] => block.data)
    .flat()
    .find((tx: Transaction): boolean => tx.id === id);
  if (tx === undefined) {
    res.status(400).send('tx not found');
  } else {
    res.send(tx);
  }
});

app.get('/balance/:address', (req: Request, res: Response) => {
  const {
    params: { address }
  } = req;
  const balance = getBalance(address, getUTxOut());
  res.send({ balance });
});

// const server = app.listen(PORT, () => console.log(`Nomadcoin HTTP server running on ${PORT}`));

initWallet();

export default { app, startP2PServer };
// startP2PServer(server);
