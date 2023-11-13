import { useCallback, useState } from 'react';
import {
  ActionIcon,
  Button,
  Container,
  Fieldset,
  Grid,
  Group,
  HoverCard,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import numeral from 'numeral';
import { IconQuestionMark } from '@tabler/icons-react';
import { useProposal } from '../../hooks/useProposal';
import { useTokens } from '../../hooks/useTokens';
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
  const isBeneficial = passPrice > failPrice;
  const passAmount = !isBeneficial ? (failPrice * amount) / passPrice : amount;
  const failAmount = !isBeneficial ? amount : (passPrice * amount) / failPrice;

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
    const mintTxs = await mintTokensTransactions(amount, !isBeneficial);
    const placePassTxs = await placeOrderTransactions(
      passAmount,
      passPrice,
      true,
      isBeneficial,
      true,
    );
    const placeFailTxs = await placeOrderTransactions(
      failAmount,
      failPrice,
      true,
      !isBeneficial,
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
        <Container size="3xs">
          <Fieldset>
            <Stack align="center">
              <Title order={3} c="green">
                On PASS
              </Title>
              <Text>The market thinks it will change the value of the DAO to</Text>
              <Title>{numeral(marketPassValue).format('0.0a')}$</Title>
            </Stack>
          </Fieldset>
        </Container>
        <Container size="3xs">
          <Fieldset>
            <Stack align="center">
              <Title order={3} c="red">
                On FAIL
              </Title>
              <Text>The market thinks it will change the value of the DAO to</Text>
              <Title>{numeral(marketFailValue).format('0.0a')}$</Title>
            </Stack>
          </Fieldset>
        </Container>
      </Group>
      <Group justify="center">
        <Container size="xs">
          <Fieldset>
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
                  You believe that if it fails, this proposal will change the value of the DAO by{' '}
                  <Text fw="bolder" ff="monospace" size="md" span>
                    {beliefPassValue} ${tokens?.usdc?.symbol}
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
                  You believe that if it fails, this proposal will change the value of the DAO by{' '}
                  <Text fw="bolder" ff="monospace" size="md" span>
                    {beliefFailValue} ${tokens?.usdc?.symbol}
                  </Text>
                </Text>
              </Stack>
              <Text size="sm" fw="bold" c={isBeneficial ? 'green' : 'red'}>
                This proposal is {isBeneficial ? 'BULLISH' : 'BEARISH'} for MetaDAO
              </Text>
              <Stack gap="0">
                <TextInput
                  type="number"
                  label={`${
                    isBeneficial ? tokens?.meta?.symbol : tokens?.usdc?.symbol
                  } amount to bet`}
                  placeholder="Enter amount..."
                  defaultValue={0}
                  w="100%"
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                <Text fw="lighter" size="sm">
                  Balance: {baseBalance?.uiAmountString || 0} ${tokens?.meta?.symbol}
                </Text>
                <Text fw="lighter" size="sm">
                  Balance: {quoteBalance?.uiAmountString || 0} ${tokens?.usdc?.symbol}
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
                      {isBeneficial ? (
                        <Stack gap={0}>
                          <Text>
                            Places a bid order of {amount} $pUSDC on the pass market, and an
                            equivalent ask of {failAmount} $pMETA on the fail market.
                          </Text>
                          <Text>
                            If the proposal passes, you will receive up to{' '}
                            {numeral(amount / passPrice).format('0.0a')} $META.
                          </Text>
                          <Text>
                            If the proposal fails, you will receive up to{' '}
                            {numeral(amount / failPrice).format('0.0a')} $USDC.
                          </Text>
                        </Stack>
                      ) : (
                        <Stack gap={0}>
                          <Text>
                            Places a bid order of {amount} $fMETA on the pass market, and an
                            equivalent ask of {failAmount} $fUSDC on the fail market.
                          </Text>
                          <Text>
                            If the proposal passes, you will receive up to{' '}
                            {numeral(amount / passPrice).format('0.0a')} $USDC.
                          </Text>
                          <Text>
                            If the proposal fails, you will receive up to{' '}
                            {numeral(amount / failPrice).format('0.0a')} $META.
                          </Text>
                        </Stack>
                      )}
                    </HoverCard.Dropdown>
                  </HoverCard>
                </Grid.Col>
              </Grid>
            </Stack>
          </Fieldset>
        </Container>
      </Group>
    </Stack>
  );
}
