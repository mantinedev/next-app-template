export type AutocratV0 = {
  version: '0.1.0';
  name: 'autocrat_v0';
  instructions: [
    {
      name: 'initializeDao';
      accounts: [
        {
          name: 'dao';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'metaMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'usdcMint';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'initializeProposal';
      accounts: [
        {
          name: 'proposal';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'dao';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'daoTreasury';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'quoteVault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'baseVault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openbookPassMarket';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openbookFailMarket';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openbookTwapPassMarket';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openbookTwapFailMarket';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'proposer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'descriptionUrl';
          type: 'string';
        },
        {
          name: 'instruction';
          type: {
            defined: 'ProposalInstruction';
          };
        },
      ];
    },
    {
      name: 'finalizeProposal';
      accounts: [
        {
          name: 'proposal';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openbookTwapPassMarket';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openbookTwapFailMarket';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'dao';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'baseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'quoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'daoTreasury';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'setPassThresholdBps';
      accounts: [
        {
          name: 'dao';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'daoTreasury';
          isMut: false;
          isSigner: true;
        },
      ];
      args: [
        {
          name: 'passThresholdBps';
          type: 'u16';
        },
      ];
    },
    {
      name: 'setLastProposalSlot';
      accounts: [
        {
          name: 'dao';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'daoTreasury';
          isMut: false;
          isSigner: true;
        },
      ];
      args: [
        {
          name: 'lastProposalSlot';
          type: 'u64';
        },
      ];
    },
    {
      name: 'setBaseBurnLamports';
      accounts: [
        {
          name: 'dao';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'daoTreasury';
          isMut: false;
          isSigner: true;
        },
      ];
      args: [
        {
          name: 'baseBurnLamports';
          type: 'u64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'dao';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'metaMint';
            type: 'publicKey';
          },
          {
            name: 'usdcMint';
            type: 'publicKey';
          },
          {
            name: 'passThresholdBps';
            type: 'u16';
          },
          {
            name: 'proposalCount';
            type: 'u32';
          },
          {
            name: 'lastProposalSlot';
            type: 'u64';
          },
          {
            name: 'baseBurnLamports';
            type: 'u64';
          },
          {
            name: 'burnDecayPerSlotLamports';
            type: 'u64';
          },
          {
            name: 'treasuryPdaBump';
            type: 'u8';
          },
          {
            name: 'treasury';
            type: 'publicKey';
          },
        ];
      };
    },
    {
      name: 'proposal';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'number';
            type: 'u32';
          },
          {
            name: 'proposer';
            type: 'publicKey';
          },
          {
            name: 'descriptionUrl';
            type: 'string';
          },
          {
            name: 'slotEnqueued';
            type: 'u64';
          },
          {
            name: 'state';
            type: {
              defined: 'ProposalState';
            };
          },
          {
            name: 'instruction';
            type: {
              defined: 'ProposalInstruction';
            };
          },
          {
            name: 'openbookTwapPassMarket';
            type: 'publicKey';
          },
          {
            name: 'openbookTwapFailMarket';
            type: 'publicKey';
          },
          {
            name: 'openbookPassMarket';
            type: 'publicKey';
          },
          {
            name: 'openbookFailMarket';
            type: 'publicKey';
          },
          {
            name: 'baseVault';
            type: 'publicKey';
          },
          {
            name: 'quoteVault';
            type: 'publicKey';
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'ProposalInstruction';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'programId';
            type: 'publicKey';
          },
          {
            name: 'accounts';
            type: {
              vec: {
                defined: 'ProposalAccount';
              };
            };
          },
          {
            name: 'data';
            type: 'bytes';
          },
        ];
      };
    },
    {
      name: 'ProposalAccount';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'pubkey';
            type: 'publicKey';
          },
          {
            name: 'isSigner';
            type: 'bool';
          },
          {
            name: 'isWritable';
            type: 'bool';
          },
        ];
      };
    },
    {
      name: 'ProposalState';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Pending';
          },
          {
            name: 'Passed';
          },
          {
            name: 'Failed';
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'InvalidMarket';
      msg: "Either the `pass_market` or the `fail_market`'s tokens doesn't match the vaults supplied";
    },
    {
      code: 6001;
      name: 'TWAPMarketTooOld';
      msg: "`TWAPMarket` must have an `initial_slot` within 50 slots of the proposal's `slot_enqueued`";
    },
    {
      code: 6002;
      name: 'TWAPMarketInvalidExpectedValue';
      msg: '`TWAPMarket` must have an expected value of 1000, or 0.1 USDC per META';
    },
    {
      code: 6003;
      name: 'InvalidSettlementAuthority';
      msg: 'One of the vaults has an invalid `settlement_authority`';
    },
    {
      code: 6004;
      name: 'ProposalTooYoung';
      msg: 'Proposal is too young to be executed or rejected';
    },
    {
      code: 6005;
      name: 'MarketsTooYoung';
      msg: 'Markets too young for proposal to be finalized';
    },
    {
      code: 6006;
      name: 'ProposalCannotPass';
      msg: 'The market dictates that this proposal cannot pass';
    },
    {
      code: 6007;
      name: 'ProposalAlreadyFinalized';
      msg: 'This proposal has already been finalized';
    },
    {
      code: 6008;
      name: 'InvalidVaultNonce';
      msg: 'A conditional vault has an invalid nonce. A nonce should encode pass = 0 / fail = 1 in its most significant bit, base = 0 / quote = 1 in its second most significant bit, and the proposal number in least significant 32 bits';
    },
  ];
};

export const IDL: AutocratV0 = {
  version: '0.1.0',
  name: 'autocrat_v0',
  instructions: [
    {
      name: 'initializeDao',
      accounts: [
        {
          name: 'dao',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'metaMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'usdcMint',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'initializeProposal',
      accounts: [
        {
          name: 'proposal',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'dao',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoTreasury',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'quoteVault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'baseVault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openbookPassMarket',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openbookFailMarket',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openbookTwapPassMarket',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openbookTwapFailMarket',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'proposer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'descriptionUrl',
          type: 'string',
        },
        {
          name: 'instruction',
          type: {
            defined: 'ProposalInstruction',
          },
        },
      ],
    },
    {
      name: 'finalizeProposal',
      accounts: [
        {
          name: 'proposal',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openbookTwapPassMarket',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openbookTwapFailMarket',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'dao',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'baseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'quoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'daoTreasury',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'setPassThresholdBps',
      accounts: [
        {
          name: 'dao',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoTreasury',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'passThresholdBps',
          type: 'u16',
        },
      ],
    },
    {
      name: 'setLastProposalSlot',
      accounts: [
        {
          name: 'dao',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoTreasury',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'lastProposalSlot',
          type: 'u64',
        },
      ],
    },
    {
      name: 'setBaseBurnLamports',
      accounts: [
        {
          name: 'dao',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'daoTreasury',
          isMut: false,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'baseBurnLamports',
          type: 'u64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'dao',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'metaMint',
            type: 'publicKey',
          },
          {
            name: 'usdcMint',
            type: 'publicKey',
          },
          {
            name: 'passThresholdBps',
            type: 'u16',
          },
          {
            name: 'proposalCount',
            type: 'u32',
          },
          {
            name: 'lastProposalSlot',
            type: 'u64',
          },
          {
            name: 'baseBurnLamports',
            type: 'u64',
          },
          {
            name: 'burnDecayPerSlotLamports',
            type: 'u64',
          },
          {
            name: 'treasuryPdaBump',
            type: 'u8',
          },
          {
            name: 'treasury',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'proposal',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'number',
            type: 'u32',
          },
          {
            name: 'proposer',
            type: 'publicKey',
          },
          {
            name: 'descriptionUrl',
            type: 'string',
          },
          {
            name: 'slotEnqueued',
            type: 'u64',
          },
          {
            name: 'state',
            type: {
              defined: 'ProposalState',
            },
          },
          {
            name: 'instruction',
            type: {
              defined: 'ProposalInstruction',
            },
          },
          {
            name: 'openbookTwapPassMarket',
            type: 'publicKey',
          },
          {
            name: 'openbookTwapFailMarket',
            type: 'publicKey',
          },
          {
            name: 'openbookPassMarket',
            type: 'publicKey',
          },
          {
            name: 'openbookFailMarket',
            type: 'publicKey',
          },
          {
            name: 'baseVault',
            type: 'publicKey',
          },
          {
            name: 'quoteVault',
            type: 'publicKey',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'ProposalInstruction',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'programId',
            type: 'publicKey',
          },
          {
            name: 'accounts',
            type: {
              vec: {
                defined: 'ProposalAccount',
              },
            },
          },
          {
            name: 'data',
            type: 'bytes',
          },
        ],
      },
    },
    {
      name: 'ProposalAccount',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'pubkey',
            type: 'publicKey',
          },
          {
            name: 'isSigner',
            type: 'bool',
          },
          {
            name: 'isWritable',
            type: 'bool',
          },
        ],
      },
    },
    {
      name: 'ProposalState',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Pending',
          },
          {
            name: 'Passed',
          },
          {
            name: 'Failed',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'InvalidMarket',
      msg: "Either the `pass_market` or the `fail_market`'s tokens doesn't match the vaults supplied",
    },
    {
      code: 6001,
      name: 'TWAPMarketTooOld',
      msg: "`TWAPMarket` must have an `initial_slot` within 50 slots of the proposal's `slot_enqueued`",
    },
    {
      code: 6002,
      name: 'TWAPMarketInvalidExpectedValue',
      msg: '`TWAPMarket` must have an expected value of 1000, or 0.1 USDC per META',
    },
    {
      code: 6003,
      name: 'InvalidSettlementAuthority',
      msg: 'One of the vaults has an invalid `settlement_authority`',
    },
    {
      code: 6004,
      name: 'ProposalTooYoung',
      msg: 'Proposal is too young to be executed or rejected',
    },
    {
      code: 6005,
      name: 'MarketsTooYoung',
      msg: 'Markets too young for proposal to be finalized',
    },
    {
      code: 6006,
      name: 'ProposalCannotPass',
      msg: 'The market dictates that this proposal cannot pass',
    },
    {
      code: 6007,
      name: 'ProposalAlreadyFinalized',
      msg: 'This proposal has already been finalized',
    },
    {
      code: 6008,
      name: 'InvalidVaultNonce',
      msg: 'A conditional vault has an invalid nonce. A nonce should encode pass = 0 / fail = 1 in its most significant bit, base = 0 / quote = 1 in its second most significant bit, and the proposal number in least significant 32 bits',
    },
  ],
};
