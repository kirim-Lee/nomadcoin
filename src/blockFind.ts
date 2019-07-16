import hexToBinary from 'hex-to-binary';
import Block, { getNewestBlock, getBlockchain, createHash } from './blockBasis';

const BLOCK_GENERATION_INTERVAL = 10;
const DIFFICULTY_ADJUSTMENT_INTERVAL = 10;
const findDifficulty = (): number => {
  const newestBlock = getNewestBlock();
  if (newestBlock.index % DIFFICULTY_ADJUSTMENT_INTERVAL === 0 && newestBlock.index !== 0) {
    return calculateNewDifficulty(newestBlock, getBlockchain());
  } else {
    return newestBlock.difficulty;
  }
};
const calculateNewDifficulty = (newestBlock: Block, blockchain: Block[]): number => {
  const lastCalculatedBlock: Block = blockchain[blockchain.length - DIFFICULTY_ADJUSTMENT_INTERVAL];
  const timeExpected = BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL;
  const timeTaken = newestBlock.timestamp - lastCalculatedBlock.timestamp;
  if (timeTaken < timeExpected / 2) {
    return lastCalculatedBlock.difficulty + 1;
  } else if (timeTaken > timeExpected * 2) {
    return lastCalculatedBlock.difficulty - 1;
  } else {
    return lastCalculatedBlock.difficulty;
  }
};

const hashMatchedDifficulty = (hash: string, difficulty: number): boolean => {
  const hashInBinary = hexToBinary(hash);
  const requiredZeros = '0'.repeat(difficulty);
  console.log('Try difficulty:' + difficulty, 'with hash:' + hashInBinary);
  return hashInBinary.startsWith(requiredZeros);
};

const findBlock = (index: number, previousHash: string, timestamp: number, data: string) => {
  let nonce = 0;
  const difficulty = findDifficulty();
  while (true) {
    const hash = createHash(index, previousHash, timestamp, data, difficulty, nonce);
    if (hashMatchedDifficulty(hash, difficulty)) {
      return new Block(index, hash, previousHash, timestamp, data, difficulty, nonce);
    }
    nonce++;
  }
};

export default findBlock;
