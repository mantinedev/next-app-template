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
  HoverCard,
  Group,
  InputLabel,
} from '@mantine/core';
import numeral from 'numeral';
import { Icon12Hours, IconQuestionMark, IconWallet } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConditionalMarketOrderBook } from './ConditionalMarketOrderBook';
import { useOpenbookTwap } from '@/hooks/useOpenbookTwap';
import { Markets, MarketAccountWithKey, ProposalAccountWithKey } from '@/lib/types';
import { NotificationLink } from '../Layout/NotificationLink';
import { useAutocrat } from '../../contexts/AutocratContext';
import { calculateTWAP } from '../../lib/openbookTwap';
import { NUMERAL_FORMAT } from '../../lib/constants';

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
  const { daoState, fetchOpenOrders } = useAutocrat();
  const [orderType, setOrderType] = useState<string>('Limit');
  const [orderSide, setOrderSide] = useState<string>('Buy');
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<string>('');
  const [priceError, setPriceError] = useState<string | null>(null);
  const [amountError, setAmountError] = useState<string | null>(null);
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

  const passTwap = calculateTWAP(markets.passTwap.twapOracle);
  const failTwap = calculateTWAP(markets.failTwap.twapOracle);
  const twap = isPassMarket ? passTwap : failTwap;
  const _orderPrice = () => {
    if (orderType === 'Limit') {
      if (Number(price) > 0) {
        return Number(price);
      }
      return 0;
    }
      if (orderSide === 'Sell') {
        return 0;
      }
        return Number.MAX_SAFE_INTEGER;
  };

  const priceValidator = (value: string) => {
    if (orderType === 'Limit') {
      if (Number(value) > 0) {
        setPriceError(null);
      } else {
        setPriceError('Enter a value greater than 0');
      }
    }
  };

  const amountValidator = (value: number) => {
    if (value > 0) {
      setAmountError(null);
    } else {
      setAmountError('You must enter a whole number');
    }
  };

  return (
    <Stack p={0} m={0} gap={0}>
      <Card withBorder radius="md" style={{ width: '22rem' }}>
        <Flex justify="space-between" align="flex-start" direction="row" wrap="wrap">
          <Group align="center">
            <Text fw="bolder" size="lg" pb="1rem">
              {isPassMarket ? 'Pass' : 'Fail'} market{' '}
            </Text>
            {twap ? (
              <HoverCard>
                <HoverCard.Target>
                  <Group justify="center" align="flex-start">
                    <Text size="lg" pb="1rem">
                      TWAP@${numeral(twap).format(NUMERAL_FORMAT)}
                    </Text>
                    <ActionIcon variant="transparent">
                      <IconQuestionMark />
                    </ActionIcon>
                  </Group>
                </HoverCard.Target>
                <HoverCard.Dropdown w="22rem">
                  <Text>
                    The Time Weighted Average Price (TWAP) is the measure used to decide if the
                    proposal passses: if the TWAP of the pass market is{' '}
                    {daoState
                      ? `${numeral(daoState.passThresholdBps / 100).format(NUMERAL_FORMAT)}%`
                      : '???'}{' '}
                    above the fail market{' '}
                    {daoState && failTwap
                      ? `(> ${numeral(
                          (failTwap * (10000 + daoState.passThresholdBps)) / 10000,
                        ).format(NUMERAL_FORMAT)})`
                      : null}
                    , the proposal will pass once the countdown ends.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            ) : null}
          </Group>
          <Tooltip label="Crank the market 🐷">
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
            value={orderType === 'Market' ? '' : price}
            disabled={orderType === 'Market'}
            error={priceError}
            onChange={(e) => {
              setPrice(e.target.value);
              priceValidator(e.target.value);
            }}
          />
          <TextInput
            label={
              <>
              <Flex justify="space-between" align="flex-start" direction="row" wrap="wrap">
                <InputLabel>
                  Amount of META
                </InputLabel>
                <Group>
                  <Text size="xs" pl={0}>
                  <IconWallet height={12} />
                  {
                    orderSide === 'Sell' ?
                      (`${isPassMarket ? 'p' : 'f'}META ${baseBalance || null}`)
                     :
                      (`${isPassMarket ? 'p' : 'f'}USDC $${quoteBalance || null}`)
                  }
                  </Text>
                </Group>
              </Flex>
              </>
            }
            placeholder="Enter amount..."
            type="number"
            rightSectionPointerEvents="none"
            rightSectionWidth={100}
            rightSection={
              <>
                <Pill style={{ verticalAlign: 'center' }}>
                  Max{' '}{
                    orderSide === 'Sell' ? (
                      Number(baseBalance) > 0 ? (
                       baseBalance
                      ) : null
                    ) : quoteBalance && price ? (
                      (Number(quoteBalance) / Number(price)).toFixed(0)
                    ) : null
                  }
                </Pill>
              </>
            }
            error={amountError}
            onChange={(e) => {
              setAmount(Number(e.target.value));
              amountValidator(Number(e.target.value));
            }}
          />
          <Grid>
            <GridCol span={12}>
              <Button
                fullWidth
                color={orderSide === 'Sell' ? 'red' : 'green'}
                onClick={() =>
                  placeOrder(
                    amount,
                    _orderPrice(),
                    orderType === 'Limit',
                    orderSide === 'Sell',
                    isPassMarket,
                  )
                }
                variant="light"
                disabled={!amount || (orderType !== 'Market' ? !price : false)}
              >
                {orderSide} {isPassMarket ? 'p' : 'f'}META
              </Button>
            </GridCol>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
