import { Transaction, UTxOut } from '../tx/txBasis';
import { validateTxPool } from './memPoolValid';
import { getMemPool, addMemPool } from './memPoolBasis';

export const addToMemPool = (tx: Transaction, uTxOutList: UTxOut[]) => {
  if (!validateTxPool(tx, getMemPool(), uTxOutList)) {
    return null;
  }
  addMemPool(tx);
};
