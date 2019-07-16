import CryptoJS from 'crypto-js';

class TxOut {
  public address: string;
  public amount: number;
  constructor(address: string, amount: number) {
    this.address = address;
    this.amount = amount;
  }
}

class TxIn {
  public uTxOutId: string;
  public uTxOutIndex: number;
  public signature: string;
  // uTxOutId
  // uTxOutIndex
  // signature
}

class Transaction {
  public ID: string;
  public txIns: TxIn[];
  public txOuts: TxOut[];
  // ID
  // txIns[]
  // txOuts[]
}

class uTxOut {
  public uTxOutId: string;
  public uTxOutIndex: number;
  public address: string;
  public amount: number;
  constructor(uTxOutId: string, uTxOutIndex: number, address: string, amount: number) {
    this.uTxOutId = uTxOutId;
    this.uTxOutIndex = uTxOutIndex;
    this.address = address;
    this.amount = amount;
  }
}

const uTxOuts: uTxOut[] = [];

const getTxId = (tx: Transaction) => {
  const txInContent: string = tx.txIns
    .map((txIn: TxIn) => txIn.uTxOutId + txIn.uTxOutIndex)
    .reduce((a, b) => a + b, '');

  const txOutContent: string = tx.txOuts
    .map((txOut: TxOut) => txOut.address + txOut.amount)
    .reduce((a, b) => a + b, '');

  return CryptoJS.SHA256(txInContent + txOutContent).toString();
};
