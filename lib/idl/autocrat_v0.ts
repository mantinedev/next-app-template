export type AutocratV0 = {
  "version": "0.1.0",
  "name": "autocrat_v0",
  "instructions": [
    {
      "name": "initializeDao",
      "accounts": [
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initializeProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quotePassVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteFailVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "basePassVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseFailVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "passMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "failMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "descriptionUrl",
          "type": "string"
        },
        {
          "name": "instruction",
          "type": {
            "defined": "ProposalInstruction"
          }
        }
      ]
    },
    {
      "name": "finalizeProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "passMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "failMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dao",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quotePassVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteFailVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "basePassVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseFailVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "setPassThresholdBps",
      "accounts": [
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "passThresholdBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setLastProposalSlot",
      "accounts": [
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "lastProposalSlot",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setBaseBurnLamports",
      "accounts": [
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "baseBurnLamports",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "dao",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "publicKey"
          },
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "passThresholdBps",
            "type": "u16"
          },
          {
            "name": "proposalCount",
            "type": "u32"
          },
          {
            "name": "lastProposalSlot",
            "type": "u64"
          },
          {
            "name": "baseBurnLamports",
            "type": "u64"
          },
          {
            "name": "burnDecayPerSlotLamports",
            "type": "u64"
          },
          {
            "name": "treasuryPdaBump",
            "type": "u8"
          },
          {
            "name": "treasury",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dao",
            "type": "publicKey"
          },
          {
            "name": "number",
            "type": "u32"
          },
          {
            "name": "proposer",
            "type": "publicKey"
          },
          {
            "name": "descriptionUrl",
            "type": "string"
          },
          {
            "name": "slotEnqueued",
            "type": "u64"
          },
          {
            "name": "state",
            "type": {
              "defined": "ProposalState"
            }
          },
          {
            "name": "instruction",
            "type": {
              "defined": "ProposalInstruction"
            }
          },
          {
            "name": "passMarket",
            "type": "publicKey"
          },
          {
            "name": "failMarket",
            "type": "publicKey"
          },
          {
            "name": "basePassVault",
            "type": "publicKey"
          },
          {
            "name": "quotePassVault",
            "type": "publicKey"
          },
          {
            "name": "baseFailVault",
            "type": "publicKey"
          },
          {
            "name": "quoteFailVault",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ProposalInstruction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "ProposalAccount"
              }
            }
          },
          {
            "name": "data",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "ProposalAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "ProposalState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pending"
          },
          {
            "name": "Passed"
          },
          {
            "name": "Failed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidMarket",
      "msg": "Either the `pass_market` or the `fail_market`'s tokens doesn't match the vaults supplied"
    },
    {
      "code": 6001,
      "name": "InvalidSettlementAuthority",
      "msg": "One of the vaults has an invalid `settlement_authority`"
    },
    {
      "code": 6002,
      "name": "ProposalTooYoung",
      "msg": "Proposal is too young to be executed or rejected"
    },
    {
      "code": 6003,
      "name": "MarketsTooYoung",
      "msg": "Markets too young for proposal to be finalized"
    },
    {
      "code": 6004,
      "name": "ProposalCannotPass",
      "msg": "The market dictates that this proposal cannot pass"
    },
    {
      "code": 6005,
      "name": "ProposalAlreadyFinalized",
      "msg": "This proposal has already been finalized"
    },
    {
      "code": 6006,
      "name": "InvalidVaultNonce",
      "msg": "A conditional vault has an invalid nonce. A nonce should encode pass = 0 / fail = 1 in its most significant bit, base = 0 / quote = 1 in its second most significant bit, and the proposal number in least significant 32 bits"
    }
  ]
};

export const IDL: AutocratV0 = {
  "version": "0.1.0",
  "name": "autocrat_v0",
  "instructions": [
    {
      "name": "initializeDao",
      "accounts": [
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "token",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "initializeProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quotePassVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quoteFailVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "basePassVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseFailVault",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "passMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "failMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "descriptionUrl",
          "type": "string"
        },
        {
          "name": "instruction",
          "type": {
            "defined": "ProposalInstruction"
          }
        }
      ]
    },
    {
      "name": "finalizeProposal",
      "accounts": [
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "passMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "failMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dao",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quotePassVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteFailVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "basePassVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseFailVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposer",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "setPassThresholdBps",
      "accounts": [
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "passThresholdBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setLastProposalSlot",
      "accounts": [
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "lastProposalSlot",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setBaseBurnLamports",
      "accounts": [
        {
          "name": "dao",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTreasury",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "baseBurnLamports",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "dao",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "publicKey"
          },
          {
            "name": "token",
            "type": "publicKey"
          },
          {
            "name": "passThresholdBps",
            "type": "u16"
          },
          {
            "name": "proposalCount",
            "type": "u32"
          },
          {
            "name": "lastProposalSlot",
            "type": "u64"
          },
          {
            "name": "baseBurnLamports",
            "type": "u64"
          },
          {
            "name": "burnDecayPerSlotLamports",
            "type": "u64"
          },
          {
            "name": "treasuryPdaBump",
            "type": "u8"
          },
          {
            "name": "treasury",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "dao",
            "type": "publicKey"
          },
          {
            "name": "number",
            "type": "u32"
          },
          {
            "name": "proposer",
            "type": "publicKey"
          },
          {
            "name": "descriptionUrl",
            "type": "string"
          },
          {
            "name": "slotEnqueued",
            "type": "u64"
          },
          {
            "name": "state",
            "type": {
              "defined": "ProposalState"
            }
          },
          {
            "name": "instruction",
            "type": {
              "defined": "ProposalInstruction"
            }
          },
          {
            "name": "passMarket",
            "type": "publicKey"
          },
          {
            "name": "failMarket",
            "type": "publicKey"
          },
          {
            "name": "basePassVault",
            "type": "publicKey"
          },
          {
            "name": "quotePassVault",
            "type": "publicKey"
          },
          {
            "name": "baseFailVault",
            "type": "publicKey"
          },
          {
            "name": "quoteFailVault",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ProposalInstruction",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "programId",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "ProposalAccount"
              }
            }
          },
          {
            "name": "data",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "ProposalAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "ProposalState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pending"
          },
          {
            "name": "Passed"
          },
          {
            "name": "Failed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidMarket",
      "msg": "Either the `pass_market` or the `fail_market`'s tokens doesn't match the vaults supplied"
    },
    {
      "code": 6001,
      "name": "InvalidSettlementAuthority",
      "msg": "One of the vaults has an invalid `settlement_authority`"
    },
    {
      "code": 6002,
      "name": "ProposalTooYoung",
      "msg": "Proposal is too young to be executed or rejected"
    },
    {
      "code": 6003,
      "name": "MarketsTooYoung",
      "msg": "Markets too young for proposal to be finalized"
    },
    {
      "code": 6004,
      "name": "ProposalCannotPass",
      "msg": "The market dictates that this proposal cannot pass"
    },
    {
      "code": 6005,
      "name": "ProposalAlreadyFinalized",
      "msg": "This proposal has already been finalized"
    },
    {
      "code": 6006,
      "name": "InvalidVaultNonce",
      "msg": "A conditional vault has an invalid nonce. A nonce should encode pass = 0 / fail = 1 in its most significant bit, base = 0 / quote = 1 in its second most significant bit, and the proposal number in least significant 32 bits"
    }
  ]
};
