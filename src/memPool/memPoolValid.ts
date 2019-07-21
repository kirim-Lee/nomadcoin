import { Transaction, TxIn, UTxOut } from '../tx/txBasis';
import Test from '../utils/test';
import { validateTx } from '../tx/txValid';

const idDuplicates = (txIns: TxIn[], memPool: Transaction[]): boolean =>
  memPool
    .map((tx: Transaction) => tx.txIns)
    .flat()
    .some(
      (memPoolTxIn: TxIn): boolean =>
        txIns.some(
          (txIn: TxIn): boolean => txIn.txOutIndex === memPoolTxIn.txOutIndex && txIn.txOutId === memPoolTxIn.txOutId
        )
    );

export const validateTxPool = (tx: Transaction, memPool: Transaction[], uTxOutList: UTxOut[]): Boolean => {
  return Test(
    [
      [validateTx(tx, uTxOutList), 'This tx is invalid. will not add it to pool'],
      [idDuplicates(tx.txIns, memPool), 'This tx is duplicated for the pool. will not add it to pool']
    ],
    true
  );
};
