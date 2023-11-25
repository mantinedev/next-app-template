import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  ActionIcon,
  Button,
  Divider,
  Fieldset,
  Flex,
  Group,
  HoverCard,
  Loader,
  Space,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import Link from 'next/link';
import { useConnection } from '@solana/wallet-adapter-react';
import { IconExternalLink, IconQuestionMark } from '@tabler/icons-react';
import { useProposal } from '@/hooks/useProposal';
import { useTokens } from '@/hooks/useTokens';
import { useTokenAmount } from '@/hooks/useTokenAmount';
// import { TWAPOracle, LeafNode } from '@/lib/types';
import { ProposalOrdersCard } from './ProposalOrdersCard';
import { ConditionalMarketCard } from '../Markets/ConditionalMarketCard';
import { useExplorerConfiguration } from '@/hooks/useExplorerConfiguration';
import { shortKey } from '@/lib/utils';
import { StateBadge } from './StateBadge';
import { SLOTS_PER_10_SECS, TEN_DAYS_IN_SLOTS } from '../../lib/constants';

export function ProposalDetailCard({ proposalNumber }: { proposalNumber: number }) {
  const { connection } = useConnection();
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
  const [lastSlot, setLastSlot] = useState<number>();
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const remainingSlots = useMemo(() => {
    if (!proposal) return;

    const endSlot = proposal.account.slotEnqueued.toNumber() + TEN_DAYS_IN_SLOTS;
    return endSlot - (lastSlot || endSlot);
  }, [proposal, lastSlot]);

  useEffect(() => {
    setSecondsLeft(((remainingSlots || 0) / SLOTS_PER_10_SECS) * 10);
  }, [remainingSlots]);
  useEffect(() => {
    const interval = setInterval(
      () => (secondsLeft && secondsLeft > 0 ? setSecondsLeft((old) => old - 1) : 0),
      1000,
    );

    return () => clearInterval(interval);
  });
  const timeLeft = useMemo(() => {
    const seconds = secondsLeft;
    const days = Math.floor(seconds / (60 * 60 * 24));
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secLeft = Math.floor(seconds % 60);

    return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(
      minutes,
    ).padStart(2, '0')}:${String(secLeft).padStart(2, '0')}`;
  }, [secondsLeft]);

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

  useEffect(() => {
    if (lastSlot) return;
    async function fetchSlot() {
      setLastSlot(await connection.getSlot());
    }

    fetchSlot();
  }, [connection, lastSlot]);

  return !proposal || !markets ? (
    <Group justify="center">
      <Loader />
    </Group>
  ) : (
    <Stack gap="0">
      <Flex justify="flex-start" align="flex-start" direction="row" wrap="wrap">
        <Accordion w="100%" pb="md">
          <Accordion.Item value={proposal.publicKey.toString()}>
            <Accordion.Control>
              <Stack>
                <Group justify="space-between">
                  <Text size="xl" fw={500}>
                    Proposal #{proposal.account.number + 1}
                  </Text>
                  <Text fw="bold">Ends in {timeLeft}</Text>
                  <StateBadge proposal={proposal} />
                </Group>
              </Stack>
            </Accordion.Control>
            <Accordion.Panel p="0" style={{ padding: '0' }}>
              <Stack gap="sm">
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
                    href={generateExplorerLink(
                      proposal.account.openbookPassMarket.toString(),
                      'account',
                    )}
                    target="blank"
                  >
                    {shortKey(proposal.account.openbookPassMarket.toString())}
                  </a>
                </Text>
                <Text>
                  Fail Market{' '}
                  <a
                    href={generateExplorerLink(
                      proposal.account.openbookFailMarket.toString(),
                      'account',
                    )}
                    target="blank"
                  >
                    {shortKey(proposal.account.openbookFailMarket.toString())}
                  </a>
                </Text>
                <Text>
                  Pass TWAP Market{' '}
                  <a
                    href={generateExplorerLink(
                      proposal.account.openbookTwapPassMarket.toString(),
                      'account',
                    )}
                    target="blank"
                  >
                    {shortKey(proposal.account.openbookTwapPassMarket.toString())}
                  </a>
                </Text>
                <Text>
                  Fail TWAP Market{' '}
                  <a
                    href={generateExplorerLink(
                      proposal.account.openbookTwapFailMarket.toString(),
                      'account',
                    )}
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
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Space w="md" />
        <Group align="center" justify="center" m="auto" pos="relative" w="100%">
          <HoverCard>
            <HoverCard.Target>
              <Group pos="absolute" top="0" left="0" justify="center" align="flex-start">
                <ActionIcon variant="transparent" pos="absolute" top="0" left="0">
                  <IconQuestionMark />
                </ActionIcon>
              </Group>
            </HoverCard.Target>
            <HoverCard.Dropdown w="22rem">
              <Text>
                Conditional tokens are the tokens used to trade on conditional markets. You can mint
                some by depositing $META or $USDC. These tokens will be locked up until the proposal
                is finalized.
                <br />
                <Text span fw="bold">
                  Pass tokens (pTokens)
                </Text>{' '}
                are used to trade on the Pass Market, while{' '}
                <Text span fw="bold">
                  Fail tokens (fTokens)
                </Text>{' '}
                are used to trade on the Fail Market.
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
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
