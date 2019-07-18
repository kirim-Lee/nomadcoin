import ec from '../utils/elliptic';
import path from 'path';
import fs from 'fs';
import { getPublicFromKey } from '../utils/ellipticKey';

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
