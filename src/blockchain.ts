import CryptoJS from "crypto-js";
import { isChainValid, isNewBlockValid } from "./blockValid";

export class Block {
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

export const genesisBlock = new Block(
  0,
  "54757EFC4548C8AB98AD9F6169FFFD5283F5047E2A4B87A23AA90AF3EB793009",
  null,
  1563024230793,
  "this is the genesis"
);

let blockchain: Block[] = [genesisBlock];

const getLastBlock = (): Block => blockchain[blockchain.length - 1];
const getTimeStamp = (): number => new Date().getTime() / 1000;
const createHash = (
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

const getBlockchain = () => blockchain;
const setBlockchain = (chain: Block[]): void => {
  blockchain = chain;
};

// 새로운 블록 만들기
const createNewBlock = (data: string): Block => {
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimeStamp = getTimeStamp();
  const newHash = createHash(
    newBlockIndex,
    previousBlock.hash,
    newTimeStamp,
    data
  );
  return new Block(
    newBlockIndex,
    newHash,
    previousBlock.hash,
    newTimeStamp,
    data
  );
};

// 체인 교체
const replaceChain = (newChain: Block[]): boolean => {
  if (isChainValid(newChain) && newChain.length > getBlockchain().length) {
    setBlockchain(newChain);
    return true;
  } else {
    return false;
  }
};

// 블록추가
const addBlockToChain = (candidateBlock: Block): boolean => {
  if (isNewBlockValid(candidateBlock, getLastBlock())) {
    setBlockchain([...getBlockchain(), candidateBlock]);
    return true;
  } else {
    return false;
  }
};
