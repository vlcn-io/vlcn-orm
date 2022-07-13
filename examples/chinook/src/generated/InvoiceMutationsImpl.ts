import { CreateArgs } from "./InvoiceMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Invoice.js";
import Invoice from "./Invoice.js";
import { IMutationBuilder, sid } from "@aphro/runtime-ts";
import deviceId from "../deviceId.js";

export function createImpl(
  mutator: Omit<IMutationBuilder<Invoice, Data>, "toChangeset">,
  {
    customer,
    invoiceDate,
    billingAddress,
    billingCity,
    billingState,
    billingCountry,
    billingPostalCode,
    total,
  }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    customerId: customer.id,
    invoiceDate,
    billingAddress,
    billingCity,
    billingState,
    billingCountry,
    billingPostalCode,
    total,
  });
}
