import Block, { getNewestBlock, getBlockchain, setBlockchain } from './blockBasis';
import { isChainValid, isBlockValid } from './blockValid';
import findBlock from './blockFind';

const getTimeStamp = (): number => new Date().getTime() / 1000;

// 새로운 블록 만들기
export const createNewBlock = (data: string): Block => {
  const previousBlock = getNewestBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimeStamp = getTimeStamp();
  const newBlock = findBlock(newBlockIndex, previousBlock.hash, newTimeStamp, data);
  addBlockToChain(newBlock);
  return newBlock;
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
