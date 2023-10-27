export type Clob = {
  "version": "0.1.0",
  "name": "clob",
  "instructions": [
    {
      "name": "initializeGlobalState",
      "accounts": [
        {
          "name": "globalState",
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
        }
      ],
      "args": [
        {
          "name": "admin",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateGlobalState",
      "accounts": [
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "newTakerFeeInBps",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "newMarketMakerBurnInLamports",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "newDefaultMaxObservationChangePerUpdateBps",
          "type": {
            "option": "u16"
          }
        }
      ]
    },
    {
      "name": "initializeOrderBook",
      "accounts": [
        {
          "name": "base",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quote",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateOrderBook",
      "accounts": [
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newMaxObservationChangePerUpdateBps",
          "type": "u16"
        },
        {
          "name": "newMinBaseLimitAmount",
          "type": "u64"
        },
        {
          "name": "newMinQuoteLimitAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "sweepFees",
      "accounts": [
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addMarketMaker",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketMaker",
          "type": "publicKey"
        },
        {
          "name": "index",
          "type": "u32"
        }
      ]
    },
    {
      "name": "topUpBalance",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "baseFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketMakerIndex",
          "type": "u32"
        },
        {
          "name": "baseAmount",
          "type": "u64"
        },
        {
          "name": "quoteAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawBalance",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "baseTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketMakerIndex",
          "type": "u32"
        },
        {
          "name": "baseAmount",
          "type": "u64"
        },
        {
          "name": "quoteAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "submitLimitOrder",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "refId",
          "type": "u32"
        },
        {
          "name": "marketMakerIndex",
          "type": "u8"
        }
      ],
      "returns": "u8"
    },
    {
      "name": "cancelLimitOrder",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderIndex",
          "type": "u8"
        },
        {
          "name": "marketMakerIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "submitTakeOrder",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userBaseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userQuoteAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "minOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getTwap",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": {
        "defined": "TWAPOracle"
      }
    },
    {
      "name": "getMarketMakerBalances",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "makerPubkey",
          "type": "publicKey"
        }
      ],
      "returns": {
        "defined": "MarketMakerBalances"
      }
    },
    {
      "name": "getOrderIndex",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "refId",
          "type": "u32"
        },
        {
          "name": "marketMakerIndex",
          "type": "u8"
        }
      ],
      "returns": {
        "option": "u8"
      }
    },
    {
      "name": "getBestOrders",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        }
      ],
      "returns": {
        "vec": {
          "defined": "AmountAndPrice"
        }
      }
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "Admins can do the following:",
              "- collect taker fees",
              "- change fees (within bounds)",
              "- change TWAP parameters (within bounds)",
              "- TODO: change min_{quote,base}_limit_amount"
            ],
            "type": "publicKey"
          },
          {
            "name": "takerFeeInBps",
            "docs": [
              "The CLOB needs fees to disincentivize wash trading / TWAP manipulation.",
              "Besides, profits are virtuous :)"
            ],
            "type": "u16"
          },
          {
            "name": "marketMakerBurnInLamports",
            "docs": [
              "Since market maker slots are finite, we need some cost to prevent someone",
              "from taking all the market maker slots. Also, have I mentioned that profits",
              "are virtuous?"
            ],
            "type": "u64"
          },
          {
            "name": "defaultMaxObservationChangePerUpdateBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "orderBook",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "base",
            "type": "publicKey"
          },
          {
            "name": "quote",
            "type": "publicKey"
          },
          {
            "name": "baseVault",
            "type": "publicKey"
          },
          {
            "name": "quoteVault",
            "type": "publicKey"
          },
          {
            "name": "buys",
            "type": {
              "defined": "OrderList"
            }
          },
          {
            "name": "sells",
            "type": {
              "defined": "OrderList"
            }
          },
          {
            "name": "marketMakers",
            "type": {
              "array": [
                {
                  "defined": "MarketMaker"
                },
                64
              ]
            }
          },
          {
            "name": "twapOracle",
            "type": {
              "defined": "TWAPOracle"
            }
          },
          {
            "name": "minBaseLimitAmount",
            "type": "u64"
          },
          {
            "name": "minQuoteLimitAmount",
            "type": "u64"
          },
          {
            "name": "pdaBump",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "inv",
            "type": {
              "defined": "InvariantStorage"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "MarketMakerBalances",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "baseBalance",
            "type": "u64"
          },
          {
            "name": "quoteBalance",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AmountAndPrice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FreeBitmap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inner",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "InvariantStorage",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "baseFeesSweepable",
            "type": "u64"
          },
          {
            "name": "quoteFeesSweepable",
            "type": "u64"
          },
          {
            "name": "baseLiabilities",
            "type": "u64"
          },
          {
            "name": "quoteLiabilities",
            "type": "u64"
          },
          {
            "name": "baseLiquidity",
            "type": "u64"
          },
          {
            "name": "quoteLiquidity",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "TWAPOracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastUpdatedSlot",
            "type": "u64"
          },
          {
            "name": "lastObservedSlot",
            "type": "u64"
          },
          {
            "name": "lastObservation",
            "type": "u64"
          },
          {
            "name": "observationAggregator",
            "type": "u128"
          },
          {
            "name": "maxObservationChangePerUpdateBps",
            "docs": [
              "The most, in basis points, an observation can change per update.",
              "For example, if it is 100 (1%), then the new observation can be between",
              "last_observation * 0.99 and last_observation * 1.01"
            ],
            "type": "u16"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          }
        ]
      }
    },
    {
      "name": "OrderList",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "side",
            "type": {
              "defined": "StoredSide"
            }
          },
          {
            "name": "bestOrderIdx",
            "type": "u8"
          },
          {
            "name": "worstOrderIdx",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                5
              ]
            }
          },
          {
            "name": "freeBitmap",
            "type": {
              "defined": "FreeBitmap"
            }
          },
          {
            "name": "orders",
            "type": {
              "array": [
                {
                  "defined": "Order"
                },
                128
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nextIdx",
            "type": "u8"
          },
          {
            "name": "prevIdx",
            "type": "u8"
          },
          {
            "name": "marketMakerIndex",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "refId",
            "type": "u32"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MarketMaker",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "baseBalance",
            "type": "u64"
          },
          {
            "name": "quoteBalance",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "StoredSide",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inner",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Buy"
          },
          {
            "name": "Sell"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "IndexAlreadyTaken",
      "msg": "Tried to become a market maker in an index that is already taken"
    },
    {
      "code": 6001,
      "name": "UnauthorizedMarketMaker",
      "msg": "This signer does not have authority over this market maker index"
    },
    {
      "code": 6002,
      "name": "InferiorPrice",
      "msg": "This limit order's price was not good enough to land on the order book"
    },
    {
      "code": 6003,
      "name": "TakeNotFilled",
      "msg": "This take order could not be filled at this `min_out`"
    },
    {
      "code": 6004,
      "name": "MakerNotFound",
      "msg": "Unable to find this maker for this market"
    },
    {
      "code": 6005,
      "name": "DisallowedConfigValue",
      "msg": "The admin is trying to set a configurable to a disallowed value"
    },
    {
      "code": 6006,
      "name": "MinLimitAmountNotMet",
      "msg": "Your size is not size. Try a bigger limit order"
    }
  ]
};

export const IDL: Clob = {
  "version": "0.1.0",
  "name": "clob",
  "instructions": [
    {
      "name": "initializeGlobalState",
      "accounts": [
        {
          "name": "globalState",
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
        }
      ],
      "args": [
        {
          "name": "admin",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateGlobalState",
      "accounts": [
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newAdmin",
          "type": {
            "option": "publicKey"
          }
        },
        {
          "name": "newTakerFeeInBps",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "newMarketMakerBurnInLamports",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "newDefaultMaxObservationChangePerUpdateBps",
          "type": {
            "option": "u16"
          }
        }
      ]
    },
    {
      "name": "initializeOrderBook",
      "accounts": [
        {
          "name": "base",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "quote",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateOrderBook",
      "accounts": [
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newMaxObservationChangePerUpdateBps",
          "type": "u16"
        },
        {
          "name": "newMinBaseLimitAmount",
          "type": "u64"
        },
        {
          "name": "newMinQuoteLimitAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "sweepFees",
      "accounts": [
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addMarketMaker",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketMaker",
          "type": "publicKey"
        },
        {
          "name": "index",
          "type": "u32"
        }
      ]
    },
    {
      "name": "topUpBalance",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "baseFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteFrom",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketMakerIndex",
          "type": "u32"
        },
        {
          "name": "baseAmount",
          "type": "u64"
        },
        {
          "name": "quoteAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawBalance",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "baseTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteTo",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "marketMakerIndex",
          "type": "u32"
        },
        {
          "name": "baseAmount",
          "type": "u64"
        },
        {
          "name": "quoteAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "submitLimitOrder",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "refId",
          "type": "u32"
        },
        {
          "name": "marketMakerIndex",
          "type": "u8"
        }
      ],
      "returns": "u8"
    },
    {
      "name": "cancelLimitOrder",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderIndex",
          "type": "u8"
        },
        {
          "name": "marketMakerIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "submitTakeOrder",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userBaseAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userQuoteAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "minOut",
          "type": "u64"
        }
      ]
    },
    {
      "name": "getTwap",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": {
        "defined": "TWAPOracle"
      }
    },
    {
      "name": "getMarketMakerBalances",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "makerPubkey",
          "type": "publicKey"
        }
      ],
      "returns": {
        "defined": "MarketMakerBalances"
      }
    },
    {
      "name": "getOrderIndex",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "refId",
          "type": "u32"
        },
        {
          "name": "marketMakerIndex",
          "type": "u8"
        }
      ],
      "returns": {
        "option": "u8"
      }
    },
    {
      "name": "getBestOrders",
      "accounts": [
        {
          "name": "orderBook",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        }
      ],
      "returns": {
        "vec": {
          "defined": "AmountAndPrice"
        }
      }
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "Admins can do the following:",
              "- collect taker fees",
              "- change fees (within bounds)",
              "- change TWAP parameters (within bounds)",
              "- TODO: change min_{quote,base}_limit_amount"
            ],
            "type": "publicKey"
          },
          {
            "name": "takerFeeInBps",
            "docs": [
              "The CLOB needs fees to disincentivize wash trading / TWAP manipulation.",
              "Besides, profits are virtuous :)"
            ],
            "type": "u16"
          },
          {
            "name": "marketMakerBurnInLamports",
            "docs": [
              "Since market maker slots are finite, we need some cost to prevent someone",
              "from taking all the market maker slots. Also, have I mentioned that profits",
              "are virtuous?"
            ],
            "type": "u64"
          },
          {
            "name": "defaultMaxObservationChangePerUpdateBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "orderBook",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "base",
            "type": "publicKey"
          },
          {
            "name": "quote",
            "type": "publicKey"
          },
          {
            "name": "baseVault",
            "type": "publicKey"
          },
          {
            "name": "quoteVault",
            "type": "publicKey"
          },
          {
            "name": "buys",
            "type": {
              "defined": "OrderList"
            }
          },
          {
            "name": "sells",
            "type": {
              "defined": "OrderList"
            }
          },
          {
            "name": "marketMakers",
            "type": {
              "array": [
                {
                  "defined": "MarketMaker"
                },
                64
              ]
            }
          },
          {
            "name": "twapOracle",
            "type": {
              "defined": "TWAPOracle"
            }
          },
          {
            "name": "minBaseLimitAmount",
            "type": "u64"
          },
          {
            "name": "minQuoteLimitAmount",
            "type": "u64"
          },
          {
            "name": "pdaBump",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "inv",
            "type": {
              "defined": "InvariantStorage"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "MarketMakerBalances",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "baseBalance",
            "type": "u64"
          },
          {
            "name": "quoteBalance",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "AmountAndPrice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "FreeBitmap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inner",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "InvariantStorage",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "baseFeesSweepable",
            "type": "u64"
          },
          {
            "name": "quoteFeesSweepable",
            "type": "u64"
          },
          {
            "name": "baseLiabilities",
            "type": "u64"
          },
          {
            "name": "quoteLiabilities",
            "type": "u64"
          },
          {
            "name": "baseLiquidity",
            "type": "u64"
          },
          {
            "name": "quoteLiquidity",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "TWAPOracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lastUpdatedSlot",
            "type": "u64"
          },
          {
            "name": "lastObservedSlot",
            "type": "u64"
          },
          {
            "name": "lastObservation",
            "type": "u64"
          },
          {
            "name": "observationAggregator",
            "type": "u128"
          },
          {
            "name": "maxObservationChangePerUpdateBps",
            "docs": [
              "The most, in basis points, an observation can change per update.",
              "For example, if it is 100 (1%), then the new observation can be between",
              "last_observation * 0.99 and last_observation * 1.01"
            ],
            "type": "u16"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                6
              ]
            }
          }
        ]
      }
    },
    {
      "name": "OrderList",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "side",
            "type": {
              "defined": "StoredSide"
            }
          },
          {
            "name": "bestOrderIdx",
            "type": "u8"
          },
          {
            "name": "worstOrderIdx",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                5
              ]
            }
          },
          {
            "name": "freeBitmap",
            "type": {
              "defined": "FreeBitmap"
            }
          },
          {
            "name": "orders",
            "type": {
              "array": [
                {
                  "defined": "Order"
                },
                128
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nextIdx",
            "type": "u8"
          },
          {
            "name": "prevIdx",
            "type": "u8"
          },
          {
            "name": "marketMakerIndex",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "refId",
            "type": "u32"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "amountIn",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MarketMaker",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "baseBalance",
            "type": "u64"
          },
          {
            "name": "quoteBalance",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "StoredSide",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "inner",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "Side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Buy"
          },
          {
            "name": "Sell"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "IndexAlreadyTaken",
      "msg": "Tried to become a market maker in an index that is already taken"
    },
    {
      "code": 6001,
      "name": "UnauthorizedMarketMaker",
      "msg": "This signer does not have authority over this market maker index"
    },
    {
      "code": 6002,
      "name": "InferiorPrice",
      "msg": "This limit order's price was not good enough to land on the order book"
    },
    {
      "code": 6003,
      "name": "TakeNotFilled",
      "msg": "This take order could not be filled at this `min_out`"
    },
    {
      "code": 6004,
      "name": "MakerNotFound",
      "msg": "Unable to find this maker for this market"
    },
    {
      "code": 6005,
      "name": "DisallowedConfigValue",
      "msg": "The admin is trying to set a configurable to a disallowed value"
    },
    {
      "code": 6006,
      "name": "MinLimitAmountNotMet",
      "msg": "Your size is not size. Try a bigger limit order"
    }
  ]
};
