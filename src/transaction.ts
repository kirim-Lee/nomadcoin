class TxOut {
  public address: string;
  public amount: number;
  constructor(address: string, amount: number) {
    this.address = address;
    this.amount = amount;
  }
}

class TxIn {
  // uTxOutId
  // uTxOutIndex
  // signature
}

class Transaction {
  // ID
  // txIns[]
  // txOuts[]
}

class uTxOut {
  public uTxOutId: number;
  public uTxOutIndex: number;
  public address: string;
  public amount: number;
  constructor(uTxOutId: number, uTxOutIndex: number, address: string, amount: number) {
    this.uTxOutId = uTxOutId;
    this.uTxOutIndex = uTxOutIndex;
    this.address = address;
    this.amount = amount;
  }
}

const uTxOuts: uTxOut[] = [];
