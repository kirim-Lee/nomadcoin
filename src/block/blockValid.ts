import Block, { getBlocksHash, getGenesisBlock } from './blockBasis';
import { getTimeStamp } from '../utils/common';

// 블록체인구조 검증
const isBlockStructureValid = (block: Block): boolean => {
  return (
    typeof block.index === 'number' &&
    typeof block.hash === 'string' &&
    typeof block.previousHash === 'string' &&
    typeof block.timestamp === 'number' &&
    typeof block.data === 'string' // TODO : data will be json
  );
};

// 최초블록 검증
const isGenesisValid = (block: Block): boolean => {
  return JSON.stringify(block) === JSON.stringify(getGenesisBlock());
};

// 각블록검증
const isEachChainValid = (chain: Block[]): boolean => {
  for (let i = 1; i < chain.length; i++) {
    if (!isBlockValid(chain[i], chain[i - 1])) {
      return false;
    }
  }
  return true;
};

// 블록체인 검증
const isBlockValid = (candidateBlock: Block, latestBlock: Block): boolean => {
  if (!isBlockStructureValid(candidateBlock)) {
    console.log('the candidate block structure is not valid');
    return false;
  } else if (latestBlock.index + 1 !== candidateBlock.index) {
    console.log('The candidate block doesn`t have a valid index');
    return false;
  } else if (latestBlock.hash !== candidateBlock.previousHash) {
    console.log('The previousHash of the candidate block is not the hash of the latest block');
    return false;
  } else if (getBlocksHash(candidateBlock) !== candidateBlock.hash) {
    console.log('the hash of this block is invalid');
    return false;
  } else if (!isTimeStampValid(candidateBlock, latestBlock)) {
    console.log('tthe timestamp of this block is dodgy');
    return false;
  }
  return true;
};

// 체인 검증
const isChainValid = (candidateChain: Block[]): boolean => {
  if (!isGenesisValid(candidateChain[0])) {
    console.log('the candidate chains`s genesis block is not the same as our genesis block');
    return false;
  } else if (!isEachChainValid(candidateChain)) {
    console.log('each chain are not valid');
    return false;
  }
  return true;
};

// 타임 검증 : 이전 블록 현재 블록 사이에 1분 이상 차이, 현재 시간과 현재블록 시간 사이에 1분이상 차이가 나면 true
const isTimeStampValid = (newBlock: Block, oldBlock: Block): boolean =>
  oldBlock.timestamp - 60 < newBlock.timestamp && newBlock.timestamp - 60 < getTimeStamp();

export { isBlockValid, isChainValid, isBlockStructureValid };
