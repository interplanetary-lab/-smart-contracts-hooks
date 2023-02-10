/**
 * State of rounds in general for a contract
 */
export enum RoundsState {
  /** Rounds not loaded */
  UNKNOWN,
  /** Rounds was sync but none was found */
  NO_ROUNDS,
  /** At least one round is active */
  ACTIVE,
  /** A round will be active soon */
  SOON,
  /** All rounds are passed */
  PAST,
}
