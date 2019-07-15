import WebSockets from "ws";
import {
  getNewestBlock,
  getBlockchain,
  replaceChain,
  addBlockToChain,
  createNewBlock
} from "./blockchain";
import { isBlockStructureValid } from "./blockValid";
import Block from "./blockBasis";
import { getSockets } from "./p2pBasis";

// message types
const GET_LATEST = "GET_LATEST";
const GET_ALL = "GET_ALL";
const BLOCKCHAIN_RESPONSE = "BLOCKCHAIN_RESPONSE";

// message creators
export const getLatest = (): IMessage => ({ type: GET_LATEST, data: null });
export const getAll = (): IMessage => ({ type: GET_ALL, data: null });
export const blockchainResponse = (data: any): IMessage => ({
  type: BLOCKCHAIN_RESPONSE,
  data
});

const parseData = (data: any): any => {
  try {
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const sendMessage = (ws: WebSockets, message: IMessage): void =>
  ws.send(JSON.stringify(message));

const sendMessageToAll = (message: IMessage): void =>
  getSockets().forEach((ws): void => sendMessage(ws, message));

export const broadcastNewBlock = () => sendMessageToAll(responseLatest());

export const createNewBlockWithBroadCast = (data: string): Block => {
  const newBlock = createNewBlock(data);
  if (newBlock) {
    broadcastNewBlock();
  }
  return newBlock;
};

export const handleSocketMessages = (ws: WebSockets, data: any) => {
  const message: IMessage | null = parseData(data);
  if (message === null) {
    return;
  }
  console.log(message);
  switch (message.type) {
    case GET_LATEST:
      sendMessage(ws, responseLatest());
      break;
    case GET_ALL:
      sendMessage(ws, responseAll());
      break;
    case BLOCKCHAIN_RESPONSE:
      const receiveBlocks = message.data;
      if (receiveBlocks !== null) {
        handleBlockchainResponse(receiveBlocks);
      }
      break;
  }
};

const handleBlockchainResponse = (receiveBlocks: Block[]) => {
  if (receiveBlocks.length === 0) {
    console.log("received blocks have a length of 0");
    return;
  }
  const latestBlockReceived = receiveBlocks[receiveBlocks.length - 1];
  if (!isBlockStructureValid(latestBlockReceived)) {
    console.log("the block structure of the block received is not valid");
    return;
  }
  const newestBlock = getNewestBlock();
  if (latestBlockReceived.index > newestBlock.index) {
    // 한개 앞서 있다면 하나 추가
    if (newestBlock.hash === latestBlockReceived.previousHash) {
      if (addBlockToChain(latestBlockReceived)) {
        broadcastNewBlock();
      }
    }
    // 교체를 하기에 앞서 재귀 (모든 블록을 요청)
    else if (receiveBlocks.length === 1) {
      sendMessageToAll(getAll());
    }
    // 둘 이상 앞서 있다면 교체
    else {
      replaceChain(receiveBlocks);
    }
  }
};

const responseLatest = (): IMessage => blockchainResponse([getNewestBlock()]);
const responseAll = (): IMessage => blockchainResponse(getBlockchain());
