import { Transaction, TxIn, UTxOut, getUTxOut } from './txBasis';
import { findUTxOut } from './txFind';
import { getSignature, getPublicFromKey } from './ellipticKey';

const signTxIn = (tx: Transaction, txInIndex: number, privateKey: string): string | null => {
  const txIn: TxIn = tx.txIns[txInIndex];
  const referencedUTxOut: UTxOut = findUTxOut(txIn.txOutId, txIn.txOutIndex, getUTxOut());
  if (referencedUTxOut === undefined) {
    return null;
  }
  if (getPublicFromKey(privateKey) !== referencedUTxOut.address) {
    console.log('couldn`t find the referenced uTxOut, not signing');
    return null;
  }
  return getSignature(privateKey, tx.id);
};

const updateUTxOuts = (newTxs: Transaction[], uTxOutList: UTxOut[]) => {
  const newUTxOuts: UTxOut[] = newTxs
    .map(tx => tx.txOuts.map((txOut, index) => new UTxOut(tx.id, index, txOut.address, txOut.amount)))
    .flat();

  const spentTxOuts = newTxs
    .map(tx => tx.txIns)
    .flat()
    .map(txIn => new UTxOut(txIn.txOutId, txIn.txOutIndex, '', 0));

  const resultingUTxOuts = uTxOutList
    .filter(uTxOut => !findUTxOut(uTxOut.txOutId, uTxOut.txOutIndex, spentTxOuts))
    .concat(newUTxOuts);
};
