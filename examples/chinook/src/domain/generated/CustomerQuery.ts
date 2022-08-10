// SIGNED-SOURCE: <636d0f7542cd803899e2d6bc1e1d593a>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */
import { Context } from "@aphro/runtime-ts";
import { DerivedQuery } from "@aphro/runtime-ts";
import { QueryFactory } from "@aphro/runtime-ts";
import { modelLoad } from "@aphro/runtime-ts";
import { filter } from "@aphro/runtime-ts";
import { Predicate } from "@aphro/runtime-ts";
import { take } from "@aphro/runtime-ts";
import { orderBy } from "@aphro/runtime-ts";
import { P } from "@aphro/runtime-ts";
import { ModelFieldGetter } from "@aphro/runtime-ts";
import { Expression } from "@aphro/runtime-ts";
import { EmptyQuery } from "@aphro/runtime-ts";
import { SID_of } from "@aphro/runtime-ts";
import Customer from "../Customer.js";
import { Data } from "./CustomerBase.js";
import CustomerSpec from "./CustomerSpec.js";
import Employee from "../Employee.js";
import EmployeeSpec from "./EmployeeSpec.js";
import EmployeeQuery from "./EmployeeQuery.js";
import InvoiceSpec from "./InvoiceSpec.js";
import InvoiceQuery from "./InvoiceQuery.js";

export default class CustomerQuery extends DerivedQuery<Customer> {
  static create(ctx: Context) {
    return new CustomerQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, CustomerSpec),
      modelLoad(ctx, CustomerSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new CustomerQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): CustomerQuery {
    return new CustomerQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Customer>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Customer>("id"), p)
    );
  }

  whereFirstName(p: Predicate<Data["firstName"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"firstName", Data, Customer>("firstName"), p)
    );
  }

  whereLastName(p: Predicate<Data["lastName"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"lastName", Data, Customer>("lastName"), p)
    );
  }

  whereCompany(p: Predicate<Data["company"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"company", Data, Customer>("company"), p)
    );
  }

  whereAddress(p: Predicate<Data["address"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"address", Data, Customer>("address"), p)
    );
  }

  whereCity(p: Predicate<Data["city"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"city", Data, Customer>("city"), p)
    );
  }

  whereState(p: Predicate<Data["state"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"state", Data, Customer>("state"), p)
    );
  }

  whereCountry(p: Predicate<Data["country"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"country", Data, Customer>("country"), p)
    );
  }

  wherePostalCode(p: Predicate<Data["postalCode"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"postalCode", Data, Customer>("postalCode"),
        p
      )
    );
  }

  wherePhone(p: Predicate<Data["phone"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"phone", Data, Customer>("phone"), p)
    );
  }

  whereFax(p: Predicate<Data["fax"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"fax", Data, Customer>("fax"), p)
    );
  }

  whereEmail(p: Predicate<Data["email"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"email", Data, Customer>("email"), p)
    );
  }

  whereSupportRepId(p: Predicate<Data["supportRepId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"supportRepId", Data, Customer>("supportRepId"),
        p
      )
    );
  }
  querySupportRep(): EmployeeQuery {
    return new EmployeeQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        CustomerSpec.outboundEdges.supportRep
      ),
      modelLoad(this.ctx, EmployeeSpec.createFrom)
    );
  }
  queryInvoices(): InvoiceQuery {
    return new InvoiceQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        CustomerSpec.outboundEdges.invoices
      ),
      modelLoad(this.ctx, InvoiceSpec.createFrom)
    );
  }

  take(n: number) {
    return new CustomerQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Customer>("id"), direction)
    );
  }

  orderByFirstName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"firstName", Data, Customer>("firstName"),
        direction
      )
    );
  }

  orderByLastName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"lastName", Data, Customer>("lastName"),
        direction
      )
    );
  }

  orderByCompany(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"company", Data, Customer>("company"),
        direction
      )
    );
  }

  orderByAddress(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"address", Data, Customer>("address"),
        direction
      )
    );
  }

  orderByCity(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"city", Data, Customer>("city"), direction)
    );
  }

  orderByState(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"state", Data, Customer>("state"), direction)
    );
  }

  orderByCountry(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"country", Data, Customer>("country"),
        direction
      )
    );
  }

  orderByPostalCode(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"postalCode", Data, Customer>("postalCode"),
        direction
      )
    );
  }

  orderByPhone(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"phone", Data, Customer>("phone"), direction)
    );
  }

  orderByFax(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"fax", Data, Customer>("fax"), direction)
    );
  }

  orderByEmail(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"email", Data, Customer>("email"), direction)
    );
  }

  orderBySupportRepId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"supportRepId", Data, Customer>("supportRepId"),
        direction
      )
    );
  }
}
