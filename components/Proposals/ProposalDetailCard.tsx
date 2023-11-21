import { useCallback, useMemo, useState } from 'react';
import {
  ActionIcon,
  Button,
  Fieldset,
  Grid,
  GridCol,
  Group,
  Loader,
  Progress,
  SegmentedControl,
  Stack,
  Table,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { IconExternalLink, IconRefresh, IconTrash, Icon3dRotate } from '@tabler/icons-react';
import numeral from 'numeral';
import { BN } from '@coral-xyz/anchor';
import { useProposal } from '@/hooks/useProposal';
import { useTokens } from '@/hooks/useTokens';
import { useTokenAmount } from '@/hooks/useTokenAmount';
import { TWAPOracle, OpenOrdersAccountWithKey, LeafNode } from '@/lib/types';
import { NUMERAL_FORMAT } from '@/lib/constants';
import { useOpenbookTwap } from '@/hooks/useOpenbookTwap';
import { useTransactionSender } from '@/hooks/useTransactionSender';
import { useExplorerConfiguration } from '@/hooks/useExplorerConfiguration';

export function ProposalDetailCard({ proposalNumber }: { proposalNumber: number }) {
  const theme = useMantineTheme();
  const { cancelOrderTransactions, settleFundsTransactions } = useOpenbookTwap();
  const { generateExplorerLink } = useExplorerConfiguration();
  const sender = useTransactionSender();
  const wallet = useWallet();
  const { proposal, markets, orders, mintTokens, placeOrder, loading, fetchOrders } = useProposal({
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
  const [passAmount, setPassAmount] = useState<number>(0);
  const [failAmount, setFailAmount] = useState<number>(0);
  const [passPrice, setPassPrice] = useState<number>(0);
  const [failPrice, setFailPrice] = useState<number>(0);
  const [orderType, setOrderType] = useState<string>('Limit');
  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const [isSettling, setIsSettling] = useState<boolean>(false);

  const orderbook = useMemo(() => {
    if (!markets) return;

    const getSide = (side: LeafNode[], bids?: boolean) => {
      if (side.length === 0) {
        return null;
      }
      const parsed = side.map((e) => ({
        price: e.key.shrn(64).toNumber() * 0.0001,
        size: e.quantity.toNumber(),
      }));
      const total = parsed.reduce((a, b) => ({
        price: a.price + b.price,
        size: a.size + b.size,
      }));
      return { parsed: bids ? parsed.toReversed() : parsed, total };
    };

    return {
      pass: { asks: getSide(markets.passAsks), bids: getSide(markets.passBids, true) },
      fail: { asks: getSide(markets.failAsks), bids: getSide(markets.failBids, true) },
    };
  }, [markets]);

  const handleCancel = useCallback(
    async (order: OpenOrdersAccountWithKey) => {
      if (!proposal || !markets) return;

      const txs = await cancelOrderTransactions(
        new BN(order.account.accountNum),
        proposal.account.openbookPassMarket.equals(order.account.market)
          ? { publicKey: proposal.account.openbookPassMarket, account: markets.pass }
          : { publicKey: proposal.account.openbookFailMarket, account: markets.fail },
      );

      if (!wallet.publicKey || !txs) return;

      try {
        setIsCanceling(true);
        await sender.send(txs);
        setTimeout(() => fetchOrders(), 3000);
      } finally {
        setIsCanceling(false);
      }
    },
    [proposal, cancelOrderTransactions, fetchOrders, sender],
  );

  const handleSettleFunds = useCallback(
    async (order: OpenOrdersAccountWithKey) => {
      if (!proposal || !markets) return;
      const txs = await settleFundsTransactions(
        new BN(order.account.accountNum),
        proposal.account.openbookPassMarket.equals(order.account.market)
          ? { publicKey: proposal.account.openbookPassMarket, account: markets.pass }
          : { publicKey: proposal.account.openbookFailMarket, account: markets.fail },
      );
      if (!wallet.publicKey || !txs) return;
      try {
        setIsSettling(true);
        await sender.send(txs);
        setTimeout(() => fetchOrders(), 3000);
      } finally {
        setIsSettling(false);
      }
    },
    [proposal, settleFundsTransactions, fetchOrders, sender],
  );

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

  const calculateTWAP = (twapOracle: TWAPOracle) => {
    const slotsPassed = twapOracle.lastUpdatedSlot.sub(twapOracle.initialSlot);
    const twapValue = twapOracle.observationAggregator.div(slotsPassed);
    return numeral(twapValue.toString()).divide(10_000).format('0.0000a');
  };

  const passTwap = markets ? calculateTWAP(markets.passTwap.twapOracle) : null;
  const failTwap = markets ? calculateTWAP(markets.failTwap.twapOracle) : null;

  return !proposal || !markets ? (
    <Group justify="center">
      <Loader />
    </Group>
  ) : (
    <Stack gap="0">
      <Text fw="bolder" size="xl">
        Proposal #{proposal.account.number + 1}
      </Text>
      <Link href={proposal.account.descriptionUrl}>
        <Group gap="sm">
          <Text>Go to description</Text>
          <IconExternalLink />
        </Group>
      </Link>
      <Stack>
        <Group gap="md" justify="space-around" p="sm">
          <Fieldset>
            <Stack gap="sm">
              <Text fw="bold" size="lg">
                Pass market
              </Text>
              <Stack>
                <Group>
                  <Text>
                    Best Bid:{' '}
                    {numeral(markets.passPrice.bid.toString())
                      // .divide(10 ** (tokens?.usdc?.decimals || 0))
                      .format('0.00a')}
                  </Text>
                  <Text>
                    Best Ask:{' '}
                    {numeral(markets.passPrice.ask.toString())
                      // .divide(10 ** (tokens?.meta?.decimals || 0))
                      .format('0.00a')}
                  </Text>
                </Group>
                <Group>
                  <Text>TWAP: {passTwap}</Text>
                </Group>
              </Stack>
              <SegmentedControl
                data={['Limit', 'Market']}
                value={orderType}
                onChange={(e) => setOrderType(e)}
                fullWidth
              />
              <TextInput
                type="number"
                label="Bid price"
                placeholder="Enter price..."
                onChange={(e) => setPassPrice(Number(e.target.value))}
              />
              <TextInput
                type="number"
                label="Bid amount"
                placeholder="Enter amount..."
                onChange={(e) => setPassAmount(Number(e.target.value))}
              />
              <Grid>
                <GridCol span={6}>
                  <Button
                    color="green"
                    onClick={() =>
                      placeOrder(passAmount, passPrice, orderType === 'Limit', false, true)
                    }
                    loading={loading}
                    disabled={!passAmount || !passPrice}
                    fullWidth
                  >
                    Bid
                  </Button>
                </GridCol>
                <GridCol span={6}>
                  <Button
                    color="red"
                    onClick={() =>
                      placeOrder(passAmount, passPrice, orderType === 'Limit', true, true)
                    }
                    loading={loading}
                    disabled={!passAmount || !passPrice}
                    fullWidth
                  >
                    Ask
                  </Button>
                </GridCol>
              </Grid>
              <Stack gap="0">
                <Text fw="lighter" size="sm" c="green">
                  Balance: {basePassAmount?.uiAmountString || 0} $p{tokens?.meta?.symbol}
                </Text>
                <Text fw="lighter" size="sm" c="green">
                  Balance: {quotePassAmount?.uiAmountString || 0} $p{tokens?.usdc?.symbol}
                </Text>
              </Stack>
            </Stack>
          </Fieldset>
          <Fieldset>
            <Stack gap="sm">
              <Text fw="bold" size="lg">
                Fail market
              </Text>
              <Stack>
                <Group>
                  <Text>
                    Best Bid:{' '}
                    {numeral(markets.failPrice.bid.toString())
                      // .divide(10 ** (tokens?.usdc?.decimals || 0))
                      .format('0.00a')}
                  </Text>
                  <Text>
                    Best Ask:{' '}
                    {numeral(markets.failPrice.ask.toString())
                      // .divide(10 ** (tokens?.meta?.decimals || 0))
                      .format('0.00a')}
                  </Text>
                </Group>
                <Group>
                  <Text>TWAP: {failTwap}</Text>
                </Group>
              </Stack>
              <SegmentedControl
                data={['Limit', 'Market']}
                value={orderType}
                onChange={(e) => setOrderType(e)}
                fullWidth
              />
              <TextInput
                label="Bid price"
                placeholder="Enter price..."
                type="number"
                onChange={(e) => setFailPrice(Number(e.target.value))}
              />
              <TextInput
                label="Bid amount"
                placeholder="Enter amount..."
                type="number"
                onChange={(e) => setFailAmount(Number(e.target.value))}
              />
              <Grid>
                <GridCol span={6}>
                  <Button
                    fullWidth
                    color="green"
                    onClick={() =>
                      placeOrder(failAmount, failPrice, orderType === 'Limit', false, false)
                    }
                    loading={loading}
                    disabled={!failAmount || !failPrice}
                  >
                    Bid
                  </Button>
                </GridCol>
                <GridCol span={6}>
                  <Button
                    fullWidth
                    color="red"
                    onClick={() =>
                      placeOrder(failAmount, failPrice, orderType === 'Limit', true, false)
                    }
                    loading={loading}
                    disabled={!failAmount || !failPrice}
                  >
                    Ask
                  </Button>
                </GridCol>
              </Grid>
              <Stack gap="0">
                <Text fw="lighter" size="sm" c="red">
                  Balance: {baseFailAmount?.uiAmountString || 0} $f{tokens?.meta?.symbol}
                </Text>
                <Text fw="lighter" size="sm" c="red">
                  Balance: {quoteFailAmount?.uiAmountString || 0} $f{tokens?.usdc?.symbol}
                </Text>
              </Stack>
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
        {orderbook ? (
          <Group justify="space-around" align="start">
            <Stack p={0} m={0} gap={0}>
              <Text fw="bolder" size="lg">
                Pass market orderbook
              </Text>
              <Group gap="0">
                {orderbook.pass.asks?.parsed.map((ask) => (
                  <Grid w="100%" gutter={0} mih="md">
                    <Grid.Col span={1} h="sm" p="0">
                      <Text size="0.6rem">{numeral(ask.price).format(NUMERAL_FORMAT)}</Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Progress
                        key={ask.price + ask.size}
                        value={
                          orderbook.pass.asks
                            ? Math.ceil((ask.price / orderbook.pass.asks.total.price) * 100)
                            : 0
                        }
                        color="red"
                        w="100%"
                      />
                    </Grid.Col>
                  </Grid>
                ))}
                {orderbook.pass.bids?.parsed.map((bid) => (
                  <Grid w="100%" gutter={0} mih="md">
                    <Grid.Col span={1} h="sm" p="0">
                      <Text size="0.6rem">{numeral(bid.price).format(NUMERAL_FORMAT)}</Text>
                    </Grid.Col>
                    <Grid.Col span="auto">
                      <Progress
                        key={bid.price + bid.size}
                        value={
                          orderbook.pass.bids
                            ? Math.ceil((bid.price / orderbook.pass.bids.total.price) * 100)
                            : 0
                        }
                        color="green"
                        w="100%"
                      />
                    </Grid.Col>
                    <Grid.Col span={1} h="sm" p="0">
                      <Text size="0.6rem">{numeral(bid.price).format(NUMERAL_FORMAT)}</Text>
                    </Grid.Col>
                    <Grid.Col span={3} h="sm" p="0" />
                  </Grid>
                ))}
              </Group>
            </Stack>
            <Stack p={0} m={0} gap={0}>
              <Text fw="bolder" size="lg">
                Fail market orderbook
              </Text>
              <Group gap="0">
                {orderbook.fail.asks?.parsed.map((ask) => (
                  <Grid w="100%" gutter={0} mih="md">
                    <Grid.Col span={1} h="sm" p="0">
                      <Text size="0.6rem">{numeral(ask.price).format(NUMERAL_FORMAT)}</Text>
                    </Grid.Col>
                    <Grid.Col span={3}>
                      <Progress
                        key={ask.price + ask.size}
                        value={
                          orderbook.fail.asks
                            ? Math.ceil((ask.price / orderbook.fail.asks.total.price) * 100)
                            : 0
                        }
                        color="red"
                        w="100%"
                      />
                    </Grid.Col>
                  </Grid>
                ))}
                {orderbook.fail.bids?.parsed.map((bid) => (
                  <Grid w="100%" gutter={0} mih="md">
                    <Grid.Col span={1} h="sm" p="0">
                      <Text size="0.6rem">{numeral(bid.price).format(NUMERAL_FORMAT)}</Text>
                    </Grid.Col>
                    <Grid.Col span="auto">
                      <Progress
                        key={bid.price + bid.size}
                        value={
                          orderbook.fail.bids
                            ? Math.ceil((bid.price / orderbook.fail.bids.total.price) * 100)
                            : 0
                        }
                        color="green"
                        w="100%"
                      />
                    </Grid.Col>
                    <Grid.Col span={1} h="sm" p="0">
                      <Text size="0.6rem">{numeral(bid.price).format(NUMERAL_FORMAT)}</Text>
                    </Grid.Col>
                    <Grid.Col span={3} h="sm" p="0" />
                  </Grid>
                ))}
              </Group>
            </Stack>
          </Group>
        ) : null}
        {proposal && orders ? (
          <Stack>
            <Group justify="space-between">
              <Text fw="bolder" size="xl">
                Orders
              </Text>
              <ActionIcon variant="subtle" onClick={() => fetchOrders()}>
                <IconRefresh />
              </ActionIcon>
            </Group>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Order ID</Table.Th>
                  <Table.Th>Market</Table.Th>
                  <Table.Th>Side</Table.Th>
                  <Table.Th>Quantity</Table.Th>
                  <Table.Th>Price</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {orders.map((order) => {
                  const pass = order.account.market.equals(proposal.account.openbookPassMarket);
                  const bids = order.account.position.bidsBaseLots.gt(
                    order.account.position.asksBaseLots,
                  );
                  return (
                    (
                      (order.account.openOrders[0].isFree === 0)
                    ) ? (
                     <Table.Tr key={order.publicKey.toString()}>
                      <Table.Td>
                        <a href={generateExplorerLink(order.publicKey.toString(), 'account')} target="_blank" rel="noreferrer">
                          {order.account.accountNum}
                        </a>
                      </Table.Td>
                      <Table.Td c={pass ? theme.colors.green[9] : theme.colors.red[9]}>
                        {pass ? 'PASS' : 'FAIL'}
                      </Table.Td>
                      <Table.Td c={bids ? theme.colors.green[9] : theme.colors.red[9]}>
                        {bids ? 'BID' : 'ASK'}
                      </Table.Td>
                      <Table.Td>
                        {numeral(
                          bids
                            ? order.account.position.bidsBaseLots.toString()
                            : order.account.position.asksBaseLots.toString(),
                        ).format(NUMERAL_FORMAT)}
                      </Table.Td>
                      <Table.Td>
                        ${
                          (parseFloat(order.account.openOrders[0].lockedPrice.toNumber()) / 10000)
                        }
                      </Table.Td>
                      <Table.Td>
                        ${ bids ?
                          (
                            (order.account.position.bidsBaseLots.toNumber()
                            * order.account.openOrders[0].lockedPrice.toNumber()) / 10000
                          )
                          :
                          (
                            (order.account.position.asksBaseLots.toNumber()
                            * order.account.openOrders[0].lockedPrice.toNumber()) / 10000
                          )
                        }
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          variant="subtle"
                          loading={isCanceling}
                          onClick={() => handleCancel(order)}
                        >
                          <IconTrash />
                        </ActionIcon>
                      </Table.Td>
                     </Table.Tr>)
                    : (
                      <Table.Tr key={order.publicKey.toString()}>
                       <Table.Td>
                         <a href={generateExplorerLink(order.publicKey.toString(), 'account')} target="_blank" rel="noreferrer">
                           {order.account.accountNum}
                         </a>
                       </Table.Td>
                       <Table.Td c={pass ? theme.colors.green[9] : theme.colors.red[9]}>
                         {pass ? 'PASS' : 'FAIL'}
                       </Table.Td>
                       <Table.Td c={bids ? theme.colors.green[9] : theme.colors.red[9]}>
                         {bids ? 'BID' : 'ASK'}
                       </Table.Td>
                       <Table.Td>
                        UNKNOWN
                       </Table.Td>
                       <Table.Td>
                        UNKNOWN
                       </Table.Td>
                       <Table.Td>
                        UNKNOWN
                       </Table.Td>
                       <Table.Td>
                         <ActionIcon
                           variant="subtle"
                           loading={isSettling}
                           onClick={() => handleSettleFunds(order)}
                         >
                           <Icon3dRotate />
                         </ActionIcon>
                       </Table.Td>
                      </Table.Tr>)
                  );
                })}
              </Table.Tbody>
            </Table>
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
}
