/*
 & Mutations {
  debit {
    amount: Currency<usd>
  }

  lock {}

  unlock {}
}

{
  name: 'mutations',
  declarations: [
    {
      name: 'debit',
      args: [
        {
          name: 'amount',
          type: 'full',
          typeDef: [
            {
              type: 'type',
              name: {
                type: 'currency',
                denomination: 'usd',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'lock',
      args: [],
    },
    {
      name: 'unlock',
      args: [],
    },
  ],
},
*/
