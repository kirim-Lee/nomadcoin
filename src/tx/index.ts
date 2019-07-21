import { Transaction, TxIn, UTxOut, getUTxOut, TxOut } from './txBasis';
import { findUTxOut, getTxId } from './txFind';
import { getSignature, getPublicFromKey } from '../utils/ellipticKey';
import { findAmountInUTxOuts } from '../wallet';
import { COINBASE_AMOUNT, validateBlockTx } from './txValid';

export const signTxIn = (tx: Transaction, txInIndex: number, privateKey: string): string | null => {
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

const updateUTxOuts = (newTxs: Transaction[], uTxOutList: UTxOut[]): UTxOut[] => {
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

  return resultingUTxOuts;
};

export const createTx = (receiverAddress: string, amount: number, privateKey: string): Transaction => {
  const myAddress: string = getPublicFromKey(privateKey);
  const myUTxOuts: UTxOut[] = getUTxOut().filter(uTxOut => uTxOut.address === myAddress);

  // 거래될 uTxOut, 그 uTxOut에서 필요한 amount 차감한 나머지를 구함
  const { includedUTxOuts, leftOverAmount } = findAmountInUTxOuts(amount, myUTxOuts);
  const toUnSignedTxIn = (uTxOut: UTxOut) => {
    const { txOutId, txOutIndex } = uTxOut;
    return new TxIn(txOutId, txOutIndex, getSignature(privateKey, myAddress));
  };

  const unSignedTxIns = includedUTxOuts.map(toUnSignedTxIn);
  const txOuts = createTxOuts(receiverAddress, myAddress, amount, leftOverAmount);
  const txId = getTxId({ id: '', txIns: unSignedTxIns, txOuts });

  const tx = new Transaction(txId, unSignedTxIns, txOuts);

  tx.txIns = tx.txIns.map((txIn, index) => {
    txIn.signature = signTxIn(tx, index, privateKey);
    return txIn;
  });

  return tx;
};

const createTxOuts = (receiverAddress: string, myAddress: string, amount: number, leftOverAmount: number): TxOut[] => {
  const receiverTxOut = new TxOut(receiverAddress, amount);
  if (leftOverAmount === 0) {
    return [receiverTxOut];
  } else {
    const leftOverTxOut = new TxOut(myAddress, leftOverAmount);
    return [receiverTxOut, leftOverTxOut];
  }
};

export const createCoinbaseTx = (address: string, blockIndex: number): Transaction => {
  const txIn = new TxIn('', blockIndex, '');
  const txOut = new TxOut(address, COINBASE_AMOUNT);
  const tx = new Transaction('', [txIn], [txOut]);
  tx.id = getTxId(tx);

  return tx;
};

export const processTxs = (txs: Transaction[], uTxOutList: UTxOut[], blockIndex: number) => {
  if (!validateBlockTx(txs, uTxOutList, blockIndex)) {
    return null;
  }
  return updateUTxOuts(txs, uTxOutList);
};
