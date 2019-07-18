import CryptoJS from 'crypto-js';
import { TxOut, TxIn, Transaction, UTxOut } from './txBasis';

export const getTxId = (tx: Transaction): string => {
  const txInContent: string = tx.txIns.map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex).reduce((a, b) => a + b, '');

  const txOutContent: string = tx.txOuts
    .map((txOut: TxOut) => txOut.address + txOut.amount)
    .reduce((a, b) => a + b, '');

  return CryptoJS.SHA256(txInContent + txOutContent).toString();
};

export const findUTxOut = (txOutId: string, txOutIndex: number, uTxOutList: UTxOut[]): UTxOut | undefined =>
  uTxOutList.find(uTxOut => uTxOut.txOutId === txOutId && uTxOut.txOutIndex === txOutIndex);
