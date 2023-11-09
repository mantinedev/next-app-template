import { useCallback, useState } from 'react';
import {
  Button,
  Fieldset,
  Grid,
  GridCol,
  Group,
  Loader,
  SegmentedControl,
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
  const [orderType, setOrderType] = useState<string>();

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
    <Fieldset>
      <Stack>
        <Text fw="bold" size="lg">
          Pass market
        </Text>
        <Text>{markets.passTwap.twapOracle.expectedValue.toString()}</Text>
        <Stack>
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
        </Stack>
        <SegmentedControl data={['Limit', 'Market']} onChange={(e) => setOrderType(e)} fullWidth />
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
              onClick={() =>
                placeOrder(bidPassAmount, bidPassPrice, orderType === 'Limit', false, true)
              }
              loading={loading}
              fullWidth
            >
              Bid
            </Button>
          </GridCol>
          <GridCol span={6}>
            <Button
              color="red"
              onClick={() =>
                placeOrder(bidPassAmount, bidPassPrice, orderType === 'Limit', true, true)
              }
              loading={loading}
              fullWidth
            >
              Ask
            </Button>
          </GridCol>
        </Grid>
      </Stack>
    </Fieldset>
  );
}
