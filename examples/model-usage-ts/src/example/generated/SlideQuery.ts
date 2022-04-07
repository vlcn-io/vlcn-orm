// SIGNED-SOURCE: <a72d0bf342f08c60c2ee77e85f6a1da0>
import { DerivedQuery } from '@aphro/query-runtime-ts';
import { QueryFactory } from '@aphro/query-runtime-ts';
import { modelLoad } from '@aphro/query-runtime-ts';
import { filter } from '@aphro/query-runtime-ts';
import { Predicate } from '@aphro/query-runtime-ts';
import { P } from '@aphro/query-runtime-ts';
import { ModelFieldGetter } from '@aphro/query-runtime-ts';
import { SID_of } from '@strut/sid';
import Slide from './Slide.js';
import { Data } from './Slide.js';
import { spec } from './Slide.js';
import Slid from './Slid.js';
import Deck from './Deck.js';
import { spec as ComponentSpec } from './Component';
import ComponentQuery from './ComponentQuery';

export default class SlideQuery extends DerivedQuery<Slide> {
  static create() {
    return new SlideQuery(QueryFactory.createSourceQueryFor(spec), modelLoad(spec.createFrom));
  }

  static fromId(id: SID_of<Slide>) {
    return this.create().whereId(P.equals(id));
  }

  whereId(p: Predicate<Data['id']>) {
    return new SlideQuery(this, filter(new ModelFieldGetter<'id', Data, Slide>('id'), p));
  }

  whereDeckId(p: Predicate<Data['deckId']>) {
    return new SlideQuery(this, filter(new ModelFieldGetter<'deckId', Data, Slide>('deckId'), p));
  }

  whereOrder(p: Predicate<Data['order']>) {
    return new SlideQuery(this, filter(new ModelFieldGetter<'order', Data, Slide>('order'), p));
  }
  queryComponents(): ComponentQuery {
    return new ComponentQuery(
      QueryFactory.createHopQueryFor(this, spec, ComponentSpec),
      modelLoad(ComponentSpec.createFrom),
    ).whereSlideId(P.equals(this.id));
  }
}
