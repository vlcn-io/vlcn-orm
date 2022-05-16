// SIGNED-SOURCE: <da1eb71575386b14178d5fb92a990409>
import { default as s } from "./ComponentSpec.js";
import { P } from "@aphro/query-runtime-ts";
import { Model } from "@aphro/model-runtime-ts";
import { ModelSpec } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";
import Slide from "./Slide.js";

export type Data = {
  id: SID_of<Component>;
  subtype: "Text" | "Embed";
  slideId: SID_of<Slide>;
  content: string;
};

export default class Component extends Model<Data> {
  readonly spec = s as ModelSpec<this, Data>;

  get id(): SID_of<this> {
    return this.data.id as SID_of<this>;
  }

  get subtype(): "Text" | "Embed" {
    return this.data.subtype;
  }

  get slideId(): SID_of<Slide> {
    return this.data.slideId;
  }

  get content(): string {
    return this.data.content;
  }
}
