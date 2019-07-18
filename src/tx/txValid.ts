import { TxIn, TxOut, Transaction, UTxOut, getUTxOut } from './txBasis';
import { getTxId, findUTxOut } from './txFind';
import ec from '../utils/elliptic';
import Test from '../utils/test';

const COINBASE_AMOUNT = 50;

// TxIn 구조검사
const isTxInStructurValid = (txIn: TxIn): boolean =>
  Test(<[boolean, string?][]>[
    [txIn === null, 'txIn is null'],
    [typeof txIn.signature === 'string', 'typeof txIn signature invalid'],
    [typeof txIn.txOutId !== 'string', 'typeof txIn txOutId invalid'],
    [typeof txIn.txOutIndex !== 'number', 'typeof txIn txOutIndex invalid']
  ]);

// TxOut 구조검사
const isTxOutStructurValid = (txOut: TxOut): boolean =>
  Test(<[boolean, string?][]>[
    [txOut === null, 'txOut is null'],
    [typeof txOut.address !== 'string', 'typeof txOut address invalid'],
    [isAddressValid(txOut.address), 'address is invalid'],
    [typeof txOut.amount !== 'number', 'typeof txOut amount invalid']
  ]);

// 주소 valid
const isAddressValid = (address: string): boolean =>
  Test(<[boolean, string?][]>[
    [address.length <= 130],
    [address.match('^[a-fA-F0-9]+$') === null],
    [!address.startsWith('04')]
  ]);

// tx 구조검사
const isTxStructureValid = (tx: Transaction): boolean =>
  Test(<[boolean, string?][]>[
    [typeof tx.id !== 'string', 'Tx ID is not valid'],
    [!(tx.txIns instanceof Array), 'txIns are not an array'],
    [tx.txIns.map(isTxInStructurValid).some(valid => !valid), 'the structure of on of the txIn is not valid'],
    [!(tx.txOuts instanceof Array), 'txOuts are not an array'],
    [tx.txOuts.map(isTxOutStructurValid).some(valid => !valid), 'the structure of on of the txOut is not valid']
  ]);

// tx valid
const validateTx = (tx: Transaction): boolean =>
  Test(<[boolean, string?][]>[
    [!isTxStructureValid(tx)],
    [getTxId(tx) != tx.id],
    [!hasValidTxs(tx)],
    [amountInTxIns(tx) !== amountInTxOuts(tx)]
  ]);

// coinbase valid
const validateCoinbaseTx = (tx: Transaction, blockIndex: number): boolean =>
  Test(<[boolean, string?][]>[
    [getTxId(tx) !== tx.id],
    [tx.txIns.length !== 1],
    [tx.txIns[0].txOutIndex !== blockIndex],
    [tx.txOuts.length > 1],
    [tx.txOuts[0].amount !== COINBASE_AMOUNT]
  ]);

// enable unlock check
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

// check txIns valid (unlock check)
const hasValidTxs = (tx: Transaction): boolean =>
  tx.txIns.map((txIn: TxIn): boolean => validateTxIn(txIn, tx, getUTxOut())).some((bool: boolean) => !bool);

// get amount TxIns
const amountInTxIns = (tx: Transaction) =>
  tx.txIns
    .map(
      (txIn: TxIn): number => {
        const txOut = findUTxOut(txIn.txOutId, txIn.txOutIndex, getUTxOut());
        return (txOut && txOut.amount) || 0;
      }
    )
    .sum();

// get amount TxOuts
const amountInTxOuts = (tx: Transaction) => tx.txOuts.map(txOut => txOut.amount || 0).sum();
