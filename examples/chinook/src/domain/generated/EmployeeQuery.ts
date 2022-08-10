// SIGNED-SOURCE: <75344a5467049e797193e66e2e985262>
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
import Employee from "../Employee.js";
import { Data } from "./EmployeeBase.js";
import EmployeeSpec from "./EmployeeSpec.js";
import CustomerSpec from "./CustomerSpec.js";
import CustomerQuery from "./CustomerQuery.js";

export default class EmployeeQuery extends DerivedQuery<Employee> {
  static create(ctx: Context) {
    return new EmployeeQuery(
      ctx,
      QueryFactory.createSourceQueryFor(ctx, EmployeeSpec),
      modelLoad(ctx, EmployeeSpec.createFrom)
    );
  }

  static empty(ctx: Context) {
    return new EmployeeQuery(ctx, new EmptyQuery(ctx));
  }

  protected derive(expression: Expression): EmployeeQuery {
    return new EmployeeQuery(this.ctx, this, expression);
  }

  static fromId(ctx: Context, id: SID_of<Employee>) {
    return this.create(ctx).whereId(P.equals(id));
  }

  whereId(p: Predicate<Data["id"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"id", Data, Employee>("id"), p)
    );
  }

  whereLastName(p: Predicate<Data["lastName"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"lastName", Data, Employee>("lastName"), p)
    );
  }

  whereFirstName(p: Predicate<Data["firstName"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"firstName", Data, Employee>("firstName"), p)
    );
  }

  whereTitle(p: Predicate<Data["title"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"title", Data, Employee>("title"), p)
    );
  }

  whereReportsToId(p: Predicate<Data["reportsToId"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"reportsToId", Data, Employee>("reportsToId"),
        p
      )
    );
  }

  whereBirthdate(p: Predicate<Data["birthdate"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"birthdate", Data, Employee>("birthdate"), p)
    );
  }

  whereHiredate(p: Predicate<Data["hiredate"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"hiredate", Data, Employee>("hiredate"), p)
    );
  }

  whereAddress(p: Predicate<Data["address"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"address", Data, Employee>("address"), p)
    );
  }

  whereCity(p: Predicate<Data["city"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"city", Data, Employee>("city"), p)
    );
  }

  whereState(p: Predicate<Data["state"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"state", Data, Employee>("state"), p)
    );
  }

  whereCountry(p: Predicate<Data["country"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"country", Data, Employee>("country"), p)
    );
  }

  wherePostalCode(p: Predicate<Data["postalCode"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(
        new ModelFieldGetter<"postalCode", Data, Employee>("postalCode"),
        p
      )
    );
  }

  wherePhone(p: Predicate<Data["phone"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"phone", Data, Employee>("phone"), p)
    );
  }

  whereFax(p: Predicate<Data["fax"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"fax", Data, Employee>("fax"), p)
    );
  }

  whereEmail(p: Predicate<Data["email"]>) {
    return this.derive(
      // @ts-ignore #43
      filter(new ModelFieldGetter<"email", Data, Employee>("email"), p)
    );
  }
  queryReportsTo(): EmployeeQuery {
    return new EmployeeQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        EmployeeSpec.outboundEdges.reportsTo
      ),
      modelLoad(this.ctx, EmployeeSpec.createFrom)
    );
  }
  querySupports(): CustomerQuery {
    return new CustomerQuery(
      this.ctx,
      QueryFactory.createHopQueryFor(
        this.ctx,
        this,
        EmployeeSpec.outboundEdges.supports
      ),
      modelLoad(this.ctx, CustomerSpec.createFrom)
    );
  }

  take(n: number) {
    return new EmployeeQuery(this.ctx, this, take(n));
  }

  orderById(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"id", Data, Employee>("id"), direction)
    );
  }

  orderByLastName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"lastName", Data, Employee>("lastName"),
        direction
      )
    );
  }

  orderByFirstName(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"firstName", Data, Employee>("firstName"),
        direction
      )
    );
  }

  orderByTitle(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"title", Data, Employee>("title"), direction)
    );
  }

  orderByReportsToId(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"reportsToId", Data, Employee>("reportsToId"),
        direction
      )
    );
  }

  orderByBirthdate(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"birthdate", Data, Employee>("birthdate"),
        direction
      )
    );
  }

  orderByHiredate(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"hiredate", Data, Employee>("hiredate"),
        direction
      )
    );
  }

  orderByAddress(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"address", Data, Employee>("address"),
        direction
      )
    );
  }

  orderByCity(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"city", Data, Employee>("city"), direction)
    );
  }

  orderByState(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"state", Data, Employee>("state"), direction)
    );
  }

  orderByCountry(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"country", Data, Employee>("country"),
        direction
      )
    );
  }

  orderByPostalCode(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(
        new ModelFieldGetter<"postalCode", Data, Employee>("postalCode"),
        direction
      )
    );
  }

  orderByPhone(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"phone", Data, Employee>("phone"), direction)
    );
  }

  orderByFax(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"fax", Data, Employee>("fax"), direction)
    );
  }

  orderByEmail(direction: "asc" | "desc" = "asc") {
    return this.derive(
      orderBy(new ModelFieldGetter<"email", Data, Employee>("email"), direction)
    );
  }
}
