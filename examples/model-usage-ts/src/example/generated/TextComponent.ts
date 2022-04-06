// SIGNED-SOURCE: <67b88121f0596351cf6e979c93923843>
import { Model, Spec } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";

export type Data = {
  id: SID_of<any>;
  content: string;
};

export default class TextComponent extends Model<Data> {
  get id(): SID_of<any> {
    return this.data.id;
  }

  get content(): string {
    return this.data.content;
  }
}

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new TextComponent(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "example",
    type: "sql",
    tablish: "textcomponent",
  },
};
