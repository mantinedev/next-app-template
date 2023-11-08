import { useCallback, useState } from 'react';
import {
  Button,
  Fieldset,
  Grid,
  GridCol,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import Link from 'next/link';
import { IconExternalLink } from '@tabler/icons-react';
import numeral from 'numeral';
import { useProposal } from '../../hooks/useProposal';
import { useTokens } from '../../hooks/useTokens';
import { useTokenAmount } from '../../hooks/useTokenAmount';

export function ProposalDetailCard({ proposalNumber }: { proposalNumber: number }) {
  const { proposal, markets, mintTokens, placeOrder, loading } = useProposal(proposalNumber);
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
  const [bidPassAmount, setBidPassAmount] = useState<number>(0);
  const [bidFailAmount, setBidFailAmount] = useState<number>(0);
  const [bidPassPrice, setBidPassPrice] = useState<number>(0);
  const [bidFailPrice, setBidFailPrice] = useState<number>(0);

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

  return !proposal || !markets ? (
    <Group justify="center">
      <Loader />
    </Group>
  ) : (
    <Stack>
      <Text fw="bolder" size="xl">
        Proposal #{proposal.account.number}
      </Text>
      <Link href={proposal.account.descriptionUrl}>
        <Group gap="sm">
          <Text>Go to description</Text>
          <IconExternalLink />
        </Group>
      </Link>
      <Stack>
        <Group gap="md" justify="space-around" p="md">
          <Fieldset>
            <Stack>
              <Text fw="bold" size="lg">
                Pass market
              </Text>
              <Text>{markets.passTwap.twapOracle.expectedValue.toString()}</Text>
              <Group>
                <Text>
                  Best Bid:{' '}
                  {numeral(markets.passPrice.bid.toString())
                    .divide(10 ** (tokens?.usdc?.decimals || 0))
                    .format('0.00a')}
                </Text>
                <Text>
                  Best Ask:{' '}
                  {numeral(markets.passPrice.ask.toString())
                    .divide(10 ** (tokens?.meta?.decimals || 0))
                    .format('0.00a')}
                </Text>
              </Group>
              <Group>
                <Text>Expected: {markets.passTwap.twapOracle.expectedValue.toString()}</Text>
                <Text>Last: {markets.passTwap.twapOracle.lastObservation.toString()}</Text>
              </Group>
              <TextInput
                type="number"
                label="Bid price"
                placeholder="Enter price..."
                onChange={(e) => setBidPassPrice(Number(e.target.value))}
              />
              <TextInput
                type="number"
                label="Bid amount"
                placeholder="Enter amount..."
                onChange={(e) => setBidPassAmount(Number(e.target.value))}
              />
              <Grid>
                <GridCol span={6}>
                  <Button
                    color="green"
                    onClick={() => placeOrder(bidPassAmount, bidPassPrice, false, true)}
                    loading={loading}
                    fullWidth
                  >
                    Bid
                  </Button>
                </GridCol>
                <GridCol span={6}>
                  <Button
                    color="red"
                    onClick={() => placeOrder(bidPassAmount, bidPassPrice, true, true)}
                    loading={loading}
                    fullWidth
                  >
                    Ask
                  </Button>
                </GridCol>
              </Grid>
            </Stack>
          </Fieldset>
          <Fieldset>
            <Stack>
              <Text fw="bold" size="lg">
                Fail market
              </Text>
              <Text>{markets.failTwap.twapOracle.expectedValue.toString()}</Text>
              <Group>
                <Text>
                  Best Bid:{' '}
                  {numeral(markets.failPrice.bid.toString())
                    .divide(10 ** (tokens?.usdc?.decimals || 0))
                    .format('0.00a')}
                </Text>
                <Text>
                  Best Ask:{' '}
                  {numeral(markets.failPrice.ask.toString())
                    .divide(10 ** (tokens?.meta?.decimals || 0))
                    .format('0.00a')}
                </Text>
              </Group>
              <Group>
                <Text>Expected: {markets.failTwap.twapOracle.expectedValue.toString()}</Text>
                <Text>Last: {markets.failTwap.twapOracle.lastObservation.toString()}</Text>
              </Group>
              <TextInput
                label="Bid price"
                placeholder="Enter price..."
                type="number"
                onChange={(e) => setBidFailPrice(Number(e.target.value))}
              />
              <TextInput
                label="Bid amount"
                placeholder="Enter amount..."
                type="number"
                onChange={(e) => setBidFailAmount(Number(e.target.value))}
              />
              <Grid>
                <GridCol span={6}>
                  <Button
                    fullWidth
                    color="green"
                    onClick={() => placeOrder(bidFailAmount, bidFailPrice, false, false)}
                    loading={loading}
                  >
                    Bid
                  </Button>
                </GridCol>
                <GridCol span={6}>
                  <Button
                    fullWidth
                    color="red"
                    onClick={() => placeOrder(bidFailAmount, bidFailPrice, true, false)}
                    loading={loading}
                  >
                    Ask
                  </Button>
                </GridCol>
              </Grid>
            </Stack>
          </Fieldset>
        </Group>
        <Group justify="space-around">
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
      </Stack>
    </Stack>
  );
}
