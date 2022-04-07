// SIGNED-SOURCE: <6dc8d22e5042469b48f989373c6fcae6>
import { Model } from "@aphro/model-runtime-ts";
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
