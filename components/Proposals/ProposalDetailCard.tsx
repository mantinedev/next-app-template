import { useCallback, useState } from 'react';
import { Button, Divider, Fieldset, Flex, Group, Loader, Space, Stack, Text, TextInput } from '@mantine/core';
import Link from 'next/link';
import { IconExternalLink } from '@tabler/icons-react';
import { useProposal } from '@/hooks/useProposal';
import { useTokens } from '@/hooks/useTokens';
import { useTokenAmount } from '@/hooks/useTokenAmount';
// import { TWAPOracle, LeafNode } from '@/lib/types';
import { ProposalOrdersCard } from './ProposalOrdersCard';
import { ConditionalMarketCard } from '../Markets/ConditionalMarketCard';
import { useExplorerConfiguration } from '@/hooks/useExplorerConfiguration';
import { shortKey } from '@/lib/utils';

export function ProposalDetailCard({ proposalNumber }: { proposalNumber: number }) {
  const { proposal, markets, orders, mintTokens, placeOrder, loading } = useProposal({
    fromNumber: proposalNumber,
  });
  const [mintBaseAmount, setMintBaseAmount] = useState<number>();
  const [mintQuoteAmount, setMintQuoteAmount] = useState<number>();
  const { amount: baseAmount } = useTokenAmount(markets?.baseVault.underlyingTokenMint);
  const { amount: basePassAmount } = useTokenAmount(
    markets?.baseVault.conditionalOnFinalizeTokenMint,
  );
  const { amount: baseFailAmount } = useTokenAmount(
    markets?.baseVault.conditionalOnRevertTokenMint,
  );
  const { amount: quoteAmount } = useTokenAmount(markets?.quoteVault.underlyingTokenMint);
  const { amount: quotePassAmount } = useTokenAmount(
    markets?.quoteVault.conditionalOnFinalizeTokenMint,
  );
  const { amount: quoteFailAmount } = useTokenAmount(
    markets?.quoteVault.conditionalOnRevertTokenMint,
  );
  const { tokens } = useTokens();
  const { generateExplorerLink } = useExplorerConfiguration();

  const handleMint = useCallback(
    async (fromBase?: boolean) => {
      if ((!mintBaseAmount && fromBase) || (!mintQuoteAmount && !fromBase)) return;

      if (fromBase) {
        await mintTokens(mintBaseAmount!, true);
      } else {
        await mintTokens(mintQuoteAmount!, false);
      }
    },
    [mintTokens, mintBaseAmount, mintQuoteAmount],
  );

  const proposalState = () => {
    if (!proposal) return null;
    if (proposal.account.state.pending) {
      return 'Pending';
    }
    if (proposal.account.state.passed) {
      return 'Passed';
    }
    if (proposal.account.state.failed) {
      return 'Failed';
    }
  };

  // const calculateTWAP = (twapOracle: TWAPOracle) => {
  //   const slotsPassed = twapOracle.lastUpdatedSlot.sub(twapOracle.initialSlot);
  //   const twapValue = twapOracle.observationAggregator.div(slotsPassed);
  //   return (twapValue.toString();
  // };

  // const passTwap = markets ? calculateTWAP(markets.passTwap.twapOracle) : null;
  // const failTwap = markets ? calculateTWAP(markets.failTwap.twapOracle) : null;

  return !proposal || !markets ? (
    <Group justify="center">
      <Loader />
    </Group>
  ) : (
    <Stack gap="0">
      <Flex
        justify="flex-start"
        align="flex-start"
        direction="row"
        wrap="wrap"
      >
        <Group>
          <Stack>
            <Text fw="bolder" size="xl">
              Proposal #{proposal.account.number} {proposalState()}
            </Text>
            <Link href={proposal.account.descriptionUrl}>
              <Group gap="sm">
                <Text>Go to description</Text>
                <IconExternalLink />
              </Group>
            </Link>
            <Text>
              Proposer{' '}
              <a
                href={generateExplorerLink(proposal.account.proposer.toString(), 'account')}
                target="blank"
              >
                {shortKey(proposal.account.proposer.toString())}
              </a>
            </Text>
            <Text>
              Pass Market{' '}
              <a
                href={generateExplorerLink(proposal.account.openbookPassMarket.toString(), 'account')}
                target="blank"
              >
                {shortKey(proposal.account.openbookPassMarket.toString())}
              </a>
            </Text>
            <Text>
              Fail Market{' '}
              <a
                href={generateExplorerLink(proposal.account.openbookFailMarket.toString(), 'account')}
                target="blank"
              >
                {shortKey(proposal.account.openbookFailMarket.toString())}
              </a>
            </Text>
            <Text>
              Pass TWAP Market{' '}
              <a
                href={generateExplorerLink(proposal.account.openbookTwapPassMarket.toString(), 'account')}
                target="blank"
              >
                {shortKey(proposal.account.openbookTwapPassMarket.toString())}
              </a>
            </Text>
            <Text>
              Fail TWAP Market{' '}
              <a
                href={generateExplorerLink(proposal.account.openbookTwapFailMarket.toString(), 'account')}
                target="blank"
              >
                {shortKey(proposal.account.openbookTwapFailMarket.toString())}
              </a>
            </Text>
            <Text>
              Conditional USDC Vault{' '}
              <a
                href={generateExplorerLink(proposal.account.quoteVault.toString(), 'account')}
                target="blank"
              >
                {shortKey(proposal.account.quoteVault.toString())}
              </a>
            </Text>
            <Text>
              Conditional META Vault{' '}
              <a
                href={generateExplorerLink(proposal.account.baseVault.toString(), 'account')}
                target="blank"
              >
                {shortKey(proposal.account.baseVault.toString())}
              </a>
            </Text>
          </Stack>
        </Group>
        <Space w="md" />
        <Group>
          <Fieldset legend={`Mint conditional $${tokens?.meta?.symbol}`}>
            <TextInput
              label="Amount"
              description={`Balance: ${baseAmount?.uiAmountString || 0} $${tokens?.meta?.symbol}`}
              placeholder="Amount to mint"
              type="number"
              onChange={(e) => setMintBaseAmount(Number(e.target.value))}
            />
            <Text fw="lighter" size="sm" c="green">
              Balance: {basePassAmount?.uiAmountString || 0} $p{tokens?.meta?.symbol}
            </Text>
            <Text fw="lighter" size="sm" c="red">
              Balance: {baseFailAmount?.uiAmountString || 0} $f{tokens?.meta?.symbol}
            </Text>
            <Button
              mt="md"
              disabled={(mintBaseAmount || 0) <= 0}
              onClick={() => handleMint(true)}
              loading={loading}
              fullWidth
            >
              Mint
            </Button>
          </Fieldset>
          <Fieldset legend={`Mint conditional $${tokens?.usdc?.symbol}`}>
            <TextInput
              label="Amount"
              description={`Balance: ${quoteAmount?.uiAmountString || 0} $${tokens?.usdc?.symbol}`}
              placeholder="Amount to mint"
              type="number"
              onChange={(e) => setMintQuoteAmount(Number(e.target.value))}
            />
            <Text fw="lighter" size="sm" c="green">
              Balance: {quotePassAmount?.uiAmountString || 0} $p{tokens?.usdc?.symbol}
            </Text>
            <Text fw="lighter" size="sm" c="red">
              Balance: {quoteFailAmount?.uiAmountString || 0} $f{tokens?.usdc?.symbol}
            </Text>
            <Button
              mt="md"
              disabled={(mintQuoteAmount || 0) <= 0}
              loading={loading}
              onClick={() => handleMint(false)}
              fullWidth
            >
              Mint
            </Button>
          </Fieldset>
        </Group>
      </Flex>
      <Divider m={20} />
      <Stack>
        {markets ? (
          <Group gap="md" justify="space-around" p="sm">
            <ConditionalMarketCard
              isPassMarket
              markets={markets}
              proposal={proposal}
              placeOrder={placeOrder}
              quoteBalance={quotePassAmount?.uiAmountString}
              baseBalance={basePassAmount?.uiAmountString}
            />
            <ConditionalMarketCard
              isPassMarket={false}
              markets={markets}
              proposal={proposal}
              placeOrder={placeOrder}
              quoteBalance={quoteFailAmount?.uiAmountString}
              baseBalance={baseFailAmount?.uiAmountString}
            />
          </Group>
        ) : null}

        {proposal && orders ? (
          <ProposalOrdersCard markets={markets} proposal={proposal} orders={orders} />
        ) : null}
      </Stack>
    </Stack>
  );
}
