# Smart Contracts Hooks

**Interplanetary Lab's smart contract binding libraries for React hooks.**

## Table of Contents

- [Smart Contracts Hooks](#smart-contracts-hooks)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Installation](#installation)
    - [Usage](#usage)
  - [Documentation](#documentation)
    - [Rounds](#rounds)
      - [useERC721RoundsData and useERC1155RoundsData](#useerc721roundsdata-and-useerc1155roundsdata)

## Overview

### Installation

```console
$ npm install @interplanetary-lab/smart-contracts-hooks
```

### Usage

Once installed, you can use the contracts in the library by importing them:

```javascript
import { useERC721RoundsData } from '@interplanetary-lab/smart-contracts-hooks';

//...
const {
  roundsState,
  activeRounds,
  nextRounds,
  syncRounds,
  lastUpdate,
} = useERC721RoundsData({ endpoint: '/api/rounds', syncInterval: 60 });
```

## Documentation

### Rounds

#### useERC721RoundsData and useERC1155RoundsData

Hooks allowing to get all rounds data in live.

The differences between `useERC721RoundsData` and `useERC1155RoundsData` are:

- The content of the round type (`ERC721Round` or `ERC1155Round`)
- `totalSupply` for `useERC1155RoundsData` is an object with tokenId as key

**Options**

```javascript
import { useERC721RoundsData } from '@interplanetary-lab/smart-contracts-hooks';

const options: {
  /** The endpoint path that return all data of the contract */
  endpoint?: string,

  /** Number of seconds to wait between each data synchronization (0 if only one sync) */
  syncInterval?: number,

  /** Function called on each sync data with the API */
  onSyncData?: (data: never) => void,
} = {};

const roundsData = useERC721RoundsData(options);
```

Notes:

- The api can used `ERC721RoundsData.getAllData()` or `ERC1155RoundsData.getAllData()` of [@interplanetary-lab/smart-contracts-ethers-js](https://www.npmjs.com/package/@interplanetary-lab/smart-contracts-ethers-js)

**Returned states**

```javascript
import { useERC721RoundsData } from '@interplanetary-lab/smart-contracts-hooks';

const {
  /** The contract total supply */
  totalSupply,

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
} = useERC721RoundsData(options);
```
