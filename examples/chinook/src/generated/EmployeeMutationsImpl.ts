import { CreateArgs } from "./EmployeeMutations.js";
import { Changeset } from "@aphro/runtime-ts";
import { Data } from "./Employee.js";
import Employee from "./Employee.js";
import { IMutationBuilder, sid } from "@aphro/runtime-ts";
import deviceId from "../deviceId.js";

export function createImpl(
  mutator: Omit<IMutationBuilder<Employee, Data>, "toChangeset">,
  {
    lastName,
    firstName,
    title,
    reportsTo,
    birthdate,
    hiredate,
    address,
    city,
    state,
    country,
    postalCode,
    phone,
    fax,
    email,
  }: CreateArgs
): void | Changeset<any>[] {
  mutator.set({
    id: sid(deviceId),
    lastName,
    firstName,
    title,
    reportsToId: reportsTo?.id,
    birthdate,
    hiredate,
    address,
    city,
    state,
    country,
    postalCode,
    phone,
    fax,
    email,
  });
}
