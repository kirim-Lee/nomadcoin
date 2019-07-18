import { UTxOut } from '../tx/txBasis';

export const getBalance = (address: string, uTxOuts: UTxOut[]) => {
  return uTxOuts
    .filter(uTxOut => uTxOut.address === address)
    .map(uTxOut => uTxOut.amount || 0)
    .sum();
};

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
