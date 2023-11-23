import { useState, useCallback } from 'react';
import {
  ActionIcon,
  Card,
  Stack,
  Text,
  SegmentedControl,
  TextInput,
  Grid,
  GridCol,
  Flex,
  Button,
} from '@mantine/core';
import { Icon12Hours } from '@tabler/icons-react';
import { ConditionalMarketOrderBook } from './ConditionalMarketOrderBook';
import { useOpenbookTwap } from '@/hooks/useOpenbookTwap';
import { Markets, MarketAccountWithKey, ProposalAccountWithKey } from '@/lib/types';

export function ConditionalMarketCard({
  isPassMarket,
  markets,
  proposal,
  placeOrder,
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
}) {
  const [orderType, setOrderType] = useState<string>('Limit');
  const [amount, setAmount] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const { crankMarketTransaction } = useOpenbookTwap();
  const [isCranking, setIsCranking] = useState<boolean>(false);

  const handleCrank = useCallback(
    async () => {
      if (!proposal || !markets) return;
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
        console.log(signature);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCranking(false);
      }
    }, [markets, crankMarketTransaction, proposal]
  );

  return (
    <Stack p={0} m={0} gap={0}>
      <Card withBorder radius="md" style={{ width: '22rem' }}>
        <Flex
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
        <Text fw="bolder" size="lg" style={{ paddingBottom: '1rem' }}>
          {isPassMarket ? 'Pass' : 'Fail'} market
        </Text>
        <Text>
          <ActionIcon
            variant="subtle"
            loading={isCranking}
            onClick={() => handleCrank()}
          >
            <Icon12Hours />
          </ActionIcon>
        </Text>
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
            data={['Limit', 'Market']}
            value={orderType}
            onChange={(e) => setOrderType(e)}
            fullWidth
          />
          <TextInput
            label="Price"
            placeholder="Enter price..."
            type="number"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <TextInput
            label="Amount of META"
            placeholder="Enter amount..."
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Grid>
            <GridCol span={6}>
              <Button
                fullWidth
                color="green"
                onClick={() =>
                  placeOrder(amount, price, orderType === 'Limit', false, isPassMarket)
                }
                disabled={!amount || !price}
              >
                Bid
              </Button>
            </GridCol>
            <GridCol span={6}>
              <Button
                fullWidth
                color="red"
                onClick={() => placeOrder(amount, price, orderType === 'Limit', true, isPassMarket)}
                disabled={!amount || !price}
              >
                Ask
              </Button>
            </GridCol>
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}
