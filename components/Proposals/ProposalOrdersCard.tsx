import { useCallback, useState } from 'react';
import {
  ActionIcon,
  Group,
  Stack,
  Table,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useWallet } from '@solana/wallet-adapter-react';
import { BN } from '@coral-xyz/anchor';
import { IconRefresh, IconTrash, Icon3dRotate } from '@tabler/icons-react';
import numeral from 'numeral';
import { useExplorerConfiguration } from '@/hooks/useExplorerConfiguration';
import { OpenOrdersAccountWithKey, ProposalAccountWithKey, Markets } from '@/lib/types';
import { useProposal } from '@/hooks/useProposal';
import { useOpenbookTwap } from '@/hooks/useOpenbookTwap';
import { useTransactionSender } from '@/hooks/useTransactionSender';
import { NUMERAL_FORMAT } from '@/lib/constants';

export function ProposalOrdersCard(
  { markets, orders, proposal }: {
    markets: Markets,
    orders: OpenOrdersAccountWithKey[],
    proposal: ProposalAccountWithKey
  }
) {
  const theme = useMantineTheme();

  const sender = useTransactionSender();
  const wallet = useWallet();
  const { fetchOpenOrders } = useProposal({
    fromNumber: proposal.account.number,
  });
  const { cancelOrderTransactions, settleFundsTransactions } = useOpenbookTwap();
  const { generateExplorerLink } = useExplorerConfiguration();

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
          Orders
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
                      onClick={() => handleSettleFunds(order, pass)}
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
  );
}
