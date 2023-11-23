import { useCallback, useState } from 'react';
import { ActionIcon, Group, Stack, Table, Text, useMantineTheme } from '@mantine/core';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { IconRefresh, IconTrash, Icon3dRotate, IconAssemblyOff } from '@tabler/icons-react';
import numeral from 'numeral';
import { useTokens } from '@/hooks/useTokens';
import { useExplorerConfiguration } from '@/hooks/useExplorerConfiguration';
import { OpenOrdersAccountWithKey, ProposalAccountWithKey, Markets } from '@/lib/types';
import { useProposal } from '@/hooks/useProposal';
import { useOpenbookTwap } from '@/hooks/useOpenbookTwap';
import { useTransactionSender } from '@/hooks/useTransactionSender';
import { useWeb3 } from '@/hooks/useWeb3';
import { NUMERAL_FORMAT } from '@/lib/constants';

export function ProposalOrdersCard({
  markets,
  orders,
  proposal,
}: {
  markets: Markets;
  orders: OpenOrdersAccountWithKey[];
  proposal: ProposalAccountWithKey;
}) {
  const theme = useMantineTheme();

  const sender = useTransactionSender();
  const wallet = useWallet();
  const { tokens } = useTokens();
  const { fetchOpenOrders } = useProposal({
    fromNumber: proposal.account.number,
  });
  const { cancelOrderTransactions, settleFundsTransactions } = useOpenbookTwap();
  const { generateExplorerLink } = useExplorerConfiguration();
  const { closeOrderAccount } = useWeb3();

  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const [isSettling, setIsSettling] = useState<boolean>(false);

  const filterEmpyOrders = (): OpenOrdersAccountWithKey[] =>
    orders.filter((order) => {
      if (order.account.openOrders[0].isFree === 1) {
        return order;
      }
      return null;
    });

  const filterOpenOrders = (): OpenOrdersAccountWithKey[] =>
    orders.filter((order) => {
      if (order.account.openOrders[0].isFree === 0) {
        const passAsksFilter = markets.passAsks.filter(
          (_order) => _order.owner.toString() === order.publicKey.toString()
          );
        const passBidsFilter = markets.passBids.filter(
          (_order) => _order.owner.toString() === order.publicKey.toString()
          );
        const failAsksFilter = markets.failAsks.filter(
          (_order) => _order.owner.toString() === order.publicKey.toString()
          );
        const failBidsFilter = markets.failBids.filter(
          (_order) => _order.owner.toString() === order.publicKey.toString()
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

  const filterCompletedOrders = (): OpenOrdersAccountWithKey[] | undefined => {
    const openOrders = filterOpenOrders();
    const emptyAccounts = filterEmpyOrders();
    let filteredOrders = orders;
    if (openOrders.length > 0) {
      const openOrderKeys = openOrders.map((_order) => _order.publicKey.toString());
      filteredOrders = orders.filter((order) =>
        !openOrderKeys.includes(order.publicKey.toString())
      );
    }
    if (emptyAccounts.length > 0) {
      const emptyAccountKeys = emptyAccounts.map((_order) => _order.publicKey.toString());
      filteredOrders = filteredOrders.filter((order) =>
        !emptyAccountKeys.includes(order.publicKey.toString())
      );
    }
    if (emptyAccounts.length > 0 || openOrders.length > 0) {
      return filteredOrders.filter((elem, index, self) => index === self.indexOf(elem));
    }
  };

  const isPassOrFail = (order: OpenOrdersAccountWithKey) => {
    if (!proposal) return false;
    const isPassMarket = order.account.market.equals(proposal.account.openbookPassMarket);
    if (isPassMarket) {
      return true;
    }
    return false;
  };

  const isBidOrAsk = (order: OpenOrdersAccountWithKey) => {
    const isBidSide = order.account.position.bidsBaseLots.gt(
      order.account.position.asksBaseLots,
    );
    if (isBidSide) {
      return true;
    }
    return false;
  };

  const handleCloseAccount = useCallback(
    async (order: OpenOrdersAccountWithKey) => {
      if (!proposal || !markets) return;
      return order;
      // TODO: Handle settle funds first.
      // TODO: Check if account exists, if not create one.
    },
    [proposal, closeOrderAccount, sender],
  );

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
        setTimeout(() => fetchOpenOrders(), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setIsCanceling(false);
      }
    },
    [proposal, cancelOrderTransactions, fetchOpenOrders, sender],
  );

  const handleSettleFunds = useCallback(
    async (order: OpenOrdersAccountWithKey, passMarket: boolean) => {
      if (!proposal || !markets) return;
      const txs = await settleFundsTransactions(
        new BN(order.account.accountNum),
        passMarket,
        proposal,
        proposal.account.openbookPassMarket.equals(order.account.market)
          ? { publicKey: proposal.account.openbookPassMarket, account: markets.pass }
          : { publicKey: proposal.account.openbookFailMarket, account: markets.fail },
      );
      if (!wallet.publicKey || !txs) return;
      try {
        setIsSettling(true);
        await sender.send(txs);
        setTimeout(() => fetchOpenOrders(), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSettling(false);
      }
    },
    [proposal, settleFundsTransactions, fetchOpenOrders, sender],
  );

  return (
    <Stack>
      <Group justify="space-between">
        <Text fw="bolder" size="xl">
          Open Orders
        </Text>
        <ActionIcon variant="subtle" onClick={() => fetchOpenOrders()}>
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
          {filterOpenOrders().map((order) => (
              <Table.Tr key={order.publicKey.toString()}>
                <Table.Td>
                  <a
                    href={generateExplorerLink(order.publicKey.toString(), 'account')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {order.account.accountNum}
                  </a>
                </Table.Td>
                <Table.Td c={isPassOrFail(order) ? theme.colors.green[9] : theme.colors.red[9]}>
                  {isPassOrFail(order) ? 'PASS' : 'FAIL'}
                </Table.Td>
                <Table.Td c={isBidOrAsk(order) ? theme.colors.green[9] : theme.colors.red[9]}>
                  {isBidOrAsk(order) ? 'BID' : 'ASK'}
                </Table.Td>
                <Table.Td>
                  {numeral(
                    isBidOrAsk(order)
                      ? order.account.position.bidsBaseLots.toString()
                      : order.account.position.asksBaseLots.toString(),
                  ).format(NUMERAL_FORMAT)}
                </Table.Td>
                <Table.Td>
                  ${parseFloat(order.account.openOrders[0].lockedPrice.toNumber()) / 10000}
                </Table.Td>
                <Table.Td>
                  $
                  {isBidOrAsk(order)
                    ? (order.account.position.bidsBaseLots.toNumber() *
                        order.account.openOrders[0].lockedPrice.toNumber()) /
                      10000
                    : (order.account.position.asksBaseLots.toNumber() *
                        order.account.openOrders[0].lockedPrice.toNumber()) /
                      10000}
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
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>
      <Group justify="space-between">
        <Text fw="bolder" size="xl">
          Uncranked, Completed Orders
        </Text>
        <Text
          fw=""
          size="sm"
        >
          If you see orders here, you can use the cycle icon with the 12 on it next
          to the respective market which will crank it and push the orders into the
          Unsettled, Open Accounts below.
        </Text>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Market</Table.Th>
            <Table.Th>Side</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Settle</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {(filterCompletedOrders() !== undefined
          // @ts-ignore
          && filterCompletedOrders()?.length > 0) ?
            filterCompletedOrders()?.map((completedOrder) => (
              <Table.Tr key={`${completedOrder.publicKey.toString()}completed`}>
                <Table.Td>
                  <a
                    href={generateExplorerLink(completedOrder.publicKey.toString(), 'account')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {completedOrder.account.accountNum}
                  </a>
                </Table.Td>
                <Table.Td c={isPassOrFail(completedOrder)
                  ? theme.colors.green[9] : theme.colors.red[9]}
                >
                  {isPassOrFail(completedOrder) ? 'PASS' : 'FAIL'}
                </Table.Td>
                <Table.Td c={isBidOrAsk(completedOrder)
                  ? theme.colors.green[9] : theme.colors.red[9]}
                >
                  {isBidOrAsk(completedOrder) ? 'BID' : 'ASK'}
                </Table.Td>
                <Table.Td>
                  {isBidOrAsk(completedOrder)
                  ? completedOrder.account.position.baseFreeNative.toNumber()
                  : `${(completedOrder.account.position.quoteFreeNative.toNumber() / 1000000)} - ${isPassOrFail(completedOrder) ? 'p' : 'f'}${tokens?.usdc?.symbol}`}
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    loading={isSettling}
                    onClick={() => handleSettleFunds(completedOrder, isPassOrFail(completedOrder))}
                  >
                    <Icon3dRotate />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
          )) : (
            <Table.Tr>
              <Table.Td>
                No Uncranked Orders
              </Table.Td>
            </Table.Tr>
            )}
        </Table.Tbody>
      </Table>
      <Group justify="space-between">
        <Text fw="bolder" size="xl">
          Unsettled, Open Accounts
        </Text>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Market</Table.Th>
            <Table.Th>Amount {tokens?.meta?.symbol}</Table.Th>
            <Table.Th>Amount {tokens?.usdc?.symbol}</Table.Th>
            <Table.Th>Settle</Table.Th>
            <Table.Th>Close Account</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filterEmpyOrders().map((order) => (
              <Table.Tr key={`${order.publicKey.toString()}empty`}>
                <Table.Td>
                  <a
                    href={generateExplorerLink(order.publicKey.toString(), 'account')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {order.account.accountNum}
                  </a>
                </Table.Td>
                <Table.Td c={isPassOrFail(order) ? theme.colors.green[9] : theme.colors.red[9]}>
                  {isPassOrFail(order) ? 'PASS' : 'FAIL'}
                </Table.Td>
                <Table.Td>
                  {`${order.account.position.baseFreeNative.toNumber() / 1000000000}${isPassOrFail(order) ? 'p' : 'f'}`}
                </Table.Td>
                <Table.Td>
                  {`${(order.account.position.quoteFreeNative.toNumber() / 1000000)}${isPassOrFail(order) ? 'p' : 'f'}`}
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    loading={isSettling}
                    onClick={() => handleSettleFunds(order, isPassOrFail(order))}
                  >
                    <Icon3dRotate />
                  </ActionIcon>
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    variant="subtle"
                    loading={isSettling}
                    onClick={() => handleCloseAccount(order)}
                  >
                    <IconAssemblyOff />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
