import Block, { createHash, getGenesisBlock } from "./blockBasis";
import { isChainValid, isNewBlockValid } from "./blockValid";

let blockchain: Block[] = [getGenesisBlock()];

const getBlockchain = () => blockchain;
const setBlockchain = (chain: Block[]): void => {
  blockchain = chain;
};
const getLastBlock = (): Block => blockchain[blockchain.length - 1];
const getTimeStamp = (): number => new Date().getTime() / 1000;

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
