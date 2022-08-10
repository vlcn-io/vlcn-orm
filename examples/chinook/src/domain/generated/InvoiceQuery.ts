// SIGNED-SOURCE: <54908dd647039580cc78a80986c01054>
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
import Invoice from "../Invoice.js";
import { Data } from "./InvoiceBase.js";
import InvoiceSpec from "./InvoiceSpec.js";
import Customer from "../Customer.js";
import CustomerSpec from "./CustomerSpec.js";
import CustomerQuery from "./CustomerQuery.js";
import InvoiceLineSpec from "./InvoiceLineSpec.js";
import InvoiceLineQuery from "./InvoiceLineQuery.js";

export default class InvoiceQuery extends DerivedQuery<Invoice> {
  static create(ctx: Context) {
    return new InvoiceQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, InvoiceSpec),
      modelLoad(ctx, InvoiceSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new InvoiceQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): InvoiceQuery {
    return new InvoiceQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Invoice>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Invoice>("id"), p)
    );
  }

  whereCustomerId(p: Predicate<Data["customerId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"customerId", Data, Invoice>("customerId"), p)
    );
  }

  whereInvoiceDate(p: Predicate<Data["invoiceDate"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"invoiceDate", Data, Invoice>("invoiceDate"),
        p
      )
    );
  }

  whereBillingAddress(p: Predicate<Data["billingAddress"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"billingAddress", Data, Invoice>("billingAddress"),
        p
      )
    );
  }

  whereBillingCity(p: Predicate<Data["billingCity"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"billingCity", Data, Invoice>("billingCity"),
        p
      )
    );
  }

  whereBillingState(p: Predicate<Data["billingState"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"billingState", Data, Invoice>("billingState"),
        p
      )
    );
  }

  whereBillingCountry(p: Predicate<Data["billingCountry"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"billingCountry", Data, Invoice>("billingCountry"),
        p
      )
    );
  }

  whereBillingPostalCode(p: Predicate<Data["billingPostalCode"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"billingPostalCode", Data, Invoice>(
          "billingPostalCode"
        ),
        p
      )
    );
  }

  whereTotal(p: Predicate<Data["total"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"total", Data, Invoice>("total"), p)
    );
  }
  queryCustomer(): CustomerQuery {
    return new CustomerQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        InvoiceSpec.outboundEdges.customer
      ),
      modelLoad(this.ctx, CustomerSpec.createFrom)
    );
  }
  queryLines(): InvoiceLineQuery {
    return new InvoiceLineQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        InvoiceSpec.outboundEdges.lines
      ),
      modelLoad(this.ctx, InvoiceLineSpec.createFrom)
    );
  }

  take(n: number) {
    return new InvoiceQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Invoice>("id"), direction)
    );
  }

  orderByCustomerId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"customerId", Data, Invoice>("customerId"),
        direction
      )
    );
  }

  orderByInvoiceDate(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"invoiceDate", Data, Invoice>("invoiceDate"),
        direction
      )
    );
  }

  orderByBillingAddress(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"billingAddress", Data, Invoice>("billingAddress"),
        direction
      )
    );
  }

  orderByBillingCity(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"billingCity", Data, Invoice>("billingCity"),
        direction
      )
    );
  }

  orderByBillingState(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"billingState", Data, Invoice>("billingState"),
        direction
      )
    );
  }

  orderByBillingCountry(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"billingCountry", Data, Invoice>("billingCountry"),
        direction
      )
    );
  }

  orderByBillingPostalCode(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"billingPostalCode", Data, Invoice>(
          "billingPostalCode"
        ),
        direction
      )
    );
  }

  orderByTotal(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"total", Data, Invoice>("total"), direction)
    );
  }
}
