import { CreateArgs } from "./CustomerMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Customer.js";
import Customer from "./Customer.js";
import { IMutationBuilder, sid } from "@aphro/runtime-ts";
import deviceId from "../deviceId.js";

export function createImpl(
  mutator: Omit<IMutationBuilder<Customer, Data>, "toChangeset">,
  { firstName, lastName, email, supportRep }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    firstName,
    lastName,
    email,
    supportRepId: supportRep.id,
  });
}
