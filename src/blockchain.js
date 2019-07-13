const CryptoJS = require('crypto-js');

class Block {
  constructor(index, hash, previousHash, timestamp, data) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = data;
  }
}

const genesisBlock = new Block(
  0,
  '54757EFC4548C8AB98AD9F6169FFFD5283F5047E2A4B87A23AA90AF3EB793009',
  null,
  '1563024230793',
  'this is the genesis'
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length - 1];
const getTimeStamp = () => new Date().getTime() / 1000;
const createHash = (index, previousHash, timestamp, data) =>
  CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

const getBlocksHash = (block) => createHash(block.index, block.previousHash, block.timestamp, block.data);

// 새로운 블록 만들기
const createNewBlock = data => {
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimeStamp = getTimeStamp();
  const newHash = createHash(newBlockIndex, previousBlock.hash, newTimeStamp, data);
  return new Block(newBlockIndex, newHash, previousBlock.hash, newTimeStamp, data);
}

// 블록체인 검증
const isNewBlockValid = (candidateBlock, latestBlock) => {
  if (latestBlock.index + 1 !== candidateBlock.index) {
    console.log('The candidat block doesn`t have a valid index');
    return false;
  } else if (latestBlock.hash !== candidateBlock.previousHash) {
    console.log('The previousHash of the candidate block is not the hash of the latest block');
    return false;
  } else if (getBlocksHash(candidateBlock) !== candidateBlock.hash) {
    console.log('the hash of this block is invalid');
    return false;
  }
  return true;
}