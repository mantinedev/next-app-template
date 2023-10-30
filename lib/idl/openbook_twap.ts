export type OpenbookTwap = {
  version: '0.1.0';
  name: 'openbook_twap';
  instructions: [
    {
      name: 'createTwapMarket';
      accounts: [
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'twapMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
      ];
      args: [
        {
          name: 'expectedValue';
          type: 'u64';
        },
      ];
    },
    {
      name: 'placeOrder';
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'twapMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openbookProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'placeOrderArgs';
          type: {
            defined: 'PlaceOrderArgs';
          };
        },
      ];
      returns: {
        option: 'u128';
      };
    },
    {
      name: 'editOrder';
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'twapMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userTokenAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openbookProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'clientOrderId';
          type: 'u64';
        },
        {
          name: 'expectedCancelSize';
          type: 'i64';
        },
        {
          name: 'placeOrder';
          type: {
            defined: 'PlaceOrderArgs';
          };
        },
      ];
      returns: {
        option: 'u128';
      };
    },
    {
      name: 'cancelOrderByClientId';
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'twapMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openbookProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'clientOrderId';
          type: 'u64';
        },
      ];
      returns: 'i64';
    },
    {
      name: 'cancelAllOrders';
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'twapMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openbookProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'sideOption';
          type: {
            option: {
              defined: 'Side';
            };
          };
        },
        {
          name: 'limit';
          type: 'u8';
        },
      ];
    },
    {
      name: 'placeTakeOrder';
      accounts: [
        {
          name: 'twapMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketAuthority';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketBaseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userBaseAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userQuoteAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'referrerAccount';
          isMut: true;
          isSigner: false;
          isOptional: true;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openbookProgram';
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
          name: 'args';
          type: {
            defined: 'PlaceTakeOrderArgs';
          };
        },
      ];
    },
    {
      name: 'cancelAndPlaceOrders';
      accounts: [
        {
          name: 'signer';
          isMut: false;
          isSigner: true;
        },
        {
          name: 'twapMarket';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'openOrdersAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userQuoteAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'userBaseAccount';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'market';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'eventHeap';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketQuoteVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'marketBaseVault';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'tokenProgram';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'openbookProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'cancelClientOrdersIds';
          type: {
            vec: 'u64';
          };
        },
        {
          name: 'placeOrders';
          type: {
            vec: {
              defined: 'PlaceOrderArgs';
            };
          };
        },
      ];
      returns: {
        vec: {
          option: 'u128';
        };
      };
    },
    {
      name: 'getBestBidAndAsk';
      accounts: [
        {
          name: 'market';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'bids';
          isMut: false;
          isSigner: false;
        },
        {
          name: 'asks';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
      returns: {
        vec: 'u64';
      };
    },
  ];
  accounts: [
    {
      name: 'twapMarket';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'market';
            type: 'publicKey';
          },
          {
            name: 'pdaBump';
            type: 'u8';
          },
          {
            name: 'twapOracle';
            type: {
              defined: 'TWAPOracle';
            };
          },
        ];
      };
    },
  ];
  types: [
    {
      name: 'TWAPOracle';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'expectedValue';
            type: 'u64';
          },
          {
            name: 'lastUpdatedSlot';
            type: 'u64';
          },
          {
            name: 'lastObservedSlot';
            type: 'u64';
          },
          {
            name: 'lastObservation';
            type: 'u64';
          },
          {
            name: 'observationAggregator';
            type: 'u128';
          },
          {
            name: 'maxObservationChangePerUpdateBps';
            docs: [
              'The most, in basis points, an observation can change per update.',
              'For example, if it is 100 (1%), then the new observation can be between',
              'last_observation * 0.99 and last_observation * 1.01',
            ];
            type: 'u16';
          },
          {
            name: 'padding';
            type: {
              array: ['u8', 6];
            };
          },
        ];
      };
    },
    {
      name: 'PlaceOrderArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'side';
            type: {
              defined: 'Side';
            };
          },
          {
            name: 'priceLots';
            type: 'i64';
          },
          {
            name: 'maxBaseLots';
            type: 'i64';
          },
          {
            name: 'maxQuoteLotsIncludingFees';
            type: 'i64';
          },
          {
            name: 'clientOrderId';
            type: 'u64';
          },
          {
            name: 'orderType';
            type: {
              defined: 'PlaceOrderType';
            };
          },
          {
            name: 'expiryTimestamp';
            type: 'u64';
          },
          {
            name: 'selfTradeBehavior';
            type: {
              defined: 'SelfTradeBehavior';
            };
          },
          {
            name: 'limit';
            type: 'u8';
          },
        ];
      };
    },
    {
      name: 'PlaceTakeOrderArgs';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'side';
            type: {
              defined: 'Side';
            };
          },
          {
            name: 'priceLots';
            type: 'i64';
          },
          {
            name: 'maxBaseLots';
            type: 'i64';
          },
          {
            name: 'maxQuoteLotsIncludingFees';
            type: 'i64';
          },
          {
            name: 'orderType';
            type: {
              defined: 'PlaceOrderType';
            };
          },
          {
            name: 'limit';
            type: 'u8';
          },
        ];
      };
    },
    {
      name: 'SelfTradeBehavior';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'DecrementTake';
          },
          {
            name: 'CancelProvide';
          },
          {
            name: 'AbortTransaction';
          },
        ];
      };
    },
    {
      name: 'PlaceOrderType';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Limit';
          },
          {
            name: 'ImmediateOrCancel';
          },
          {
            name: 'PostOnly';
          },
          {
            name: 'Market';
          },
          {
            name: 'PostOnlySlide';
          },
        ];
      };
    },
    {
      name: 'Side';
      type: {
        kind: 'enum';
        variants: [
          {
            name: 'Bid';
          },
          {
            name: 'Ask';
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'InvalidOpenOrdersAdmin';
      msg: 'The `open_orders_admin` of the underlying market must be equal to the `TWAPMarket` PDA';
    },
    {
      code: 6001;
      name: 'InvalidCloseMarketAdmin';
      msg: 'The `close_market_admin` of the underlying market must be equal to the `TWAPMarket` PDA';
    },
    {
      code: 6002;
      name: 'NonZeroExpiry';
      msg: 'Market must not expire (have `time_expiry` == 0)';
    },
    {
      code: 6003;
      name: 'NoOracles';
      msg: "Oracle-pegged trades mess up the TWAP so oracles and oracle-pegged trades aren't allowed";
    },
    {
      code: 6004;
      name: 'InvalidExpectedValue';
      msg: 'Expected value must be gte 0';
    },
  ];
};

export const IDL: OpenbookTwap = {
  version: '0.1.0',
  name: 'openbook_twap',
  instructions: [
    {
      name: 'createTwapMarket',
      accounts: [
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'twapMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: 'expectedValue',
          type: 'u64',
        },
      ],
    },
    {
      name: 'placeOrder',
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'twapMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openbookProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'placeOrderArgs',
          type: {
            defined: 'PlaceOrderArgs',
          },
        },
      ],
      returns: {
        option: 'u128',
      },
    },
    {
      name: 'editOrder',
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'twapMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userTokenAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openbookProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'clientOrderId',
          type: 'u64',
        },
        {
          name: 'expectedCancelSize',
          type: 'i64',
        },
        {
          name: 'placeOrder',
          type: {
            defined: 'PlaceOrderArgs',
          },
        },
      ],
      returns: {
        option: 'u128',
      },
    },
    {
      name: 'cancelOrderByClientId',
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'twapMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openbookProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'clientOrderId',
          type: 'u64',
        },
      ],
      returns: 'i64',
    },
    {
      name: 'cancelAllOrders',
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'twapMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openbookProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'sideOption',
          type: {
            option: {
              defined: 'Side',
            },
          },
        },
        {
          name: 'limit',
          type: 'u8',
        },
      ],
    },
    {
      name: 'placeTakeOrder',
      accounts: [
        {
          name: 'twapMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketAuthority',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketBaseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userBaseAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userQuoteAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'referrerAccount',
          isMut: true,
          isSigner: false,
          isOptional: true,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openbookProgram',
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
          name: 'args',
          type: {
            defined: 'PlaceTakeOrderArgs',
          },
        },
      ],
    },
    {
      name: 'cancelAndPlaceOrders',
      accounts: [
        {
          name: 'signer',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'twapMarket',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'openOrdersAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userQuoteAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'userBaseAccount',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'market',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'eventHeap',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketQuoteVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'marketBaseVault',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'tokenProgram',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'openbookProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'cancelClientOrdersIds',
          type: {
            vec: 'u64',
          },
        },
        {
          name: 'placeOrders',
          type: {
            vec: {
              defined: 'PlaceOrderArgs',
            },
          },
        },
      ],
      returns: {
        vec: {
          option: 'u128',
        },
      },
    },
    {
      name: 'getBestBidAndAsk',
      accounts: [
        {
          name: 'market',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'bids',
          isMut: false,
          isSigner: false,
        },
        {
          name: 'asks',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
      returns: {
        vec: 'u64',
      },
    },
  ],
  accounts: [
    {
      name: 'twapMarket',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'market',
            type: 'publicKey',
          },
          {
            name: 'pdaBump',
            type: 'u8',
          },
          {
            name: 'twapOracle',
            type: {
              defined: 'TWAPOracle',
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: 'TWAPOracle',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'expectedValue',
            type: 'u64',
          },
          {
            name: 'lastUpdatedSlot',
            type: 'u64',
          },
          {
            name: 'lastObservedSlot',
            type: 'u64',
          },
          {
            name: 'lastObservation',
            type: 'u64',
          },
          {
            name: 'observationAggregator',
            type: 'u128',
          },
          {
            name: 'maxObservationChangePerUpdateBps',
            docs: [
              'The most, in basis points, an observation can change per update.',
              'For example, if it is 100 (1%), then the new observation can be between',
              'last_observation * 0.99 and last_observation * 1.01',
            ],
            type: 'u16',
          },
          {
            name: 'padding',
            type: {
              array: ['u8', 6],
            },
          },
        ],
      },
    },
    {
      name: 'PlaceOrderArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'side',
            type: {
              defined: 'Side',
            },
          },
          {
            name: 'priceLots',
            type: 'i64',
          },
          {
            name: 'maxBaseLots',
            type: 'i64',
          },
          {
            name: 'maxQuoteLotsIncludingFees',
            type: 'i64',
          },
          {
            name: 'clientOrderId',
            type: 'u64',
          },
          {
            name: 'orderType',
            type: {
              defined: 'PlaceOrderType',
            },
          },
          {
            name: 'expiryTimestamp',
            type: 'u64',
          },
          {
            name: 'selfTradeBehavior',
            type: {
              defined: 'SelfTradeBehavior',
            },
          },
          {
            name: 'limit',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'PlaceTakeOrderArgs',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'side',
            type: {
              defined: 'Side',
            },
          },
          {
            name: 'priceLots',
            type: 'i64',
          },
          {
            name: 'maxBaseLots',
            type: 'i64',
          },
          {
            name: 'maxQuoteLotsIncludingFees',
            type: 'i64',
          },
          {
            name: 'orderType',
            type: {
              defined: 'PlaceOrderType',
            },
          },
          {
            name: 'limit',
            type: 'u8',
          },
        ],
      },
    },
    {
      name: 'SelfTradeBehavior',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'DecrementTake',
          },
          {
            name: 'CancelProvide',
          },
          {
            name: 'AbortTransaction',
          },
        ],
      },
    },
    {
      name: 'PlaceOrderType',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Limit',
          },
          {
            name: 'ImmediateOrCancel',
          },
          {
            name: 'PostOnly',
          },
          {
            name: 'Market',
          },
          {
            name: 'PostOnlySlide',
          },
        ],
      },
    },
    {
      name: 'Side',
      type: {
        kind: 'enum',
        variants: [
          {
            name: 'Bid',
          },
          {
            name: 'Ask',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'InvalidOpenOrdersAdmin',
      msg: 'The `open_orders_admin` of the underlying market must be equal to the `TWAPMarket` PDA',
    },
    {
      code: 6001,
      name: 'InvalidCloseMarketAdmin',
      msg: 'The `close_market_admin` of the underlying market must be equal to the `TWAPMarket` PDA',
    },
    {
      code: 6002,
      name: 'NonZeroExpiry',
      msg: 'Market must not expire (have `time_expiry` == 0)',
    },
    {
      code: 6003,
      name: 'NoOracles',
      msg: "Oracle-pegged trades mess up the TWAP so oracles and oracle-pegged trades aren't allowed",
    },
    {
      code: 6004,
      name: 'InvalidExpectedValue',
      msg: 'Expected value must be gte 0',
    },
  ],
};
