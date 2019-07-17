const uTxOuts: UTxOut[] = [];

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

const getUTxOut = (): UTxOut[] => uTxOuts;
const addUTxOut = (uTxOut: UTxOut): UTxOut[] => {
  uTxOuts.push(uTxOut);
  return uTxOuts;
};

export { TxOut, TxIn, Transaction, UTxOut, getUTxOut, addUTxOut };
