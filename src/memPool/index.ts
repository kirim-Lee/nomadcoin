import { Transaction, UTxOut, TxIn, getUTxOut } from '../tx/txBasis';
import { validateTxPool } from './memPoolValid';
import { getMemPool, addMemPool, setMemPool } from './memPoolBasis';

export const addToMemPool = (tx: Transaction, uTxOutList: UTxOut[]) => {
  if (!validateTxPool(tx, getMemPool(), uTxOutList)) {
    return null;
  }
  addMemPool(tx);
};

const hasTxIn = (txIn: TxIn, uTxOutList: UTxOut[]): boolean =>
  uTxOutList.some(uTxOut => uTxOut.txOutId === txIn.txOutId && uTxOut.txOutIndex === txIn.txOutIndex);

export const updateMemPool = (uTxOutList: UTxOut[]): Transaction[] => {
  console.log('uTxOutList:', uTxOutList);
  console.log('getMemPool:', getMemPool()[0] && getMemPool()[0].txIns);
  const filtered = getMemPool().filter(tx => !tx.txIns.some(txIn => hasTxIn(txIn, uTxOutList)));
  setMemPool(filtered);
  return filtered;
};

export const handleIncomingTx = (tx: Transaction) => {
  addToMemPool(tx, getUTxOut());
};
