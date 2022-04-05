TODO:
1. Validation step...
   1. To ensure foreign key edges have an appropriate inverse field edge
      1. on the other schema.
2. Enable model superclasses / traits
3. IDL
4. Stop using keys from edges / fields
5. Docs
6. Edge queries and edge data
7. Semantic types

Are the synthetic transactions not good enough / not doing it?

What does a non synth tx look like?
Slide, Deck, etc. mutation methods return changesets?
Changesets are accumulated and then executed by the caller?

Does the model never execute its own changesets?
But it is on the client code to decide how many changesets to accumulate before executing them?

What if a model needs some transient state (changesets to be committed) before it can do more?

---

If it is up to clients to commit changesets then they are better able to integrate more disperate systems that they may want to mutate atomically.

But if a client becomes a client? What happens to the changesets it was executing? Does it now have to pass them back instead?

---
