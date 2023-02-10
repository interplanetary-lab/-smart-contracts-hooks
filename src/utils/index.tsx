/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumber } from 'ethers';

/**
 * Convert all entries with a BigNumber JSON format ({"type": "BigNumber", "hex": "0x....."}) in `obj`
 */
export const convertBigNumberEntries = (obj: any) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]: any) => {
      if (value?.hex && value?.type === 'BigNumber') {
        return [key, BigNumber.from(value.hex)];
      }
      return [key, value];
    }),
  );
