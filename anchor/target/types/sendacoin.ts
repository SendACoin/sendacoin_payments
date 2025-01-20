/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sendacoin.json`.
 */
export type Sendacoin = {
  "address": "F5jE4FMaARnKG79qLMtaGmhNHjb1LM9s2Bo3wH6QYZRK",
  "metadata": {
    "name": "sendacoin",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "processOrder",
      "discriminator": [
        126,
        54,
        252,
        181,
        254,
        163,
        107,
        165
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "payerTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "merchantTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "feeAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "tokenProgram",
          "optional": true,
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "merchantWallet",
          "writable": true,
          "optional": true
        },
        {
          "name": "feeWallet",
          "writable": true,
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "paymentDetails",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "orderId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "orderId",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "isSol",
          "type": "bool"
        }
      ]
    },
    {
      "name": "verifyPayment",
      "discriminator": [
        70,
        155,
        98,
        44,
        176,
        110,
        74,
        169
      ],
      "accounts": [
        {
          "name": "paymentDetails",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  121,
                  109,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "orderId"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "orderId",
          "type": "string"
        }
      ],
      "returns": {
        "defined": {
          "name": "paymentResponse"
        }
      }
    }
  ],
  "accounts": [
    {
      "name": "paymentDetails",
      "discriminator": [
        206,
        98,
        33,
        156,
        142,
        201,
        81,
        174
      ]
    }
  ],
  "types": [
    {
      "name": "paymentDetails",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "isSol",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "tokenMint",
            "type": {
              "option": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "paymentResponse",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "string"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "merchantAmount",
            "type": "u64"
          },
          {
            "name": "feeAmount",
            "type": "u64"
          },
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "merchant",
            "type": "pubkey"
          },
          {
            "name": "isSol",
            "type": "bool"
          },
          {
            "name": "tokenMint",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
