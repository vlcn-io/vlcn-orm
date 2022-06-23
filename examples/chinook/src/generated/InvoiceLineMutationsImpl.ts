import { CreateArgs } from './InvoiceLineMutations.js';
import { Changeset } from '@aphro/runtime-ts';
import { Data } from './InvoiceLine.js';
import InvoiceLine from './InvoiceLine.js';
import { IMutationBuilder, sid } from '@aphro/runtime-ts';
import deviceId from '../deviceId.js';

export function createImpl(
  mutator: Omit<IMutationBuilder<InvoiceLine, Data>, 'toChangeset'>,
  { invoice, track, unitPrice, quantity }: CreateArgs,
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    invoiceId: invoice.id,
    trackId: track.id,
    unitPrice,
    quantity,
  });
}
