import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Fieldset, NativeSelect, Stack, Text, TextInput } from '@mantine/core';
import numeral, { Numeral } from 'numeral';
import { BN } from '@coral-xyz/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useAutocrat } from '@/contexts/AutocratContext';
import { instructionGroups } from '@/lib/instructions';
import { InstructionAction, ProposalInstruction } from '@/lib/types';
import { NUMERAL_FORMAT } from '../../lib/constants';
import { useInitializeProposal } from '../../hooks/useInitializeProposal';

export function CreateProposalCard() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { daoState } = useAutocrat();
  const initializeProposal = useInitializeProposal();
  const [url, setUrl] = useState<string>('https://www.eff.org/cyberspace-independence');
  const [selectedInstruction, setSelectedInstruction] = useState<InstructionAction>(
    instructionGroups[0].actions[0],
  );
  const [instruction, setInstruction] = useState<ProposalInstruction>();
  const [params, setParams] = useState<any[]>();
  const [balance, setBalance] = useState<Numeral>();
  const [lastSlot, setLastSlot] = useState<number>();
  const nextProposalCost = numeral(
    daoState && lastSlot
      ? daoState.baseBurnLamports
          .sub(
            new BN(lastSlot).sub(daoState.lastProposalSlot).mul(daoState.burnDecayPerSlotLamports),
          )
          .toString()
      : 0,
  ).divide(LAMPORTS_PER_SOL);

  const fetchBalance = async () => {
    if (!wallet.publicKey || !connection) return;
    setBalance(numeral(await connection.getBalance(wallet.publicKey)).divide(LAMPORTS_PER_SOL));
  };
  const fetchSlot = useCallback(async () => {
    setLastSlot(await connection.getSlot());
  }, [connection]);
  useEffect(() => {
    if (!balance) {
      fetchBalance();
    }
  }, [balance]);
  useEffect(() => {
    if (!lastSlot || daoState?.lastProposalSlot.toNumber() > (lastSlot || 0)) {
      fetchSlot();
    }
  }, [lastSlot, daoState, fetchSlot]);
  useEffect(() => {
    if (lastSlot && daoState) {
      const interval = setInterval(() => {
        setLastSlot((old) => (old || daoState.lastProposalSlot.toNumber()) + 1);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [daoState, lastSlot]);

  useEffect(() => {
    setParams(new Array(selectedInstruction.fields.length));
  }, [selectedInstruction]);

  useEffect(() => {
    if (params) {
      setInstruction(selectedInstruction.instruction(params));
    }
  }, [params, selectedInstruction]);

  const handleCreate = useCallback(async () => {
    if (!instruction || !initializeProposal) return;

    initializeProposal(url, instruction);
  }, [initializeProposal, url, instruction]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
      {daoState ? (
        <Stack>
          <TextInput
            defaultValue={url}
            onChange={(e) => setUrl(e.target.value)}
            label="Proposal's description URL"
            description="A link to a page that describes what the proposal does"
          />
          <NativeSelect
            label="Select instruction"
            data={instructionGroups.map((group) => ({
              group: group.name,
              items: group.actions.map((a) => ({
                label: a.label,
                value: JSON.stringify(a),
              })),
            }))}
            onChange={(e) => setSelectedInstruction(JSON.parse(e.target.value))}
          />
          <Fieldset legend="Instruction parameters">
            {selectedInstruction?.fields.map((field, index) => (
              <TextInput
                key={field.label + index}
                label={field.label}
                description={field.description}
                onChange={(e) =>
                  setParams((old) => {
                    if (!old) {
                      old = new Array(selectedInstruction.fields.length);
                    }
                    return old.toSpliced(index, 1, field.deserialize(e.target.value));
                  })
                }
              />
            ))}
          </Fieldset>
          <Button
            onClick={handleCreate}
            disabled={
              params?.includes(undefined) ||
              (balance?.value() || 0) < (nextProposalCost.value() || 0)
            }
          >
            Create proposal
          </Button>
          {(nextProposalCost.value() || 0) > 0 ? (
            <Stack gap="0">
              <Text fw="lighter">Your balance: {balance?.format(NUMERAL_FORMAT)} $SOL</Text>
              <Text fw="lighter">
                A {nextProposalCost.format(NUMERAL_FORMAT)} $SOL fee is required to create the
                proposal. This helps prevent spam.
              </Text>
            </Stack>
          ) : null}
        </Stack>
      ) : (
        <Text fw="bolder" ta="center">
          DAO not found
        </Text>
      )}
    </Card>
  );
}
