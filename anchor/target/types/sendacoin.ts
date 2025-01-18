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
          "writable": true
        },
        {
          "name": "merchantTokenAccount",
          "writable": true
        },
        {
          "name": "feeAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
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
          "name": "merchantTokenAccount",
          "docs": [
            "The merchant's token account to verify"
          ]
        },
        {
          "name": "feeAccount",
          "docs": [
            "The fee account to verify"
          ]
        }
      ],
      "args": [
        {
          "name": "orderId",
          "type": "string"
        },
        {
          "name": "expectedAmount",
          "type": "u64"
        }
      ],
      "returns": "bool"
    }
  ]
};
