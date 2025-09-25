/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/validator_dashboard.json`.
 */
export type ValidatorDashboard = {
  "address": "9KxB22cPSBkKXJJ9wusjQkfeVUrbT5qzCWdhCpnW5dpC",
  "metadata": {
    "name": "validatorDashboard",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Solana Validator Dashboard Program"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "dashboard",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "setAlertThreshold",
      "discriminator": [
        143,
        67,
        31,
        100,
        94,
        85,
        252,
        130
      ],
      "accounts": [
        {
          "name": "dashboard",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "dashboard"
          ]
        }
      ],
      "args": [
        {
          "name": "threshold",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateValidatorStats",
      "discriminator": [
        69,
        30,
        242,
        213,
        134,
        125,
        215,
        211
      ],
      "accounts": [
        {
          "name": "dashboard",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "dashboard"
          ]
        }
      ],
      "args": [
        {
          "name": "uptime",
          "type": "u64"
        },
        {
          "name": "stakeAmount",
          "type": "u64"
        },
        {
          "name": "commission",
          "type": "u8"
        },
        {
          "name": "rewards",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "validatorDashboard",
      "discriminator": [
        187,
        63,
        30,
        91,
        97,
        125,
        214,
        221
      ]
    }
  ],
  "events": [
    {
      "name": "alertTriggered",
      "discriminator": [
        53,
        35,
        91,
        122,
        2,
        60,
        83,
        248
      ]
    }
  ],
  "types": [
    {
      "name": "alertTriggered",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "validator",
            "type": "pubkey"
          },
          {
            "name": "uptime",
            "type": "u64"
          },
          {
            "name": "threshold",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "validatorDashboard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "uptime",
            "type": "u64"
          },
          {
            "name": "stakeAmount",
            "type": "u64"
          },
          {
            "name": "commission",
            "type": "u8"
          },
          {
            "name": "rewards",
            "type": "u64"
          },
          {
            "name": "alertThreshold",
            "type": "u64"
          },
          {
            "name": "lastUpdated",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
