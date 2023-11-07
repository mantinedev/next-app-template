import { IdlAccounts } from '@coral-xyz/anchor';
import { AutocratV0 } from './idl/autocrat_v0';
import { OpenbookTwap } from './idl/openbook_twap';
import { OpenbookV2 } from './idl/openbook_v2';
import { ConditionalVault } from './idl/conditional_vault';

export type ProposalAccount = IdlAccounts<AutocratV0>['proposal'];
export type VaultAccount = IdlAccounts<ConditionalVault>['conditionalVault'];
export type MarketAccount = IdlAccounts<OpenbookV2>['market'];
export type TwapMarketAccount = IdlAccounts<OpenbookTwap>['twapMarket'];
export type Markets = {
  pass: MarketAccount;
  fail: MarketAccount;
  passTwap: TwapMarketAccount;
  failTwap: TwapMarketAccount;
  baseVault: VaultAccount;
  quoteVault: VaultAccount;
  passPrice: { bid: number; ask: number };
  failPrice: { bid: number; ask: number };
};
