// SIGNED-SOURCE: <18b112e50d38d2ae80d53d52ef214710>
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
import InvoiceLine from "../InvoiceLine.js";
import { Data } from "./InvoiceLineBase.js";
import InvoiceLineSpec from "./InvoiceLineSpec.js";
import Invoice from "../Invoice.js";
import Track from "../Track.js";
import TrackSpec from "./TrackSpec.js";
import TrackQuery from "./TrackQuery.js";
import InvoiceSpec from "./InvoiceSpec.js";
import InvoiceQuery from "./InvoiceQuery.js";

export default class InvoiceLineQuery extends DerivedQuery<InvoiceLine> {
  static create(ctx: Context) {
    return new InvoiceLineQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, InvoiceLineSpec),
      modelLoad(ctx, InvoiceLineSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new InvoiceLineQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): InvoiceLineQuery {
    return new InvoiceLineQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<InvoiceLine>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, InvoiceLine>("id"), p)
    );
  }

  whereInvoiceId(p: Predicate<Data["invoiceId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"invoiceId", Data, InvoiceLine>("invoiceId"),
        p
      )
    );
  }

  whereTrackId(p: Predicate<Data["trackId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"trackId", Data, InvoiceLine>("trackId"), p)
    );
  }

  whereUnitPrice(p: Predicate<Data["unitPrice"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"unitPrice", Data, InvoiceLine>("unitPrice"),
        p
      )
    );
  }

  whereQuantity(p: Predicate<Data["quantity"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"quantity", Data, InvoiceLine>("quantity"), p)
    );
  }
  queryTrack(): TrackQuery {
    return new TrackQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        InvoiceLineSpec.outboundEdges.track
      ),
      modelLoad(this.ctx, TrackSpec.createFrom)
    );
  }
  queryInvoice(): InvoiceQuery {
    return new InvoiceQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        InvoiceLineSpec.outboundEdges.invoice
      ),
      modelLoad(this.ctx, InvoiceSpec.createFrom)
    );
  }

  take(n: number) {
    return new InvoiceLineQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, InvoiceLine>("id"), direction)
    );
  }

  orderByInvoiceId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"invoiceId", Data, InvoiceLine>("invoiceId"),
        direction
      )
    );
  }

  orderByTrackId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"trackId", Data, InvoiceLine>("trackId"),
        direction
      )
    );
  }

  orderByUnitPrice(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"unitPrice", Data, InvoiceLine>("unitPrice"),
        direction
      )
    );
  }

  orderByQuantity(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"quantity", Data, InvoiceLine>("quantity"),
        direction
      )
    );
  }
}
