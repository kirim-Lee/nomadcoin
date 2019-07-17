import ec from './elliptic';
import { toHexString } from './utils';
import { Transaction, TxIn, UTxOut, getUTxOut } from './txBasis';
import { findUTxOut } from './txFind';

const COINBASE_AMOUNT = 50;
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
