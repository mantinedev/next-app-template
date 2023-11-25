import { PublicKey } from '@solana/web3.js';

export const OPENBOOK_PROGRAM_ID = new PublicKey('opnb2LAfJYbRMAHHvqjCwQxanZn7ReEHp1k81EohpZb');
export const OPENBOOK_TWAP_PROGRAM_ID = new PublicKey(
  'TWAPrdhADy2aTKN5iFZtNnkQYXERD9NvKjPFVPMSCNN',
);
export const AUTOCRAT_PROGRAM_ID = new PublicKey('meta3cxKzFBmWYgCVozmvCQAS3y9b3fGxrG9HkHL7Wi');

export const NUMERAL_FORMAT = '0.00a';
export const SLOTS_PER_10_SECS: number = 25;
export const TEN_DAYS_IN_SLOTS: number = 10 * 24 * 60 * 6 * SLOTS_PER_10_SECS;
export const QUOTE_LOTS = 0.0001;
