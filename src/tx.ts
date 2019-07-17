import CryptoJS from 'crypto-js';
import { ec as EC } from 'elliptic';
import { toHexString } from './utils';
import { Transaction, TxIn, TxOut, UTxOut, getUTxOut } from './txBasis';

const ec = new EC('secp256k1');

const getTxId = (tx: Transaction): string => {
  const txInContent: string = tx.txIns.map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex).reduce((a, b) => a + b, '');

  const txOutContent: string = tx.txOuts
    .map((txOut: TxOut) => txOut.address + txOut.amount)
    .reduce((a, b) => a + b, '');

  return CryptoJS.SHA256(txInContent + txOutContent).toString();
};

const findUTxOut = (txOutId: string, txOutIndex: number, uTxOutList: UTxOut[]): UTxOut | undefined =>
  uTxOutList.find(uTxOut => uTxOut.txOutId === txOutId && uTxOut.txOutIndex === txOutIndex);

const signTxIn = (tx: Transaction, txInIndex: number, privateKey: string): string => {
  const txIn: TxIn = tx.txIns[txInIndex];
  const dataToSign = tx.id;
  const referencedUTxOut = findUTxOut(txIn.txOutId, txIn.txOutIndex, getUTxOut());
  if (referencedUTxOut === undefined) {
    return;
  }
  const key = ec.keyFromPrivate(privateKey, 'hex');
  const signature = toHexString(key.sign(dataToSign).toDER()).toString();
  return signature;
};

const updateUTxOuts = (newTxs: Transaction[], uTxOutList: UTxOut[]) => {
  const newUTxOuts: UTxOut[] = newTxs
    .map(tx => tx.txOuts.map((txOut, index) => new UTxOut(tx.id, index, txOut.address, txOut.amount)))
    .flat();
  // .reduce((a, b) => a.concat(b), []);

  const spentTxOuts = newTxs
    .map(tx => tx.txIns)
    .flat()
    .map(txIn => new UTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));

  const resultingUTxOuts = uTxOutList
    .filter(uTxOut => !findUTxOut(uTxOut.txOutId, uTxOut.txOutIndex, spentTxOuts))
    .concat(newUTxOuts);
};
