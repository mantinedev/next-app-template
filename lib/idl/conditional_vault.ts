export type ConditionalVault = {
  version: '0.1.0';
  name: 'conditional_vault';
  instructions: [
    {
      name: 'initializeConditionalVault';
      accounts: [
        {
          name: 'vault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'underlyingTokenMint';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'conditionalTokenMint';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'vaultUnderlyingTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'associatedTokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'settlementAuthority';
          type: 'publicKey';
        },
        {
          name: 'nonce';
          type: 'u64';
        },
      ];
    },
    {
      name: 'settleConditionalVault';
      accounts: [
        {
          name: 'settlementAuthority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'vault';
          isMut: true;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'newStatus';
          type: {
            defined: 'VaultStatus';
          };
        },
      ];
    },
    {
      name: 'initializeDepositSlip';
      accounts: [
        {
          name: 'depositSlip';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vault';
          isMut: false;
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
      ];
      args: [
        {
          name: 'authority';
          type: 'publicKey';
        },
      ];
    },
    {
      name: 'mintConditionalTokens';
      accounts: [
        {
          name: 'vault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'conditionalTokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultUnderlyingTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'depositSlip';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userUnderlyingTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userConditionalTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'redeemConditionalTokensForUnderlyingTokens';
      accounts: [
        {
          name: 'vault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'conditionalTokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'vaultUnderlyingTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'userConditionalTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userUnderlyingTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: 'redeemDepositSlipForUnderlyingTokens';
      accounts: [
        {
          name: 'vault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'vaultUnderlyingTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'depositSlip';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userUnderlyingTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: 'conditionalVault';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'status';
            type: {
              defined: 'VaultStatus';
            };
          },
          {
            name: 'settlementAuthority';
            docs: [
              'The account that can either finalize the vault to make conditional tokens',
              'redeemable for underlying tokens or revert the vault to make deposit',
              'slips redeemable for underlying tokens.',
            ];
            type: 'publicKey';
          },
          {
            name: 'underlyingTokenMint';
            docs: ['The mint of the tokens that are deposited into the vault.'];
            type: 'publicKey';
          },
          {
            name: 'nonce';
            docs: [
              'A nonce to allow a single account to be the settlement authority of multiple',
              'vaults with the same underlying token mints.',
            ];
            type: 'u64';
          },
          {
            name: 'underlyingTokenAccount';
            docs: ["The vault's storage account for deposited funds."];
            type: 'publicKey';
          },
          {
            name: 'conditionalTokenMint';
            type: 'publicKey';
          },
          {
            name: 'pdaBump';
            type: 'u8';
          },
        ];
      };
    },
    {
      name: 'depositSlip';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'vault';
            type: 'publicKey';
          },
          {
            name: 'authority';
            type: 'publicKey';
          },
          {
            name: 'depositedAmount';
            type: 'u64';
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'VaultStatus';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Active';
          },
          {
            name: 'Finalized';
          },
          {
            name: 'Reverted';
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'InsufficientUnderlyingTokens';
      msg: 'Insufficient underlying token balance to mint this amount of conditional tokens';
    },
    {
      code: 6001;
      name: 'InvalidVaultUnderlyingTokenAccount';
      msg: "This `vault_underlying_token_account` is not this vault's `underlying_token_account`";
    },
    {
      code: 6002;
      name: 'InvalidConditionalTokenMint';
      msg: "This `conditional_token_mint` is not this vault's `conditional_token_mint`";
    },
    {
      code: 6003;
      name: 'CantRedeemConditionalTokens';
      msg: 'Vault needs to be settled as finalized before users can redeem conditional tokens for underlying tokens';
    },
    {
      code: 6004;
      name: 'CantRedeemDepositSlip';
      msg: 'Vault needs to be settled as reverted before users can redeem deposit slips for underlying tokens';
    },
    {
      code: 6005;
      name: 'VaultAlreadySettled';
      msg: 'Once a vault has been settled, its status as either finalized or reverted cannot be changed';
    },
  ];
};

export const IDL: ConditionalVault = {
  version: '0.1.0',
  name: 'conditional_vault',
  instructions: [
    {
      name: 'initializeConditionalVault',
      accounts: [
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'underlyingTokenMint',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'conditionalTokenMint',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'vaultUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'associatedTokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'settlementAuthority',
          type: 'publicKey',
        },
        {
          name: 'nonce',
          type: 'u64',
        },
      ],
    },
    {
      name: 'settleConditionalVault',
      accounts: [
        {
          name: 'settlementAuthority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'vault',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'newStatus',
          type: {
            defined: 'VaultStatus',
          },
        },
      ],
    },
    {
      name: 'initializeDepositSlip',
      accounts: [
        {
          name: 'depositSlip',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vault',
          isMut: false,
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
      ],
      args: [
        {
          name: 'authority',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'mintConditionalTokens',
      accounts: [
        {
          name: 'vault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'conditionalTokenMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'depositSlip',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userConditionalTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
    {
      name: 'redeemConditionalTokensForUnderlyingTokens',
      accounts: [
        {
          name: 'vault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'conditionalTokenMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'vaultUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'userConditionalTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'redeemDepositSlipForUnderlyingTokens',
      accounts: [
        {
          name: 'vault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'vaultUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'depositSlip',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: 'conditionalVault',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'status',
            type: {
              defined: 'VaultStatus',
            },
          },
          {
            name: 'settlementAuthority',
            docs: [
              'The account that can either finalize the vault to make conditional tokens',
              'redeemable for underlying tokens or revert the vault to make deposit',
              'slips redeemable for underlying tokens.',
            ],
            type: 'publicKey',
          },
          {
            name: 'underlyingTokenMint',
            docs: ['The mint of the tokens that are deposited into the vault.'],
            type: 'publicKey',
          },
          {
            name: 'nonce',
            docs: [
              'A nonce to allow a single account to be the settlement authority of multiple',
              'vaults with the same underlying token mints.',
            ],
            type: 'u64',
          },
          {
            name: 'underlyingTokenAccount',
            docs: ["The vault's storage account for deposited funds."],
            type: 'publicKey',
          },
          {
            name: 'conditionalTokenMint',
            type: 'publicKey',
          },
          {
            name: 'pdaBump',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'depositSlip',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'vault',
            type: 'publicKey',
          },
          {
            name: 'authority',
            type: 'publicKey',
          },
          {
            name: 'depositedAmount',
            type: 'u64',
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'VaultStatus',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Active',
          },
          {
            name: 'Finalized',
          },
          {
            name: 'Reverted',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'InsufficientUnderlyingTokens',
      msg: 'Insufficient underlying token balance to mint this amount of conditional tokens',
    },
    {
      code: 6001,
      name: 'InvalidVaultUnderlyingTokenAccount',
      msg: "This `vault_underlying_token_account` is not this vault's `underlying_token_account`",
    },
    {
      code: 6002,
      name: 'InvalidConditionalTokenMint',
      msg: "This `conditional_token_mint` is not this vault's `conditional_token_mint`",
    },
    {
      code: 6003,
      name: 'CantRedeemConditionalTokens',
      msg: 'Vault needs to be settled as finalized before users can redeem conditional tokens for underlying tokens',
    },
    {
      code: 6004,
      name: 'CantRedeemDepositSlip',
      msg: 'Vault needs to be settled as reverted before users can redeem deposit slips for underlying tokens',
    },
    {
      code: 6005,
      name: 'VaultAlreadySettled',
      msg: 'Once a vault has been settled, its status as either finalized or reverted cannot be changed',
    },
  ],
};
