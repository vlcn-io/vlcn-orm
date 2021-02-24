What we can do...

1. Generate the model as the below `InMemoryCache` example

```js
const cache = new InMemoryCache({
  typePolicies: { // Type policy map
    Product: {
      fields: { // Field policy map for the Product type
        isInCart: { // Field policy for the isInCart field
          read(_, { variables }) { // The read function for the isInCart field
            return localStorage.getItem('CART').includes(
              variables.productId
            );
          }
        }
      }
    }
  }
});
```

```js
const GET_PRODUCT_DETAILS = gql`
  query ProductDetails($productId: ID!) {
    product(id: $productId) {
      name
      price
      isInCart @client
    }
  }
`;
```

2. Generate the mutator(s) as below

```js
const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

// https://www.apollographql.com/docs/react/caching/cache-interaction/#writequery-and-writefragment
// write fragment exists too
cache.writeQuery({
  query: IS_LOGGED_IN,
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
  },
});
```

3. On startup, write the entire deck into the apollo cache.

We could also:

> If you're using another storage method, such as localStorage, set the field's new value in whatever method you're using. Then, you can force a refresh of every affected operation by calling cache.evict. In your call, provide both the id of your field's containing object and the name of the local-only field.

---

Other option:
Skip Apollo entirely
Go back to your normal usage of the slide and deck models.
Subscribe to them for updates.
On their modification, set state on the local react component that is subscribed
On local react component removal, unsubscribe
