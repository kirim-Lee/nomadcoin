import CryptoJS from 'crypto-js';
import { ec as EC } from 'elliptic';
import { toHexString } from './utils';

const ec = new EC('secp256k1');

class TxOut {
  public address: string;
  public amount: number;
  constructor(address: string, amount: number) {
    this.address = address;
    this.amount = amount;
  }
}

class TxIn {
  public txOutId: string;
  public txOutIndex: number;
  public signature: string[];
  // txOutId
  // txOutIndex
  // signature
}

class Transaction {
  public id: string;
  public txIns: TxIn[];
  public txOuts: TxOut[];
  // ID
  // txIns[]
  // txOuts[]
}

class UTxOut {
  public txOutId: string;
  public txOutIndex: number;
  public address: string;
  public amount: number;
  constructor(txOutId: string, txOutIndex: number, address: string, amount: number) {
    this.txOutId = txOutId;
    this.txOutIndex = txOutIndex;
    this.address = address;
    this.amount = amount;
  }
}

const uTxOuts: UTxOut[] = [];

const getTxId = (tx: Transaction): string => {
  const txInContent: string = tx.txIns.map((txIn: TxIn) => txIn.txOutId + txIn.txOutIndex).reduce((a, b) => a + b, '');

  const txOutContent: string = tx.txOuts
    .map((txOut: TxOut) => txOut.address + txOut.amount)
    .reduce((a, b) => a + b, '');

  return CryptoJS.SHA256(txInContent + txOutContent).toString();
};

const findUTxOut = (txOutId: string, txOutIndex: number, uTxOutList: UTxOut[]): UTxOut | undefined =>
  uTxOutList.find(uTxOut => uTxOut.txOutId === txOutId && uTxOut.txOutIndex === txOutIndex);

const signTxIn = (tx: Transaction, txInIndex: number, privateKey: string): string[] => {
  const txIn: TxIn = tx.txIns[txInIndex];
  const dataToSign = tx.id;
  const referencedUTxOut = findUTxOut(txIn.txOutId, txIn.txOutIndex, uTxOuts);
  if (referencedUTxOut === undefined) {
    return;
  }
  const key = ec.keyFromPrivate(privateKey, 'hex');
  const signature = toHexString(key.sign(dataToSign).toDER());
  return signature;
};

declare global {
  interface Array<T> {
    flat(this: T[]): T;
  }
}

Array.prototype.flat = function<T>(this: T[][]): T[] {
  return this.reduce((a, b) => a.concat(b), []);
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
