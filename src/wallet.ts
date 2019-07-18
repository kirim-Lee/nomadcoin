import ec from './elliptic';
import path from 'path';
import fs from 'fs';

const privateKeyLocation = path.join(__dirname, 'privateKey');

// private Key
const generatePrivateKey = (): string => {
  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate();
  return privateKey.toString(16);
};

const initWallet = (): void =>
  !fs.existsSync(privateKeyLocation) ? fs.writeFileSync(privateKeyLocation, generatePrivateKey()) : null;

export default initWallet;
