// SIGNED-SOURCE: <5c6c30c8de7b625deb1f5441fd1c9662>
import { Model } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";

export type Data = {
  id: SID_of<Component>;
  subtype: "Text" | "Embed";
  slideId: SID_of<Slide>;
  content: string;
};

export default class Component extends Model<Data> {
  get id(): SID_of<Component> {
    return this.data.id;
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
