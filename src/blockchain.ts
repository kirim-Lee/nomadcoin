import Block, { getNewestBlock, getBlockchain, setBlockchain } from './blockBasis';
import { isChainValid, isBlockValid } from './blockValid';
import findBlock from './blockFind';
import { getTimeStamp } from './utils';

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
  const newDifficulty = sumDifficulty(newChain);
  const previousDifficulty = sumDifficulty(getBlockchain());
  if (
    isChainValid(newChain) &&
    (newDifficulty > previousDifficulty ||
      (newDifficulty === previousDifficulty && newChain.length > getBlockchain().length))
  ) {
    setBlockchain(newChain);
    return true;
  } else {
    return false;
  }
};

// 난이도 체크
const sumDifficulty = (chain: Block[]): number =>
  chain
    .map(block => block.difficulty)
    .map(difficulty => Math.pow(difficulty, 2))
    .reduce((sum, pow) => sum + pow, 0);

// 블록추가
export const addBlockToChain = (candidateBlock: Block): boolean => {
  if (isBlockValid(candidateBlock, getNewestBlock())) {
    setBlockchain([...getBlockchain(), candidateBlock]);
    return true;
  } else {
    return false;
  }
};
