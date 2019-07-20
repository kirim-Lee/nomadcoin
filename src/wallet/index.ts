import ec from '../utils/elliptic';
import path from 'path';
import fs from 'fs';
import { getPublicFromKey } from '../utils/ellipticKey';
import { UTxOut, getUTxOut } from '../tx/txBasis';

const privateKeyLocation = path.join(__dirname, 'privateKey');

// private Key
const generatePrivateKey = (): string => {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

export const initWallet = (): void =>
  !fs.existsSync(privateKeyLocation) ? fs.writeFileSync(privateKeyLocation, generatePrivateKey()) : null;

const getPrivateFromWallet = (): string => fs.readFileSync(privateKeyLocation, 'utf8').toString();

export const getPublicFromWallet = (): string => {
  const privateKey = getPrivateFromWallet();
  return getPublicFromKey(privateKey);
};

const getBalance = (address: string, uTxOuts: UTxOut[]) => {
  return uTxOuts
    .filter(uTxOut => uTxOut.address === address)
    .map(uTxOut => uTxOut.amount || 0)
    .sum();
};

export const getAccountBalance = () => getBalance(getPublicFromWallet(), getUTxOut());

export const findAmountInUTxOuts = (
  amountNeeded: number,
  myUtxOuts: UTxOut[]
): { includedUTxOuts: UTxOut[]; leftOverAmount: number } | null => {
  let currentAmount = 0;
  const includedUTxOuts = [];

  for (const myUtxOut of myUtxOuts) {
    includedUTxOuts.push(myUtxOut);
    currentAmount = currentAmount + myUtxOut.amount;

    if (currentAmount >= amountNeeded) {
      const leftOverAmount = currentAmount - amountNeeded;
      return { includedUTxOuts, leftOverAmount };
    }
  }

  console.log('not enough founds');
  return null;
};
