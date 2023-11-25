import { useState, useCallback } from 'react';
import {
  ActionIcon,
  Card,
  Stack,
  Text,
  SegmentedControl,
  TextInput,
  InputBase,
  Grid,
  GridCol,
  Flex,
  Button,
  Tooltip,
  NativeSelect,
  Pill,
} from '@mantine/core';
import { Icon12Hours } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConditionalMarketOrderBook } from './ConditionalMarketOrderBook';
import { useOpenbookTwap } from '@/hooks/useOpenbookTwap';
import { Markets, MarketAccountWithKey, ProposalAccountWithKey } from '@/lib/types';
import { NotificationLink } from '../Layout/NotificationLink';
import { useAutocrat } from '../../contexts/AutocratContext';

export function ConditionalMarketCard({
  isPassMarket,
  markets,
  proposal,
  placeOrder,
  quoteBalance,
  baseBalance,
}: {
  isPassMarket: boolean;
  markets: Markets;
  proposal: ProposalAccountWithKey;
  placeOrder: (
    amount: number,
    price: number,
    limitOrder?: boolean,
    ask?: boolean,
    pass?: boolean,
  ) => void;
  quoteBalance: string | undefined;
  baseBalance: string | undefined;
}) {
  const wallet = useWallet();
  const { fetchOpenOrders } = useAutocrat();
  const [orderType, setOrderType] = useState<string>('Limit');
  const [orderSide, setOrderSide] = useState<string>('Buy');
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const { crankMarketTransaction } = useOpenbookTwap();
  const [isCranking, setIsCranking] = useState<boolean>(false);

  const handleCrank = useCallback(async () => {
    if (!proposal || !markets || !wallet?.publicKey) return;
    let marketAccounts: MarketAccountWithKey = {
      publicKey: markets.passTwap.market,
      account: markets.pass,
    };
    let { eventHeap } = markets.pass;
    if (!isPassMarket) {
      marketAccounts = { publicKey: markets.failTwap.market, account: markets.fail };
      eventHeap = markets.fail.eventHeap;
    }
    try {
      setIsCranking(true);
      const signature = await crankMarketTransaction(marketAccounts, eventHeap);
      if (signature) {
        notifications.show({
          title: 'Transaction Submitted',
          message: <NotificationLink signature={signature} />,
          autoClose: 5000,
        });
        fetchOpenOrders(proposal, wallet.publicKey);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCranking(false);
    }
  }, [markets, proposal, wallet.publicKey, crankMarketTransaction, fetchOpenOrders]);

  return (
    <Stack p={0} m={0} gap={0}>
      <Card withBorder radius="md" style={{ width: '22rem' }}>
        <Flex justify="space-between" align="flex-start" direction="row" wrap="wrap">
          <Text fw="bolder" size="lg" style={{ paddingBottom: '1rem' }}>
            {isPassMarket ? 'Pass' : 'Fail'} market
          </Text>
          <Tooltip label="Crank the market">
            <ActionIcon variant="subtle" loading={isCranking} onClick={() => handleCrank()}>
              <Icon12Hours />
            </ActionIcon>
          </Tooltip>
        </Flex>
        {/* <Text fw="bold">Book</Text> */}
        <Card withBorder style={{ backgroundColor: 'rgb(250, 250, 250)' }}>
          <ConditionalMarketOrderBook
            bids={isPassMarket ? markets.passBids : markets.failBids}
            asks={isPassMarket ? markets.passAsks : markets.failAsks}
          />
        </Card>
        <Stack>
          <SegmentedControl
            style={{ marginTop: '10px' }}
            data={['Buy', 'Sell']}
            value={orderSide}
            onChange={(e) => setOrderSide(e)}
            fullWidth
          />
          <NativeSelect
            style={{ marginTop: '10px' }}
            data={['Limit', 'Market']}
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
          />
          <TextInput
            label="Price"
            placeholder="Enter price..."
            type="number"
            onChange={(e) => setPrice(Number(e.target.value))}
            disabled={orderType === 'Market'}
          />
          <InputBase
            label="Amount of META"
            placeholder="Enter amount..."
            type="number"
            rightSectionPointerEvents="none"
            rightSectionWidth={100}
            rightSection={
              <>
              {orderSide === 'Sell' ?
                (
                  Number(baseBalance) > 0 ? (
                    <Pill>{baseBalance}</Pill>
                  ) : null
                ) : (
                  quoteBalance && price ? (
                    <Pill>
                      {(Number(quoteBalance) / price).toFixed(0)}
                    </Pill>
                  ) : null
                )
              }
              </>
            }
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Grid>
            <GridCol span={12}>
              <Button
                fullWidth
                color={orderSide === 'Sell' ? 'red' : 'green'}
                onClick={() => placeOrder(
                  amount,
                  price,
                  orderType === 'Limit',
                  orderSide === 'Sell',
                  isPassMarket
                  )}
                disabled={!amount || (orderType !== 'Market' ? !price : false)}
              >
                {orderSide} {isPassMarket ? 'p' : 'f'}META
              </Button>
            </GridCol>
          </Grid>
          <Grid>
            <GridCol span={12}>Balance</GridCol>
            <GridCol span={6}>
              {isPassMarket ? 'p' : 'f'}META {baseBalance || null}
            </GridCol>
            <GridCol span={6}>
              {isPassMarket ? 'p' : 'f'}USDC ${quoteBalance || null}
            </GridCol>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
