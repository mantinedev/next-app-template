import { ActionIcon, Button, Group, Loader, Stack, Tabs, Text } from '@mantine/core';
import { Transaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { IconRefresh } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { BN } from '@coral-xyz/anchor';
import { notifications } from '@mantine/notifications';
import { useTokens } from '@/hooks/useTokens';
import { OpenOrdersAccountWithKey, ProposalAccountWithKey, Markets } from '@/lib/types';
import { useProposal } from '@/hooks/useProposal';
import { ProposalOrdersTable } from './ProposalOrdersTable';
import { NotificationLink } from '../Layout/NotificationLink';
import { useOpenbookTwap } from '../../hooks/useOpenbookTwap';
import { useTransactionSender } from '../../hooks/useTransactionSender';

export function ProposalOrdersCard({
  markets,
  orders,
  proposal,
}: {
  markets: Markets;
  orders: OpenOrdersAccountWithKey[];
  proposal: ProposalAccountWithKey;
}) {
  const wallet = useWallet();
  const { tokens } = useTokens();
  const sender = useTransactionSender();
  const { metaDisabled, usdcDisabled, fetchOpenOrders, createTokenAccounts } = useProposal({
    fromNumber: proposal.account.number,
  });
  const { settleFundsTransactions, closeOpenOrdersAccountTransactions } = useOpenbookTwap();
  const [isSettling, setIsSettling] = useState<boolean>(false);

  const genericOrdersHeaders = [
    'Order ID',
    'Market',
    'Status',
    'Side',
    'Quantity',
    'Price',
    'Amount',
    'Actions',
  ];

  const unsettledOrdersHeaders = [
    'Order ID',
    'Market',
    `Amount ${tokens?.meta?.symbol}`,
    `Amount ${tokens?.usdc?.symbol}`,
    'Settle',
    'Close',
  ];

  const handleSettleFunds = useCallback(
    async (ordersToSettle: OpenOrdersAccountWithKey[], passMarket: boolean) => {
      if (!proposal || !markets) return;

      const txs = (
        await Promise.all(
          ordersToSettle.map((order) =>
            settleFundsTransactions(
              new BN(order.account.accountNum),
              passMarket,
              proposal,
              proposal.account.openbookPassMarket.equals(order.account.market)
                ? { publicKey: proposal.account.openbookPassMarket, account: markets.pass }
                : { publicKey: proposal.account.openbookFailMarket, account: markets.fail },
            ),
          ),
        )
      )
        .flat()
        .filter(Boolean)
        .concat(
          (
            await Promise.all(
              ordersToSettle.map((order) =>
                closeOpenOrdersAccountTransactions(new BN(order.account.accountNum)),
              ),
            )
          )
            .flat()
            .filter(Boolean),
        );

      if (!wallet.publicKey || !txs) return;

      try {
        setIsSettling(true);
        const txSignatures = await sender.send(txs as Transaction[]);
        txSignatures.map((sig) =>
          notifications.show({
            title: 'Transaction Submitted',
            message: <NotificationLink signature={sig} />,
            autoClose: 5000,
          }),
        );
        await fetchOpenOrders(proposal, wallet.publicKey!);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSettling(false);
      }
    },
    [proposal, settleFundsTransactions, fetchOpenOrders, sender],
  );

  const filterEmptyOrders = (): OpenOrdersAccountWithKey[] =>
    orders.filter((order) => {
      if (order.account.openOrders[0].isFree === 1) {
        return order;
      }
      return null;
    });

  const unsettledOrdersDescription = () => (
    <Stack>
      <Text size="sm">
        These are your Order Accounts (OpenBook uses a{' '}
        <a
          href="https://twitter.com/openbookdex/status/1727309884159299929?s=61&t=Wv1hCdAly84RMB_iLO0iIQ"
          target="_blank"
          rel="noreferrer"
        >
          crank
        </a>{' '}
        and to do that when you place an order you create an account for that order). If you see a
        balance here you can settle the balance (to have it returned to your wallet for futher use
        while the proposal is active). Once settled, you can close the account to reclaim the SOL.
        <br />
        <br />
        If you&apos;re unable to settle your account, you may not have a token account for the
        respective pass / fail tokens. Use the buttons below to create the conditional token
        accounts.
      </Text>
      <Group>
        <Button disabled={metaDisabled} onClick={() => createTokenAccounts(true)}>
          Conditional META
        </Button>
        <Button disabled={usdcDisabled} onClick={() => createTokenAccounts(false)}>
          Conditional USDC
        </Button>
      </Group>
      <Group>
        <Button
          loading={isSettling}
          onClick={() =>
            handleSettleFunds(
              filterEmptyOrders(),
              proposal.account.openbookFailMarket.equals(markets.passTwap.market),
            )
          }
        >
          Settle all orders
        </Button>
      </Group>
    </Stack>
  );

  // const filterPartiallyFilledOrders = (): OpenOrdersAccountWithKey[] =>
  //   orders.filter((order) => {
  //     if (order.account.openOrders[0].isFree === 0) {
  //       if (order.account.position.baseFreeNative.toNumber() > 0) {
  //         return order;
  //       }
  //       if (order.account.position.quoteFreeNative.toNumber() > 0) {
  //         return order;
  //       }
  //       return null;
  //     }
  //     return null;
  //   });

  const filterOpenOrders = (): OpenOrdersAccountWithKey[] =>
    orders.filter((order) => {
      if (order.account.openOrders[0].isFree === 0) {
        const passAsksFilter = markets.passAsks.filter(
          (_order) => _order.owner.toString() === order.publicKey.toString(),
        );
        const passBidsFilter = markets.passBids.filter(
          (_order) => _order.owner.toString() === order.publicKey.toString(),
        );
        const failAsksFilter = markets.failAsks.filter(
          (_order) => _order.owner.toString() === order.publicKey.toString(),
        );
        const failBidsFilter = markets.failBids.filter(
          (_order) => _order.owner.toString() === order.publicKey.toString(),
        );
        let _order = null;
        if (failAsksFilter.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          _order = failAsksFilter[0];
        }
        if (failBidsFilter.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          _order = failBidsFilter[0];
        }
        if (passAsksFilter.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          _order = passAsksFilter[0];
        }
        if (passBidsFilter.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          _order = passBidsFilter[0];
        }
        if (_order !== null) {
          return order;
        }
        return null;
      }
      return null;
    });

  const filterCompletedOrders = (): OpenOrdersAccountWithKey[] => {
    const openOrders = filterOpenOrders();
    const emptyAccounts = filterEmptyOrders();
    let filteredOrders = orders;
    if (openOrders.length > 0) {
      const openOrderKeys = openOrders.map((_order) => _order.publicKey.toString());
      filteredOrders = orders.filter(
        (order) => !openOrderKeys.includes(order.publicKey.toString()),
      );
    }
    if (emptyAccounts.length > 0) {
      const emptyAccountKeys = emptyAccounts.map((_order) => _order.publicKey.toString());
      filteredOrders = filteredOrders.filter(
        (order) => !emptyAccountKeys.includes(order.publicKey.toString()),
      );
    }
    if (emptyAccounts.length > 0 || openOrders.length > 0) {
      return filteredOrders.filter((elem, index, self) => index === self.indexOf(elem));
    }
    return [];
  };

  return !proposal || !markets || !orders ? (
    <Group justify="center">
      <Loader />
    </Group>
  ) : (
    <Tabs defaultValue="open">
      <Tabs.List>
        <Tabs.Tab value="open">Open Orders</Tabs.Tab>
        <Tabs.Tab value="uncranked">Uncranked Orders</Tabs.Tab>
        <Tabs.Tab value="unsettled">Unsettled Orders</Tabs.Tab>
        <ActionIcon
          variant="subtle"
          // @ts-ignore
          onClick={() => fetchOpenOrders(proposal, wallet.publicKey)}
        >
          <IconRefresh />
        </ActionIcon>
      </Tabs.List>
      <Tabs.Panel value="open">
        <ProposalOrdersTable
          heading="Open Orders"
          description="If you see orders here with a settle button, you can settle them to redeem the partial fill amount. These exist
            when there is a balance available within the Open Orders Account."
          headers={genericOrdersHeaders}
          orders={filterOpenOrders()}
          proposal={proposal}
          orderStatus="open"
          markets={markets}
          settleOrders={handleSettleFunds}
        />
      </Tabs.Panel>
      <Tabs.Panel value="uncranked">
        <ProposalOrdersTable
          heading="Uncranked Orders"
          description=" If you see orders here, you can use the cycle icon with the 12 on it next to the
            respective market which will crank it and push the orders into the Unsettled, Open
            Accounts below."
          headers={genericOrdersHeaders}
          orders={filterCompletedOrders()}
          proposal={proposal}
          orderStatus="uncranked"
          markets={markets}
          settleOrders={handleSettleFunds}
        />
      </Tabs.Panel>
      <Tabs.Panel value="unsettled">
        <ProposalOrdersTable
          heading="Unsettled Orders"
          description={unsettledOrdersDescription()}
          headers={unsettledOrdersHeaders}
          orders={filterEmptyOrders()}
          proposal={proposal}
          orderStatus="closed"
          markets={markets}
          settleOrders={handleSettleFunds}
        />
      </Tabs.Panel>
    </Tabs>
  );
}
