// SIGNED-SOURCE: <269394359acecafb6f4e7b1a18d7ceba>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 * For partially generated files, place modifications between the generated `BEGIN-MANUAL-SECTION` and
 * `END-MANUAL-SECTION` markers.
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
import InvoiceLine from "./InvoiceLine.js";
import { Data } from "./InvoiceLine.js";
import { default as spec } from "./InvoiceLineSpec.js";
import Invoice from "./Invoice.js";
import Track from "./Track.js";
import { default as TrackSpec } from "./TrackSpec.js";
import TrackQuery from "./TrackQuery.js";
import { default as InvoiceSpec } from "./InvoiceSpec.js";
import InvoiceQuery from "./InvoiceQuery.js";

export default class InvoiceLineQuery extends DerivedQuery<InvoiceLine> {
  static create(ctx: Context) {
    return new InvoiceLineQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, spec),
      modelLoad(ctx, spec.createFrom)
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
      filter(new ModelFieldGetter<"id", Data, InvoiceLine>("id"), p)
    );
  }

  whereInvoiceId(p: Predicate<Data["invoiceId"]>) {
    return this.derive(
      filter(
        new ModelFieldGetter<"invoiceId", Data, InvoiceLine>("invoiceId"),
        p
      )
    );
  }

  whereTrackId(p: Predicate<Data["trackId"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"trackId", Data, InvoiceLine>("trackId"), p)
    );
  }

  whereUnitPrice(p: Predicate<Data["unitPrice"]>) {
    return this.derive(
      filter(
        new ModelFieldGetter<"unitPrice", Data, InvoiceLine>("unitPrice"),
        p
      )
    );
  }

  whereQuantity(p: Predicate<Data["quantity"]>) {
    return this.derive(
      filter(new ModelFieldGetter<"quantity", Data, InvoiceLine>("quantity"), p)
    );
  }
  queryTrack(): TrackQuery {
    return new TrackQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(this.ctx, this, spec.outboundEdges.track),
      modelLoad(this.ctx, TrackSpec.createFrom)
    );
  }
  queryInvoice(): InvoiceQuery {
    return new InvoiceQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        spec.outboundEdges.invoice
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
