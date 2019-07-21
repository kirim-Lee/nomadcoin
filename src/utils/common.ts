export const getTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

export const toHexString = byteArray =>
  Array.from(byteArray, (byte: any) => ('0' + (byte & 0xff).toString(16)).slice(-2)).join('');
