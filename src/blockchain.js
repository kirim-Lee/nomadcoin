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

// 새로운 블록 만들기
const createNewBlock = data => {
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimeStamp = getTimeStamp();
}