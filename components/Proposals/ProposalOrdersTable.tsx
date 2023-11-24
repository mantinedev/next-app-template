import { useCallback, useState } from 'react';
import { ActionIcon, Group, Flex, Table, Text, useMantineTheme } from '@mantine/core';
import { useWallet } from '@solana/wallet-adapter-react';
import numeral from 'numeral';
import { IconTrash, Icon3dRotate, IconAssemblyOff } from '@tabler/icons-react';
import { BN } from '@coral-xyz/anchor';
import { notifications } from '@mantine/notifications';
import { NotificationLink } from '../Layout/NotificationLink';
import { Markets, OpenOrdersAccountWithKey, ProposalAccountWithKey } from '@/lib/types';
import { useExplorerConfiguration } from '@/hooks/useExplorerConfiguration';
import { useOpenbookTwap } from '@/hooks/useOpenbookTwap';
import { useTransactionSender } from '@/hooks/useTransactionSender';
import { NUMERAL_FORMAT } from '@/lib/constants';
import { useProposal } from '@/hooks/useProposal';
import { useWeb3 } from '@/hooks/useWeb3';

export function ProposalOrdersTable({
  heading,
  description,
  headers,
  orders,
  proposal,
  orderStatus,
  markets,
}:{
  heading: string,
  description: string | any | null,
  headers: string[],
  orders: OpenOrdersAccountWithKey[],
  proposal: ProposalAccountWithKey,
  orderStatus: string
  markets: Markets
}) {
  const theme = useMantineTheme();
  const sender = useTransactionSender();
  const wallet = useWallet();

  const { generateExplorerLink } = useExplorerConfiguration();
  const { closeOrderAccount } = useWeb3();

  const { cancelOrderTransactions, settleFundsTransactions, closeOpenOrdersAccountTransactions } =
    useOpenbookTwap();
  const { fetchOpenOrders } = useProposal({
    fromNumber: proposal.account.number,
  });

  const [isCanceling, setIsCanceling] = useState<boolean>(false);
  const [isSettling, setIsSettling] = useState<boolean>(false);

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
        const txSignatures = await sender.send(txs);
        txSignatures.map((sig) =>
          notifications.show({
            title: 'Transaction Submitted',
            message: <NotificationLink signature={sig} />,
            autoClose: 5000,
          }),
        );
        // We already return above if the wallet doesn't have a public key
        // @ts-ignore
        setTimeout(() => fetchOpenOrders(proposal, wallet.publicKey), 3000);
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
        const txSignatures = await sender.send(txs);
        txSignatures.map((sig) =>
          notifications.show({
            title: 'Transaction Submitted',
            message: <NotificationLink signature={sig} />,
            autoClose: 5000,
          }),
        );
        // @ts-ignore
        setTimeout(() => fetchOpenOrders(proposal, wallet.publicKey), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSettling(false);
      }
    },
    [proposal, settleFundsTransactions, fetchOpenOrders, sender],
  );

  const handleCloseAccount = useCallback(
    async (order: OpenOrdersAccountWithKey) => {
      if (!proposal || !markets) return;

      const txs = await closeOpenOrdersAccountTransactions(new BN(order.account.accountNum));

      if (!wallet.publicKey || !txs) return;

      try {
        const txSignatures = await sender.send(txs);
        txSignatures.map((sig) =>
          notifications.show({
            title: 'Transaction Submitted',
            message: <NotificationLink signature={sig} />,
            autoClose: 5000,
          }),
        );
      } catch (err) {
        console.error(err);
      }
    },
    [proposal, closeOrderAccount, sender],
  );

  const isPassOrFail = (order: OpenOrdersAccountWithKey) => {
    if (!proposal) return false;
    const isPassMarket = order.account.market.equals(proposal.account.openbookPassMarket);
    if (isPassMarket) {
      return true;
    }
    return false;
  };

  const isBidOrAsk = (order: OpenOrdersAccountWithKey) => {
    const isBidSide = order.account.position.bidsBaseLots.gt(order.account.position.asksBaseLots);
    if (isBidSide) {
      return true;
    }
    return false;
  };

  const totalInOrder = () => {
    let sumOrders = [];
    sumOrders = orders?.map((order) => ((order.account.position.bidsBaseLots.toNumber() / 10_000)
      + (order.account.position.asksBaseLots.toNumber() / 10_000))
      * order.account.openOrders[0].lockedPrice.toNumber());
    const totalValueLocked = sumOrders.reduce((partialSum, amount) =>
      partialSum + amount, 0);
    return totalValueLocked.toFixed(4);
  };

  const totalUsdcInOrder = () => {
    let sumOrders = [];
    sumOrders = orders?.map((order) => {
      if (isBidOrAsk(order)) {
        return order.account.position.bidsBaseLots.toNumber()
          + order.account.position.asksBaseLots.toNumber();
      }
      return 0;
    });

    const totalValueLocked = sumOrders.reduce((partialSum, amount) =>
      partialSum + amount, 0);
    return totalValueLocked.toFixed(0);
  };

  const totalMetaInOrder = () => {
    let sumOrders = [];
    sumOrders = orders?.map((order) => {
      if (!isBidOrAsk(order)) {
        return order.account.position.bidsBaseLots.toNumber()
          + order.account.position.asksBaseLots.toNumber();
      }
      return 0;
    });

    const totalValueLocked = sumOrders.reduce((partialSum, amount) =>
      partialSum + amount, 0);
    return totalValueLocked.toFixed(0);
  };

  return (
    <>
      <Group justify="space-between">
        <Text fw="bolder" size="xl">
          {heading}
        </Text>

        <Flex
          justify="flex-end"
          align="center"
          direction="row"
          wrap="wrap"
        >
          {orderStatus === 'open' ? (
            <>
            <Group>
            <Text size="xl" fw="bold">
              ${totalUsdcInOrder()}
            </Text>
            <Text size="md">
              condUSDC
            </Text>/
            <Text size="xl" fw="bold">
              {totalMetaInOrder()}
            </Text>
            <Text size="md">
              condMETA
            </Text>
            <Text fw="bolder" size="xl">
                (${totalInOrder()})
            </Text>
            </Group>
            </>
            ) : null
          }
        </Flex>
        <Text size="sm">
          {description}
        </Text>
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
          {headers.map((header) => (
            <Table.Th>
              {header}
            </Table.Th>
          ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders.length > 0 ? orders.map((order) => (
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
              {orderStatus === 'open' || orderStatus === 'uncranked' ? (
                <>
                <Table.Td>
                {orderStatus === 'uncranked' ? 'Pending Crank' : (order.account.position.baseFreeNative.toNumber() > 0
                  || order.account.position.baseFreeNative.toNumber() > 0) ?
                    'Partially Filled'
                  : 'Open'}
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
                  ${isBidOrAsk(order)
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
                  {(order.account.position.baseFreeNative.toNumber() > 0
                  || order.account.position.baseFreeNative.toNumber() > 0) ? (
                  <ActionIcon
                    variant="subtle"
                    loading={isSettling}
                    onClick={() => handleSettleFunds(order, isPassOrFail(order))}
                  >
                    <Icon3dRotate />
                  </ActionIcon>
                  ) : null}
                </Table.Td>
                </>
              ) : (
                <>
                <Table.Td>
                  {`${order.account.position.baseFreeNative.toNumber() / 1000000000}${
                    isPassOrFail(order) ? 'p' : 'f'
                  }`}
                </Table.Td>
                <Table.Td>
                  {`${order.account.position.quoteFreeNative.toNumber() / 1000000}${
                    isPassOrFail(order) ? 'p' : 'f'
                  }`}
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
                  disabled={
                    order.account.position.asksBaseLots > 0 ||
                    order.account.position.bidsBaseLots > 0 ||
                    order.account.position.baseFreeNative > 0 ||
                    order.account.position.quoteFreeNative > 0
                  }
                  variant="subtle"
                  loading={isSettling}
                  onClick={() => handleCloseAccount(order)}
                >
                  <IconAssemblyOff />
                </ActionIcon>
              </Table.Td>
                </>
              )}
            </Table.Tr>
          )) : (
            <Table.Tr>
              No Orders Found
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
}
