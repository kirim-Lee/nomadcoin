import { Block, getBlocksHash, genesisBlock } from "./blockchain";

// 블록체인 검증
export const isNewBlockValid = (
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
export const isChainValid = (candidateChain: Block[]): boolean => {
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
