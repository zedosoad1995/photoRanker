import { COUNTRIES, ETHNICITY } from "@shared/constants/user";

export const FAKE_COUNTRY_DISTRIBUTION = {
  "United States": 20,
  "United Kingdom": 18,
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
  "South Korea": 6,
  Japan: 6,
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
  "United States": 0.5,
  "United Kingdom": 0.2,
  Canada: 0.3,
  Australia: 0.4,
  India: 0.02,
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
  18: 10,
  19: 11,
  20: 12,
  21: 12,
  22: 12,
  23: 12,
  24: 11,
  25: 10,
  26: 10,
  27: 9,
  28: 8,
  29: 8,
  30: 7,
  31: 7,
  32: 6,
  33: 5,
  34: 4,
  35: 3,
  36: 3,
  37: 3,
  38: 3,
  39: 2,
  40: 2,
  41: 1,
  42: 1,
  43: 1,
  44: 1,
  45: 1,
  46: 1,
  47: 1,
  48: 1,
  49: 1,
  50: 1,
  51: 0.5,
  52: 0.5,
  53: 0.5,
  54: 0.5,
  55: 0.5,
  56: 0.5,
  57: 0.5,
  58: 0.5,
  59: 0.5,
  60: 0.5,
  61: 0.2,
  62: 0.2,
  63: 0.2,
  64: 0.2,
  65: 0.2,
  66: 0.2,
  67: 0.1,
  68: 0.1,
  69: 0.1,
  70: 0.1,
  71: 0.05,
  72: 0.05,
  73: 0.05,
  74: 0.05,
  75: 0.02,
  76: 0.02,
  77: 0.02,
  78: 0.02,
  79: 0.01,
  80: 0.01,
  81: 0.001,
  82: 0.001,
  83: 0.001,
  84: 0.001,
  85: 0.0001,
  86: 0.0001,
  87: 0.0001,
  88: 0.0001,
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