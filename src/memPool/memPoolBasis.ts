import { Transaction } from '../tx/txBasis';

let memPool: Transaction[] = [];

export const getMemPool = () => memPool;
export const addMemPool = (tx: Transaction) => memPool.push(tx);
