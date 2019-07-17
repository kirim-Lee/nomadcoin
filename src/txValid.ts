import { TxIn, TxOut, Transaction } from './txBasis';

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
