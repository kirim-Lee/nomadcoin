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
  public signature: string;
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

const signTxIn = (tx: Transaction, txInIndex: number, privateKey: string): string => {
  const txIn: TxIn = tx.txIns[txInIndex];
  const dataToSign = tx.id;
  const referencedUTxOut = findUTxOut(txIn.txOutId, txIn.txOutIndex, uTxOuts);
  if (referencedUTxOut === undefined) {
    return;
  }
  const key = ec.keyFromPrivate(privateKey, 'hex');
  const signature = toHexString(key.sign(dataToSign).toDER()).toString();
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

// TxIn 구조검사
const isTxInStructurValid = (txIn: TxIn): boolean => {
  if (txIn === null) {
    console.log('txIn is null');
    return false;
  } else if (typeof txIn.signature === 'string') {
    console.log('typeof txIn signature invalid');
    return false;
  } else if (typeof txIn.txOutId !== 'string') {
    console.log('typeof txIn txOutId invalid');
    return false;
  } else if (typeof txIn.txOutIndex !== 'number') {
    console.log('typeof txIn txOutIndex invalid');
    return false;
  }
  return true;
};

// TxOut 구조검사
const isTxOutStructurValid = (txOut: TxOut) => {
  if (txOut === null) {
    console.log('txOut is null');
    return false;
  } else if (typeof txOut.address !== 'string') {
    console.log('typeof txOut address invalid');
    return false;
  } else if (isAddressValid(txOut.address)) {
    console.log('address is invalid');
    return false;
  } else if (typeof txOut.amount !== 'number') {
    console.log('typeof txOut amount invalid');
    return false;
  }
  return true;
};

// 주소 검사
const isAddressValid = (address: string): boolean => {
  if (address.length <= 130) {
    return false;
  } else if (address.match('^[a-fA-F0-9]+$') === null) {
    return false;
  } else if (!address.startsWith('04')) {
    return false;
  }
  return true;
};

const isTxStructureValid = (tx: Transaction): boolean => {
  if (typeof tx.id !== 'string') {
    console.log('Tx ID is not valid');
    return false;
  } else if (!(tx.txIns instanceof Array)) {
    console.log('txIns are not an array');
    return false;
  } else if (tx.txIns.map(isTxInStructurValid).some(valid => !valid)) {
    console.log('the structure of on of the txIn is not valid');
  } else if (!(tx.txOuts instanceof Array)) {
    console.log('txOuts are not an array');
    return false;
  } else if (tx.txOuts.map(isTxOutStructurValid).some(valid => !valid)) {
    console.log('the structure of on of the txOut is not valid');
    return false;
  }
  return true;
};
