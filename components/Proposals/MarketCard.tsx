import { useCallback, useEffect, useState } from 'react';
import {
  ActionIcon,
  Button,
  Container,
  Fieldset,
  Grid,
  Group,
  HoverCard,
  Loader,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import numeral from 'numeral';
import { IconQuestionMark } from '@tabler/icons-react';
import { NUMERAL_FORMAT } from '@/lib/constants';
import { useProposal } from '../../hooks/useProposal';
import { Token, useTokens } from '../../hooks/useTokens';
import { useTokenAmount } from '../../hooks/useTokenAmount';
import { ProposalAccountWithKey } from '../../lib/types';
import { useTokenMint } from '../../hooks/useTokenMint';
import { useTransactionSender } from '../../hooks/useTransactionSender';

export function MarketCard({ proposal: fromProposal }: { proposal: ProposalAccountWithKey }) {
  const {
    proposal,
    markets,
    mintTokensTransactions,
    placeOrderTransactions,
    fetchMarkets,
    loading,
  } = useProposal({
    fromProposal,
  });
  const { amount: baseBalance } = useTokenAmount(markets?.baseVault.underlyingTokenMint);
  const { amount: quoteBalance } = useTokenAmount(markets?.quoteVault.underlyingTokenMint);
  const { tokens } = useTokens();
  const { mint } = useTokenMint(tokens?.meta?.publicKey);
  const { send: sender } = useTransactionSender();
  const [passPrice, setPassPrice] = useState<number>(0);
  const [failPrice, setFailPrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(tokens?.meta);
  const isBeneficial = passPrice > failPrice;
  const usedToken = (selectedToken !== tokens?.usdc ? tokens?.meta : tokens?.usdc) || tokens?.meta;
  const payoutToken = selectedToken === tokens?.usdc ? tokens?.meta : tokens?.usdc;
  const passAmount = !isBeneficial ? (failPrice * amount) / passPrice : amount;
  const failAmount = !isBeneficial ? amount : (passPrice * amount) / failPrice;

  useEffect(() => {
    if (!selectedToken) {
      setSelectedToken(tokens?.meta);
    }
  }, [selectedToken, tokens]);

  const baseSupply =
    numeral(mint?.supply || 0)
      .divide(10 ** (mint?.decimals || 0))
      .value() || 0;
  const marketPassValue =
    (baseSupply * ((markets?.passPrice.ask || 0) + (markets?.passPrice.bid || 0))) / 2;
  const marketFailValue =
    (baseSupply * ((markets?.failPrice.ask || 0) + (markets?.failPrice.bid || 0))) / 2;
  const beliefPassValue = passPrice * baseSupply;
  const beliefFailValue = failPrice * baseSupply;

  const handleBet = useCallback(async () => {
    const mintTxs = await mintTokensTransactions(amount, usedToken !== tokens?.usdc);
    const placePassTxs = await placeOrderTransactions(
      passAmount,
      passPrice,
      true,
      usedToken !== tokens?.usdc,
      true,
    );
    const placeFailTxs = await placeOrderTransactions(
      failAmount,
      failPrice,
      true,
      usedToken !== tokens?.usdc,
      false,
      1,
    );
    if (!mintTxs || !placePassTxs || !placeFailTxs) return;

    await sender([...mintTxs, ...placePassTxs, ...placeFailTxs].filter(Boolean));

    fetchMarkets();
  }, [
    amount,
    passPrice,
    failPrice,
    mintTokensTransactions,
    placeOrderTransactions,
    sender,
    fetchMarkets,
  ]);

  return !proposal || !markets ? (
    <Group justify="center">
      <Loader />
    </Group>
  ) : (
    <Stack align="center" gap="xs">
      <Group wrap="wrap">
        <Container size="3xs" p="0">
          <Fieldset p="sm">
            <Stack align="center" gap="0">
              <Title order={3} c="green">
                On PASS
              </Title>
              <Text ta="center">The market thinks it will change the value of the DAO to</Text>
              <Title>{numeral(marketPassValue).format(NUMERAL_FORMAT)}$</Title>
            </Stack>
          </Fieldset>
        </Container>
        <Container size="3xs" p="0">
          <Fieldset p="sm">
            <Stack align="center" gap="0">
              <Title order={3} c="red">
                On FAIL
              </Title>
              <Text ta="center">The market thinks it will change the value of the DAO to</Text>
              <Title>{numeral(marketFailValue).format(NUMERAL_FORMAT)}$</Title>
            </Stack>
          </Fieldset>
        </Container>
      </Group>
      <Group justify="center">
        <Container size="xs" p="0">
          <Stack align="center">
            <Stack align="center" gap="0">
              <TextInput
                type="number"
                label={`${tokens?.meta?.symbol} price if proposal passes`}
                placeholder="Enter price..."
                defaultValue={0}
                w="100%"
                onChange={(e) => setPassPrice(Number(e.target.value))}
              />
              <Text fw="lighter" size="sm">
                You believe that if it fails, this proposal will change the value of the DAO to{' '}
                <Text fw="bolder" ff="monospace" size="md" span>
                  {numeral(beliefPassValue).format(NUMERAL_FORMAT)} ${tokens?.usdc?.symbol}
                </Text>
              </Text>
            </Stack>
            <Stack align="center" gap="0">
              <TextInput
                type="number"
                label={`${tokens?.meta?.symbol} price if proposal fails`}
                placeholder="Enter price..."
                defaultValue={0}
                w="100%"
                onChange={(e) => setFailPrice(Number(e.target.value))}
              />
              <Text fw="lighter" size="sm">
                You believe that if it fails, this proposal will change the value of the DAO to{' '}
                <Text fw="bolder" ff="monospace" size="md" span>
                  {numeral(beliefFailValue).format(NUMERAL_FORMAT)} ${tokens?.usdc?.symbol}
                </Text>
              </Text>
            </Stack>
            <Text size="sm" fw="bold" c={isBeneficial ? 'green' : 'red'}>
              This proposal is {isBeneficial ? 'BULLISH' : 'BEARISH'} for MetaDAO
            </Text>
            <Stack gap="0">
              <SegmentedControl
                data={['META', 'USDC']}
                onChange={(e) => setSelectedToken(e === 'META' ? tokens?.meta : tokens?.usdc)}
              />
              <TextInput
                type="number"
                label={`${usedToken?.symbol} amount to bet`}
                placeholder="Enter amount..."
                defaultValue={0}
                w="100%"
                onChange={(e) => setAmount(Number(e.target.value))}
              />
              <Text fw="lighter" size="sm">
                Balance: {numeral(baseBalance?.uiAmountString || 0).format(NUMERAL_FORMAT)} $
                {tokens?.meta?.symbol}
              </Text>
              <Text fw="lighter" size="sm">
                Balance: {numeral(quoteBalance?.uiAmountString || 0).format(NUMERAL_FORMAT)} $
                {tokens?.usdc?.symbol}
              </Text>
            </Stack>
            <Grid w="100%" align="center">
              <Grid.Col span={10}>
                <Button
                  onClick={handleBet}
                  loading={loading}
                  fullWidth
                  disabled={
                    (isBeneficial && amount > (baseBalance?.uiAmount || 0)) ||
                    (!isBeneficial && amount > (quoteBalance?.uiAmount || 0))
                  }
                >
                  Bet
                </Button>
              </Grid.Col>
              <Grid.Col span={2}>
                <HoverCard>
                  <HoverCard.Target>
                    <ActionIcon size="lg" variant="outline">
                      <IconQuestionMark />
                    </ActionIcon>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                    <Container size="sm">
                      <Stack gap={3} maw="100%">
                        <Text>
                          If PASS market goes {usedToken !== tokens?.meta ? 'below' : 'above'}{' '}
                          {numeral(passPrice).format(NUMERAL_FORMAT)}$ and the proposal passes, you
                          will receive {numeral(passPrice * amount).format(NUMERAL_FORMAT)} $
                          {payoutToken?.symbol}
                        </Text>
                        <Text>
                          If FAIL market goes {usedToken !== tokens?.meta ? 'below' : 'above'}{' '}
                          {numeral(failPrice).format(NUMERAL_FORMAT)}$ and the proposal fails, you
                          will receive {numeral(failPrice * amount).format(NUMERAL_FORMAT)} $
                          {payoutToken?.symbol}
                        </Text>
                        <Text>
                          Otherwise you get back your {numeral(amount).format(NUMERAL_FORMAT)} $
                          {usedToken?.symbol}
                        </Text>
                      </Stack>
                    </Container>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </Group>
    </Stack>
  );
}
