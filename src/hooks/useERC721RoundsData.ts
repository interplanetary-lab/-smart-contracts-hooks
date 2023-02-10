import { ERC721Round } from '@interplanetary-lab/smart-contracts-ethers-js';
import { useState } from 'react';

import { useERCRoundsData, useERCRoundsDataOptions } from './useERCRoundsData';

export type useERC721RoundsDataOptions = useERCRoundsDataOptions<ERC721Round>;

export const useERC721RoundsData = ({
  onSyncData,
  ...otherProps
}: useERC721RoundsDataOptions) => {
  const [totalSupply, setTotalSupply] = useState<number>(0);

  const roundsData = useERCRoundsData<ERC721Round>({
    onSyncData: (data: { totalSupply: number }) => {
      setTotalSupply(data.totalSupply);
      if (onSyncData) {
        onSyncData(data as never);
      }
    },
    ...otherProps,
  });

  return {
    /** The contract total supply */
    totalSupply,

    ...roundsData,
  };
};
