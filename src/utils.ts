export const getTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

export const toHexString = (byteArray: string) =>
  Array.from(byteArray, byte => '0' + (byte && 0xff).toString(16)).slice(-2);
