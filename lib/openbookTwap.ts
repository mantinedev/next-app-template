import { QUOTE_LOTS } from './constants';
import { TWAPOracle } from './types';

export const calculateTWAP = (twapOracle?: TWAPOracle) => {
  if (!twapOracle) return;
  const slotsPassed = twapOracle.lastUpdatedSlot.sub(twapOracle.initialSlot);
  const twapValue = twapOracle.observationAggregator.div(slotsPassed);
  return twapValue.toNumber() * QUOTE_LOTS;
};
