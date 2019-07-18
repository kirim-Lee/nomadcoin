import ec from './elliptic';
import path from 'path';
import fs from 'fs';
import { UTxOut } from './txBasis';
import { getPublicFromKey } from './ellipticKey';

const privateKeyLocation = path.join(__dirname, 'privateKey');

// private Key
const generatePrivateKey = (): string => {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

export const initWallet = (): void =>
  !fs.existsSync(privateKeyLocation) ? fs.writeFileSync(privateKeyLocation, generatePrivateKey()) : null;

const getPrivateFromWallet = (): string => fs.readFileSync(privateKeyLocation, 'utf-8').toString();

const getPublicFromWallet = (): string => {
  const privateKey = getPrivateFromWallet();
  return getPublicFromKey(privateKey);
};

const getBalance = (address: string, uTxOuts: UTxOut[]) => {
  return uTxOuts
    .filter(uTxOut => uTxOut.address === address)
    .map(uTxOut => uTxOut.amount || 0)
    .sum();
};
