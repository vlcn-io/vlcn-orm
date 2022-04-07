// SIGNED-SOURCE: <353803e17adf20930e5b403517e0a26e>
import { Model } from "@aphro/model-runtime-ts";
import { SID_of } from "@strut/sid";

export type Data = {
  id: SID_of<any>;
  subtype: Text | Embed;
  slideId: SID_of<any>;
  content: string;
};

export default class Component extends Model<Data> {
  get id(): SID_of<any> {
    return this.data.id;
  }

  get subtype(): Text | Embed {
    return this.data.subtype;
  }

  get slideId(): SID_of<any> {
    return this.data.slideId;
  }

  get content(): string {
    return this.data.content;
  }
}
