import CryptoJS = require('crypto-js');

class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public timestamp: number;
  public data: string;
  public difficulty: number;
  public nonce: number;
  constructor(
    index: number,
    hash: string,
    previousHash: string,
    timestamp: number,
    data: string,
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

const genesisBlock = new Block(
  0,
  '54757EFC4548C8AB98AD9F6169FFFD5283F5047E2A4B87A23AA90AF3EB793009',
  null,
  1563237431,
  'this is the genesis',
  0,
  0
);

export const getGenesisBlock = () => genesisBlock;

export const createHash = (
  index: number,
  previousHash: string,
  timestamp: number,
  data: string,
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

export default Block;
