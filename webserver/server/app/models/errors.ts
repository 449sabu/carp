import type { PaginationType } from '../services/PaginationService';

export enum ErrorCodes {
  // we explicitly add the numbers to this enum
  // that way removing an entry in the future isn't a breaking change
  AddressLimitExceeded = 0,
  IncorrectAddressFormat = 1,
  UntilBlockNotFound = 2,
  PageStartNotFound = 3,
}

export type ErrorShape = {
  code: number;
  reason: string;
};

export const Errors = {
  AddressLimitExceeded: {
    code: ErrorCodes.AddressLimitExceeded,
    prefix: 'Exceeded request address limit.',
    detailsGen: (details: { limit: number; found: number }) =>
      `Limit of ${details.limit}, found ${details.found}`,
  },
  IncorrectAddressFormat: {
    code: ErrorCodes.IncorrectAddressFormat,
    prefix: 'Incorrectly formatted addresses found.',
    detailsGen: (details: { addresses: string[] }) => JSON.stringify(details.addresses),
  },
  UntilBlockNotFound: {
    code: ErrorCodes.UntilBlockNotFound,
    prefix: 'Until block not found.',
    detailsGen: (details: { untilBlock: string }) => `Searched block hash: ${details.untilBlock}`,
  },
  PageStartNotFound: {
    code: ErrorCodes.PageStartNotFound,
    prefix: 'After block and/or transaction not found.',
    detailsGen: (details: { blockHash: string; txHash: string }) =>
      `Searched block hash ${details.blockHash} and tx hash ${details.txHash}`,
  },
} as const;

export function genErrorMessage<T extends typeof Errors[keyof typeof Errors]>(
  type: T,
  details: Parameters<T['detailsGen']>[0]
): {
  code: T['code'];
  reason: string;
} {
  const generatedDetails = type.detailsGen(details as any);
  return {
    code: type.code,
    reason: generatedDetails.length === 0 ? type.prefix : `${type.prefix} ${generatedDetails}`,
  };
}