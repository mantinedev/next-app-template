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
          name: 'conditionalOnFinalizeTokenMint';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'conditionalOnRevertTokenMint';
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
      name: 'mintConditionalTokens';
      accounts: [
        {
          name: 'vault';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'conditionalOnFinalizeTokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'conditionalOnRevertTokenMint';
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
          name: 'userUnderlyingTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userConditionalOnFinalizeTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userConditionalOnRevertTokenAccount';
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
          name: 'conditionalOnFinalizeTokenMint';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'conditionalOnRevertTokenMint';
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
          name: 'userConditionalOnFinalizeTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userConditionalOnRevertTokenAccount';
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
            name: 'conditionalOnFinalizeTokenMint';
            type: 'publicKey';
          },
          {
            name: 'conditionalOnRevertTokenMint';
            type: 'publicKey';
          },
          {
            name: 'pdaBump';
            type: 'u8';
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
      msg: "This conditional token mint is not this vault's conditional token mint";
    },
    {
      code: 6003;
      name: 'CantRedeemConditionalTokens';
      msg: 'Vault needs to be settled as finalized before users can redeem conditional tokens for underlying tokens';
    },
    {
      code: 6004;
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
          name: 'conditionalOnFinalizeTokenMint',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'conditionalOnRevertTokenMint',
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
      name: 'mintConditionalTokens',
      accounts: [
        {
          name: 'vault',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'conditionalOnFinalizeTokenMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'conditionalOnRevertTokenMint',
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
          name: 'userUnderlyingTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userConditionalOnFinalizeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userConditionalOnRevertTokenAccount',
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
          name: 'conditionalOnFinalizeTokenMint',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'conditionalOnRevertTokenMint',
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
          name: 'userConditionalOnFinalizeTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userConditionalOnRevertTokenAccount',
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
            name: 'conditionalOnFinalizeTokenMint',
            type: 'publicKey',
          },
          {
            name: 'conditionalOnRevertTokenMint',
            type: 'publicKey',
          },
          {
            name: 'pdaBump',
            type: 'u8',
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
      msg: "This conditional token mint is not this vault's conditional token mint",
    },
    {
      code: 6003,
      name: 'CantRedeemConditionalTokens',
      msg: 'Vault needs to be settled as finalized before users can redeem conditional tokens for underlying tokens',
    },
    {
      code: 6004,
      name: 'VaultAlreadySettled',
      msg: 'Once a vault has been settled, its status as either finalized or reverted cannot be changed',
    },
  ],
};
