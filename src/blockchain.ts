import hexToBinary from "hex-to-binary";
import Block, { createHash, getGenesisBlock } from "./blockBasis";
import { isChainValid, isBlockValid } from "./blockValid";

let blockchain: Block[] = [getGenesisBlock()];

export const getBlockchain = () => blockchain;
const setBlockchain = (chain: Block[]): void => {
  blockchain = chain;
};
export const getNewestBlock = (): Block => blockchain[blockchain.length - 1];
const getTimeStamp = (): number => new Date().getTime() / 1000;

// 새로운 블록 만들기
export const createNewBlock = (data: string): Block => {
  const previousBlock = getNewestBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimeStamp = getTimeStamp();
  const newBlock = findBlock(
    newBlockIndex,
    previousBlock.hash,
    newTimeStamp,
    data,
    5
  );
  addBlockToChain(newBlock);
  return newBlock;
};

const findBlock = (
  index: number,
  previousHash: string,
  timestamp: number,
  data: string,
  difficulty: number
) => {
  let nonce = 0;
  while (true) {
    const hash = createHash(
      index,
      previousHash,
      timestamp,
      data,
      difficulty,
      nonce
    );
    if (hashMatchedDifficulty(hash, difficulty)) {
      return new Block(
        index,
        hash,
        previousHash,
        timestamp,
        data,
        difficulty,
        nonce
      );
    }
    nonce++;
  }
};

const hashMatchedDifficulty = (hash: string, difficulty: number): boolean => {
  const hashInBinary = hexToBinary(hash);
  const requiredZeros = "0".repeat(difficulty);
  console.log("Try difficulty:" + difficulty, "with hash:" + hashInBinary);
  return hashInBinary.startsWith(requiredZeros);
};

// 체인 교체
export const replaceChain = (newChain: Block[]): boolean => {
  if (isChainValid(newChain) && newChain.length > getBlockchain().length) {
    setBlockchain(newChain);
    return true;
  } else {
    return false;
  }
};

// 블록추가
export const addBlockToChain = (candidateBlock: Block): boolean => {
  if (isBlockValid(candidateBlock, getNewestBlock())) {
    setBlockchain([...getBlockchain(), candidateBlock]);
    return true;
  } else {
    return false;
  }
};
