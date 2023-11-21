import { useState } from 'react';
import {
  Card,
  Stack,
  Text,
  SegmentedControl,
  TextInput,
  Grid,
  GridCol,
  Button,
} from '@mantine/core';
import { ConditionalMarketOrderBook } from './ConditionalMarketOrderBook';
import { Markets } from '@/lib/types';

export function ConditionalMarketCard({
  isPassMarket,
  markets,
  placeOrder,
}: {
  isPassMarket: boolean;
  markets: Markets;
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

  return (
    <Stack p={0} m={0} gap={0}>
      <Card withBorder radius="md" style={{ width: '22rem' }}>
        <Text fw="bolder" size="lg" style={{ paddingBottom: '1rem' }}>
          {isPassMarket ? 'Pass' : 'Fail'} market
        </Text>
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
