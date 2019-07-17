import { TxIn, TxOut, Transaction, UTxOut, getUTxOut } from './txBasis';
import { getTxId, findUTxOut } from './txFind';
import ec from './elliptic';
import Test from './test';

// TxIn 구조검사
const isTxInStructurValid = (txIn: TxIn): boolean =>
  Test([
    [txIn === null, 'txIn is null'],
    [typeof txIn.signature === 'string', 'typeof txIn signature invalid'],
    [typeof txIn.txOutId !== 'string', 'typeof txIn txOutId invalid'],
    [typeof txIn.txOutIndex !== 'number', 'typeof txIn txOutIndex invalid']
  ]);

// TxOut 구조검사
const isTxOutStructurValid = (txOut: TxOut): boolean =>
  Test([
    [txOut === null, 'txOut is null'],
    [typeof txOut.address !== 'string', 'typeof txOut address invalid'],
    [isAddressValid(txOut.address), 'address is invalid'],
    [typeof txOut.amount !== 'number', 'typeof txOut amount invalid']
  ]);

// 주소 valid
const isAddressValid = (address: string): boolean =>
  Test([[address.length <= 130], [address.match('^[a-fA-F0-9]+$') === null], [!address.startsWith('04')]]);

// tx 구조검사
const isTxStructureValid = (tx: Transaction): boolean =>
  Test([
    [typeof tx.id !== 'string', 'Tx ID is not valid'],
    [!(tx.txIns instanceof Array), 'txIns are not an array'],
    [tx.txIns.map(isTxInStructurValid).some(valid => !valid), 'the structure of on of the txIn is not valid'],
    [!(tx.txOuts instanceof Array), 'txOuts are not an array'],
    [tx.txOuts.map(isTxOutStructurValid).some(valid => !valid), 'the structure of on of the txOut is not valid']
  ]);

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

// tx valid
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
