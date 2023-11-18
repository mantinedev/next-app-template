import { BorshInstructionCoder, utils } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { AutocratV0 } from '@/lib/idl/autocrat_v0';
import { AUTOCRAT_PROGRAM_ID } from '@/lib/constants';
import { InstructionFieldTypes, InstructionSet } from '../types';

const AUTOCRAT_IDL: AutocratV0 = require('@/lib/idl/autocrat_v0.json');

const coder = new BorshInstructionCoder(AUTOCRAT_IDL);
// const program = new Program<AutocratV0>(AUTOCRAT_IDL, AUTOCRAT_PROGRAM_ID);
const dao = PublicKey.findProgramAddressSync(
  [utils.bytes.utf8.encode('WWCACOTMICMIBMHAFTTWYGHMB')],
  AUTOCRAT_PROGRAM_ID,
)[0];
const daoTreasury = PublicKey.findProgramAddressSync([dao.toBuffer()], AUTOCRAT_PROGRAM_ID)[0];
export const instructions: InstructionSet = {
  name: 'Autocrat',
  actions: [
    {
      label: 'Set Pass Threshold',
      fields: [
        {
          type: InstructionFieldTypes.Number,
          label: 'Threshold',
          description:
            'The difference threshold needed between PASS and FAIL market for a proposal to pass, in basis points',
          deserialize: (value: string) => Number(value),
        },
      ],
      instruction: (params: any[]) => ({
        programId: AUTOCRAT_PROGRAM_ID,
        accounts: [
          {
            pubkey: dao,
            isSigner: true,
            isWritable: true,
          },
          {
            pubkey: daoTreasury,
            isSigner: true,
            isWritable: false,
          },
        ],
        data: coder.encode('set_pass_threshold_bps', {
          passThresholdBps: params[0],
        }),
      }),
    },
  ],
};
