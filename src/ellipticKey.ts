import ec from './elliptic';
import { toHexString } from './common';

export const getPublicFromKey = (privateKey: string): string => {
  const key = ec.keyFromPrivate(privateKey, 'hex');
  return key
    .getPublic()
    .encode('hex', false)
    .toString();
};

export const getSignature = (privateKey: string, dataToSign: string): string => {
  const key = ec.keyFromPrivate(privateKey, 'hex');
  const signature = toHexString(key.sign(dataToSign).toDER()).toString();
  return signature;
};
