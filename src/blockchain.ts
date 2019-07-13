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

const getBlocksHash = (block: Block): string =>
  createHash(block.index, block.previousHash, block.timestamp, block.data);

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

// 블록체인 검증
const isNewBlockValid = (
  candidateBlock: Block,
  latestBlock: Block
): boolean => {
  if (!isNewStructureValid(candidateBlock)) {
    console.log("the candidate block structure is not valid");
    return false;
  } else if (latestBlock.index + 1 !== candidateBlock.index) {
    console.log("The candidate block doesn`t have a valid index");
    return false;
  } else if (latestBlock.hash !== candidateBlock.previousHash) {
    console.log(
      "The previousHash of the candidate block is not the hash of the latest block"
    );
    return false;
  } else if (getBlocksHash(candidateBlock) !== candidateBlock.hash) {
    console.log("the hash of this block is invalid");
    return false;
  }
  return true;
};

// 블록체인구조 검증
const isNewStructureValid = (block: Block): boolean => {
  return (
    typeof block.index === "number" &&
    typeof block.hash === "string" &&
    typeof block.previousHash === "string" &&
    typeof block.timestamp === "number" &&
    typeof block.data === "string" // TODO : data will be json
  );
};

// 최초블록 검증
const isGenesisValid = (block: Block): boolean => {
  return JSON.stringify(block) === JSON.stringify(genesisBlock);
};

// 각블록검증
const isEachChainValid = (chain: Block[]): boolean => {
  for (let i = 1; i < chain.length; i++) {
    if (!isNewBlockValid(chain[i], chain[i - 1])) {
      return false;
    }
  }
  return true;
};

// 체인 검증
const isChainValid = (candidateChain: Block[]): boolean => {
  if (!isGenesisValid(candidateChain[0])) {
    console.log(
      "the candidate chains`s genesis block is not the same as our genesis block"
    );
    return false;
  } else if (!isEachChainValid(candidateChain)) {
    console.log("each chain are not valid");
    return false;
  }
  return true;
};
