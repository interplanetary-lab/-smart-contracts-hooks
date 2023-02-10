import { ERC1155Round } from '@interplanetary-lab/smart-contracts-ethers-js';
import { useState } from 'react';

import { useERCRoundsData, useERCRoundsDataOptions } from './useERCRoundsData';

export type useERC1155RoundsDataOptions = useERCRoundsDataOptions<ERC1155Round>;

export const useERC1155RoundsData = ({
  onSyncData,
  ...otherProps
}: useERC1155RoundsDataOptions) => {
  const [totalSupply, setTotalSupply] = useState<{ [tokenId: number]: number }>(
    [],
  );

  const roundsData = useERCRoundsData<ERC1155Round>({
    onSyncData: (data: { totalSupply: number[] }) => {
      setTotalSupply(data.totalSupply);
      if (onSyncData) {
        onSyncData(data as never);
      }
    },
    ...otherProps,
  });

  return {
    /** The supply foreach tokenId used in rounds and updated with `syncData` */
    totalSupply,

    ...roundsData,
  };
};
