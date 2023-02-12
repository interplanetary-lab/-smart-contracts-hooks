import { ERC721Round } from '@interplanetary-lab/smart-contracts-ethers-js';
import { useCallback, useMemo, useState } from 'react';

import { useERCRoundsData, useERCRoundsDataOptions } from './useERCRoundsData';

export type useERC721RoundsDataOptions = useERCRoundsDataOptions<ERC721Round>;

export const useERC721RoundsData = ({
  onSyncData,
  ...otherProps
}: useERC721RoundsDataOptions) => {
  const [totalSupply, setTotalSupply] = useState<number>(0);

  const onSyncDataMemorized = useCallback(
    (data: { totalSupply: number }) => {
      setTotalSupply(data.totalSupply);
      if (onSyncData) {
        onSyncData(data as never);
      }
    },
    [onSyncData],
  );

  const roundsData = useERCRoundsData<ERC721Round>({
    onSyncData: onSyncDataMemorized,
    ...otherProps,
  });

  return useMemo(
    () => ({
      /** The supply foreach tokenId used in rounds and updated with `syncData` */
      totalSupply,

      ...roundsData,
    }),
    [totalSupply, roundsData],
  );
};
