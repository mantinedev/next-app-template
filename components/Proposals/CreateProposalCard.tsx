import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Fieldset, NativeSelect, Stack, TextInput } from '@mantine/core';
import { useAutocrat } from '@/hooks/useAutocrat';
import { InitializeProposalType } from '@/hooks/useProposals';
import { instructionGroups } from '@/lib/instructions';
import { InstructionAction, ProposalInstruction } from '@/lib/types';

export function CreateProposalCard({ action }: { action: InitializeProposalType }) {
  const { program, dao, daoTreasury } = useAutocrat();
  const [url, setUrl] = useState<string>('https://www.eff.org/cyberspace-independence');
  const [selectedInstruction, setSelectedInstruction] = useState<InstructionAction>(
    instructionGroups[0].actions[0],
  );
  const [instruction, setInstruction] = useState<ProposalInstruction>();
  const [params, setParams] = useState<any[]>();

  useEffect(() => {
    setParams(new Array(selectedInstruction.fields.length));
  }, [selectedInstruction]);

  useEffect(() => {
    if (params) {
      setInstruction(selectedInstruction.instruction(params));
    }
  }, [params, selectedInstruction]);

  const handleCreate = useCallback(async () => {
    if (!instruction) return;

    action(url, instruction);
  }, [program, action, dao, daoTreasury, url, instruction]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder>
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
        <Button onClick={handleCreate} disabled={params?.includes(undefined)}>
          Create proposal
        </Button>
      </Stack>
    </Card>
  );
}
