import { TxIn, TxOut, Transaction, UTxOut, getUTxOut } from './txBasis';
import { getTxId, findUTxOut } from './txFind';
import ec from './elliptic';

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
const isTxOutStructurValid = (txOut: TxOut): boolean => {
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

const validateTxIn = (txIn: TxIn, tx: Transaction, uTxOutList: UTxOut[]): boolean => {
  // txIn과 uTxOut에 같은 [txOutId, txOutIndex] 있는지 체크
  const wantedTxOut: UTxOut | undefined = findUTxOut(txIn.txOutId, txIn.txOutIndex, uTxOutList);
  if (wantedTxOut === undefined) {
    return false;
  }

  // tx id, signature 유효한지 체크
  const address = wantedTxOut.address;
  const key = ec.keyFromPublic(address, 'hex');
  return <boolean>key.verify(tx.id, txIn.signature);
};

const validateTx = (tx: Transaction): boolean => {
  if (getTxId(tx) !== tx.id) {
    return false;
  }

  const hasValidTxs = tx.txIns.map(txIn => validateTxIn(txIn, tx, getUTxOut())).some((boolean: boolean) => !boolean);

  if (!hasValidTxs) {
    return;
  }

  const amountInTxIns = tx.txIns
    .map(
      (txIn: TxIn): number => {
        const txOut = findUTxOut(txIn.txOutId, txIn.txOutIndex, getUTxOut());
        return txOut ? txOut.amount : 0;
      }
    )
    .reduce((a: number, b: number): number => a + (b || 0), 0);

  const amountInTxOuts = tx.txOuts.map(txOut => txOut.amount).reduce((a: number, b: number): number => a + (b || 0), 0);

  if (amountInTxIns !== amountInTxOuts) {
    return false;
  } else {
    return true;
  }
};
