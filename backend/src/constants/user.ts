import { COUNTRIES, ETHNICITY } from "@shared/constants/user";

export const FAKE_COUNTRY_DISTRIBUTION = {
  "United States": 40,
  "United Kingdom": 20,
  Canada: 16,
  Australia: 15,
  India: 14,
  Germany: 13,
  France: 12,
  Netherlands: 11,
  Sweden: 10,
  Italy: 9,
  Spain: 8,
  Brazil: 7,
  "South Korea": 3,
  Japan: 2,
  Mexico: 5,
  Russia: 5,
  "South Africa": 4,
  Philippines: 4,
  Malaysia: 3,
  Singapore: 3,
  "New Zealand": 3,
  Ireland: 3,
  Belgium: 2,
  Norway: 2,
  Denmark: 2,
  Finland: 2,
  Poland: 2,
  Austria: 2,
  Switzerland: 1,
  Portugal: 1,
  Greece: 1,
  Hungary: 1,
  "Czech Republic": 1,
  Romania: 1,
  Turkey: 1,
  "Saudi Arabia": 1,
  "United Arab Emirates": 1,
  Israel: 1,
  Thailand: 1,
  Indonesia: 1,
} as const;

export const FAKE_MAIN_ETHNICITY: {
  [K in keyof typeof FAKE_COUNTRY_DISTRIBUTION]: (typeof ETHNICITY)[number];
} = {
  "United States": "White",
  "United Kingdom": "White",
  Canada: "White",
  Australia: "White",
  India: "Asian",
  Germany: "White",
  France: "White",
  Netherlands: "White",
  Sweden: "White",
  Italy: "White",
  Spain: "White",
  Brazil: "White",
  "South Korea": "Asian",
  Japan: "Asian",
  Mexico: "Latino",
  Russia: "White",
  "South Africa": "Black",
  Philippines: "Asian",
  Malaysia: "Asian",
  Singapore: "Asian",
  "New Zealand": "White",
  Ireland: "White",
  Belgium: "White",
  Norway: "White",
  Denmark: "White",
  Finland: "White",
  Poland: "White",
  Austria: "White",
  Switzerland: "White",
  Portugal: "White",
  Greece: "White",
  Hungary: "White",
  "Czech Republic": "White",
  Romania: "White",
  Turkey: "Asian",
  "Saudi Arabia": "Asian",
  "United Arab Emirates": "Asian",
  Israel: "Asian",
  Thailand: "Asian",
  Indonesia: "Asian",
};

export const FAKE_OTHER_RACE_PROB: {
  [K in keyof typeof FAKE_COUNTRY_DISTRIBUTION]: number;
} = {
  "United States": 0.3,
  "United Kingdom": 0.2,
  Canada: 0.3,
  Australia: 0.4,
  India: 0.01,
  Germany: 0.2,
  France: 0.25,
  Netherlands: 0.15,
  Sweden: 0.25,
  Italy: 0.15,
  Spain: 0.15,
  Brazil: 0.1,
  "South Korea": 0.01,
  Japan: 0.01,
  Mexico: 0.05,
  Russia: 0.05,
  "South Africa": 0.1,
  Philippines: 0.01,
  Malaysia: 0.01,
  Singapore: 0.05,
  "New Zealand": 0.15,
  Ireland: 0.2,
  Belgium: 0.25,
  Norway: 0.1,
  Denmark: 0.15,
  Finland: 0.1,
  Poland: 0.05,
  Austria: 0.2,
  Switzerland: 0.15,
  Portugal: 0.1,
  Greece: 0.1,
  Hungary: 0.05,
  "Czech Republic": 0.05,
  Romania: 0.02,
  Turkey: 0.1,
  "Saudi Arabia": 0.001,
  "United Arab Emirates": 0.001,
  Israel: 0.01,
  Thailand: 0.03,
  Indonesia: 0.01,
};

export const FAKE_AGE_DISTRIBUTION = {
  18: 50,
  19: 52,
  20: 54,
  21: 54,
  22: 54,
  23: 54,
  24: 52,
  25: 50,
  26: 48,
  27: 45,
  28: 40,
  29: 38,
  30: 34,
  31: 28,
  32: 25,
  33: 20,
  34: 15,
  35: 10,
  36: 5,
  37: 3,
  38: 2,
  39: 1,
  40: 0.5,
  41: 0.5,
  42: 0.4,
  43: 0.3,
  44: 0.3,
  45: 0.3,
  46: 0.2,
  47: 0.2,
  48: 0.1,
  49: 0.1,
  50: 0.1,
  51: 0.1,
  52: 0.02,
  53: 0.02,
  54: 0.02,
  55: 0.02,
  56: 0.02,
  57: 0.02,
  58: 0.02,
  59: 0.02,
  60: 0.003,
  61: 0.003,
  62: 0.003,
  63: 0.001,
  64: 0.001,
  65: 0.001,
  66: 0.001,
  67: 0.001,
  68: 0.001,
  69: 0.001,
  70: 0.0005,
  71: 0.0001,
  72: 0.0001,
  73: 0.0001,
  74: 0.0001,
  75: 0.0001,
  76: 0.0001,
  77: 0.0001,
  78: 0.0001,
  79: 0.0001,
  80: 0.0001,
  81: 0.00003,
  82: 0.00003,
  83: 0.00003,
  84: 0.00003,
  85: 0.00001,
  86: 0.00001,
  87: 0.00001,
  88: 0.00001,
  89: 0.00001,
  90: 0.000001,
  91: 0.000001,
  92: 0.000001,
  93: 0.000001,
  94: 0.000001,
  95: 0.000001,
  96: 0.000001,
  97: 0.000001,
  98: 0.000001,
  99: 0.000001,
  100: 0.000001,
  101: 0.0000001,
};
