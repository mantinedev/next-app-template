import { useCallback, useState } from 'react';
import {
  Button,
  Container,
  Fieldset,
  Grid,
  GridCol,
  Group,
  Loader,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import numeral from 'numeral';
import { useProposal } from '../../hooks/useProposal';
import { useTokens } from '../../hooks/useTokens';
import { useTokenAmount } from '../../hooks/useTokenAmount';
import { ProposalAccountWithKey } from '../../lib/types';
import { useTokenMint } from '../../hooks/useTokenMint';

export function MarketCard({ proposal: fromProposal }: { proposal: ProposalAccountWithKey }) {
  const { proposal, markets, mintTokensTransactions, placeOrder, loading } = useProposal({
    fromProposal,
  });
  const [mintBaseAmount, setMintBaseAmount] = useState<number>();
  const [mintQuoteAmount, setMintQuoteAmount] = useState<number>();
  const { amount: baseBalance } = useTokenAmount(markets?.baseVault.underlyingTokenMint);
  const { amount: basePassBalance } = useTokenAmount(
    markets?.baseVault.conditionalOnFinalizeTokenMint,
  );
  const { amount: baseFailBalance } = useTokenAmount(
    markets?.baseVault.conditionalOnRevertTokenMint,
  );
  const { amount: quoteBalance } = useTokenAmount(markets?.quoteVault.underlyingTokenMint);
  const { amount: quotePassBalance } = useTokenAmount(
    markets?.quoteVault.conditionalOnFinalizeTokenMint,
  );
  const { amount: quoteFailBalance } = useTokenAmount(
    markets?.quoteVault.conditionalOnRevertTokenMint,
  );
  const { tokens } = useTokens();
  const { mint } = useTokenMint(tokens?.meta?.publicKey);
  const [passPrice, setPassPrice] = useState<number>(0);
  const [failPrice, setFailPrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [usingBase, setUsingBase] = useState<boolean>(true);

  console.log(mint);

  const baseSupply =
    numeral(mint?.supply || 0)
      .divide(10 ** (mint?.decimals || 0))
      .value() || 0;
  const marketPassPrice =
    numeral(markets?.passPrice.ask.toString() || 0)
      .divide(10 ** (tokens?.meta?.decimals || 0))
      .add(
        numeral(markets?.passPrice.bid.toString() || 0).divide(10 ** (tokens?.usdc?.decimals || 0)),
      )
      .divide(2)
      .value() || 0;
  const marketFailPrice =
    numeral(markets?.failPrice.ask.toString() || 0)
      .divide(10 ** (tokens?.meta?.decimals || 0))
      .add(
        numeral(markets?.failPrice.bid.toString() || 0).divide(10 ** (tokens?.usdc?.decimals || 0)),
      )
      .divide(2)
      .value() || 0;
  // const beliefPrice = ;

  const handleBet = useCallback(async () => {
    const mintTxs = await mintTokensTransactions(amount, usingBase);
    if (!mintTxs) return;
    console.log(mintTxs);
  }, [usingBase, mintTokensTransactions, amount, mintQuoteAmount]);

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
              <Title>
                {marketPassPrice} ${tokens?.usdc?.symbol}
              </Title>
            </Stack>
          </Fieldset>
        </Container>
        <Container size="3xs">
          <Fieldset>
            <Stack align="center">
              <Title order={3} c="red">
                On FAIL
              </Title>
              <Text>The market thinks it will change the value of the DAO by</Text>
              <Title>
                {marketPassPrice} ${tokens?.usdc?.symbol}
              </Title>
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
                    {passPrice * baseSupply} ${tokens?.usdc?.symbol}
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
                    {failPrice * baseSupply} ${tokens?.usdc?.symbol}
                  </Text>
                </Text>
              </Stack>
              <Stack gap="0">
                <Text size="sm" fw="bold">
                  Token to bet with
                </Text>
                <SegmentedControl
                  title="Token to bet with"
                  data={['META', 'USDC']}
                  onChange={(e) => setUsingBase(e === 'META')}
                />
                <TextInput
                  type="number"
                  label={`${usingBase ? tokens?.meta?.symbol : tokens?.usdc?.symbol} amount to bet`}
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
              <Button
                onClick={handleBet}
                loading={loading}
                fullWidth
                disabled={
                  (usingBase && amount > (baseBalance?.uiAmount || 0)) ||
                  (!usingBase && amount > (quoteBalance?.uiAmount || 0))
                }
              >
                Bet
              </Button>
            </Stack>
          </Fieldset>
        </Container>
      </Group>
    </Stack>
  );
}
