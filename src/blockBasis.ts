import CryptoJS from "crypto-js";

class Block {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: string;
  constructor(
    index: number,
    hash: string,
    previousHash: string,
    timestamp: number,
    data: string
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}

const genesisBlock = new Block(
  0,
  "54757EFC4548C8AB98AD9F6169FFFD5283F5047E2A4B87A23AA90AF3EB793009",
  null,
  1563024230793,
  "this is the genesis"
);

export const getGenesisBlock = () => genesisBlock;

export const createHash = (
  index: number,
  previousHash: string,
  timestamp: number,
  data: string
): string =>
  CryptoJS.SHA256(
    index + previousHash + timestamp + JSON.stringify(data)
  ).toString();

export const getBlocksHash = (block: Block): string =>
  createHash(block.index, block.previousHash, block.timestamp, block.data);

export default Block;
