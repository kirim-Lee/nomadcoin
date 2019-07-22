import Block, { getNewestBlock, getBlockchain, setBlockchain } from './blockBasis';
import { isChainValid, isBlockValid } from './blockValid';
import findBlock from './blockFind';
import { getTimeStamp } from '../utils/common';
import { createCoinbaseTx, processTxs, createTx } from '../tx';
import { getPublicFromWallet, getPrivateFromWallet } from '../wallet';
import { Transaction, getUTxOut, UTxOut, setUTxOut } from '../tx/txBasis';
import { addToMemPool, updateMemPool } from '../memPool';
import { getMemPool } from '../memPool/memPoolBasis';

export const createNewBlock = () => {
  const coinbaseTx = createCoinbaseTx(getPublicFromWallet(), getNewestBlock().index + 1);
  const blockData = [coinbaseTx].concat(getMemPool());
  return createNewRawBlock(blockData);
};

// 새로운 블록 만들기
const createNewRawBlock = (data: Transaction[]): Block => {
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
    const processedTx: UTxOut[] | null = processTxs(candidateBlock.data, getUTxOut(), candidateBlock.index);
    if (processedTx === null) {
      return false;
    } else {
      setBlockchain([...getBlockchain(), candidateBlock]);
      updateMemPool(getUTxOut());
      setUTxOut(processedTx);
    }
    return true;
  } else {
    return false;
  }
};

export const sendTx = (address: string, amount: number) => {
  const tx = createTx(address, amount, getPrivateFromWallet(), getUTxOut(), getMemPool());
  addToMemPool(tx, getUTxOut());
  return tx;
};
