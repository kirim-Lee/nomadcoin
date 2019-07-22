import CryptoJS = require('crypto-js');
import { Transaction, setUTxOut } from '../tx/txBasis';
import { processTxs } from '../tx';

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public timestamp: number;
  public data: Transaction[];
  public difficulty: number;
  public nonce: number;
  constructor(
    index: number,
    hash: string,
    previousHash: string,
    timestamp: number,
    data: Transaction[],
    difficulty: number,
    nonce: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }
}

const genesisTx: Transaction = {
  txIns: [{ signature: '', txOutId: '', txOutIndex: 0 }],
  txOuts: [
    {
      address:
        '04cbbfc12cd2224fa0c5845cac10bf4c14d5e4ce1ce51c72ae424b4c2a96f82f7668afe765e5997a65ea271247022d656843ff2f84a3ccd236bceb93508fc11332',
      amount: 50
    }
  ],
  id: '869eff5ec555e6ec629fb00ab73e6a19d93cb09c48bc3bc4f221346f699971da'
};

const genesisBlock = new Block(
  0,
  'aa44a8520ba1e46dd8bcd2e072ed6b2931f17b7c8011ae8f3463360fcc23bf52',
  null,
  1563237431,
  [genesisTx],
  0,
  0
);

export const getGenesisBlock = () => genesisBlock;

export const createHash = (
  index: number,
  previousHash: string,
  timestamp: number,
  data: Transaction[],
  difficulty: number,
  nonce: number
): string => CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data) + difficulty + nonce).toString();

export const getBlocksHash = (block: Block): string =>
  createHash(block.index, block.previousHash, block.timestamp, block.data, block.difficulty, block.nonce);

let blockchain: Block[] = [getGenesisBlock()];

export const getBlockchain = () => blockchain;
export const setBlockchain = (chain: Block[]): void => {
  blockchain = chain;
};
export const getNewestBlock = (): Block => blockchain[blockchain.length - 1];

setUTxOut(processTxs(blockchain[0].data, [], 0));

export default Block;
