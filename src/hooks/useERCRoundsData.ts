import {
  ERCRound,
  getRoundsByState,
  nowTimestamp,
  sortRoundsByPrice,
  sortRoundsByStartTime,
} from '@interplanetary-lab/smart-contracts-ethers-js';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { RoundsState } from '../types/rounds';
import { convertBigNumberEntries } from '../utils';

export type useERCRoundsDataOptions<RoundType> = {
  /** The endpoint path that return all data of the contract */
  endpoint?: string;

  /** Number of seconds to wait between each data synchronization (0 if only one sync) */
  syncInterval?: number;

  /** Function called on each sync data with the API */
  onSyncData?: (data: never) => void;

  // TODO added already load rounds
  todo?: RoundType;
};

export const useERCRoundsData = <RoundType extends ERCRound>({
  endpoint,
  syncInterval,
  onSyncData,
}: useERCRoundsDataOptions<RoundType>) => {
  const [rounds, setRounds] = useState<RoundType[]>([]);
  const [roundsState, setRoundsState] = useState<RoundsState>(
    RoundsState.UNKNOWN,
  );
  const [activeRounds, setActiveRounds] = useState<RoundType[]>([]);
  const [nextRounds, setNextRounds] = useState<RoundType[]>([]);
  const [pastRounds, setPastRounds] = useState<RoundType[]>([]);
  const [firstFetch, setFirstFetch] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  /**
   * Update activeRounds, nextRounds and pastRounds
   */
  const updateRoundCategories = useCallback(() => {
    if (!rounds || !rounds.length) {
      setActiveRounds([]);
      setNextRounds([]);
      setPastRounds([]);
      return;
    }

    const roundsByState = getRoundsByState(rounds);

    // Sort active round by price (cheapest to most expensive)
    const newActiveRounds = sortRoundsByPrice(
      roundsByState.activeRounds,
    ) as RoundType[];

    // Sort next round by startTime (closest to the farthest)
    const newNextRounds = sortRoundsByStartTime(
      roundsByState.nextRounds,
    ) as RoundType[];

    // Sort past round by startTime (newest to oldest)
    const newPastRounds = sortRoundsByStartTime(
      roundsByState.pastRounds,
    ) as RoundType[];

    // Set
    setActiveRounds(newActiveRounds);
    setNextRounds(newNextRounds);
    setPastRounds(newPastRounds);
  }, [rounds]);

  /**
   * Sync all rounds from API
   */
  const syncData = useCallback(async () => {
    if (endpoint) {
      const { data } = await axios.get(endpoint);
      const newRoundsData = data.rounds;
      const newRounds = newRoundsData.map(
        convertBigNumberEntries,
      ) as RoundType[];
      setFirstFetch(true);
      setRounds(newRounds);
      if (onSyncData) {
        onSyncData(data as never);
      }
    }
  }, [endpoint, onSyncData]);

  // syncData
  useEffect(() => {
    // Timeout for avoid two nearby sync at page loading
    const firstSyncInterval = setTimeout(() => {
      syncData();
    }, 300);

    // Update rounds data every syncInterval
    let syncEveryMinInterval: NodeJS.Timeout;
    if (syncInterval) {
      syncEveryMinInterval = setInterval(() => {
        syncData();
      }, syncInterval * 1000);
    }
    return () => {
      clearInterval(firstSyncInterval);
      clearInterval(syncEveryMinInterval);
    };
  }, [syncInterval, syncData]);

  // On `rounds` change
  useEffect(() => {
    if (!firstFetch) {
      return;
    }
    updateRoundCategories();
    setLastUpdate(Date.now());
  }, [firstFetch, rounds, updateRoundCategories]);

  // On `lastUpdate` change, set `roundsState`
  useEffect(() => {
    if (rounds.length === 0 && lastUpdate > 0) {
      setRoundsState(RoundsState.NO_ROUNDS);
    } else if (activeRounds.length === 0 && nextRounds.length > 0) {
      setRoundsState(RoundsState.SOON);
    } else if (activeRounds.length > 0) {
      setRoundsState(RoundsState.ACTIVE);
    } else if (pastRounds.length > 0) {
      setRoundsState(RoundsState.PAST);
    } else {
      setRoundsState(RoundsState.UNKNOWN);
    }
  }, [rounds, activeRounds, nextRounds, pastRounds, lastUpdate]);

  // updateRoundCategories on a round ended
  useEffect(() => {
    if (!activeRounds.length) {
      return;
    }
    const activeRoundsEndsTime = activeRounds.map(round =>
      round.startTime.add(round.duration).toNumber(),
    );
    const nextEndTime = activeRoundsEndsTime.sort()[0];
    const interval = setTimeout(() => {
      updateRoundCategories();
    }, (nextEndTime - nowTimestamp() + 1) * 1000);
    return () => {
      clearTimeout(interval);
    };
  }, [activeRounds, updateRoundCategories]);

  // updateRoundCategories on a round started
  useEffect(() => {
    if (!nextRounds.length) {
      return;
    }
    const nextStartTime = nextRounds[0].startTime.toNumber();
    const interval = setTimeout(() => {
      updateRoundCategories();
    }, (nextStartTime - nowTimestamp() + 1) * 1000);
    return () => {
      clearTimeout(interval);
    };
  }, [nextRounds, updateRoundCategories]);

  return useMemo(
    () => ({
      /** Current round state */
      roundsState,

      /** All fetched rounds updated with `syncData` */
      rounds,

      /** All active rounds sort by price (cheapest to most expensive) */
      activeRounds,

      /** All next rounds sort by startTime (closest to the farthest) */
      nextRounds,

      /** All past rounds sort by startTime (closest to the farthest) */
      pastRounds,

      /** Last time that all rounds have been updated */
      lastUpdate,

      /** Sync all data from the api */
      syncData,
    }),
    [
      roundsState,
      rounds,
      activeRounds,
      nextRounds,
      pastRounds,
      lastUpdate,
      syncData,
    ],
  );
};
