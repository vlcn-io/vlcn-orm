To support:

```sql
select artistId, count(*) from album group by artistId order by count(*) desc
```

```ts
aritst.queryAll().orderBy(a => a.queryAlbums().count());
```

Ordering by a query from the source would just be a join?

It is:
1. An aggregation via grouping against the source id
2. an ordering by the count

```sql
select artist.*, count(*) from artist join album on album.artistId = artist.id group by artist.id order by count(*)
```

```ts
artist.queryAll().wantData().queryAlbums().count()
```

to get the artists + their album count.

simpler example:

```ts
artist.queryAll().wantData().queryAlbums().gen()
```

result:
```sql
select artist.*, album.* from artist join album on album.artistId = artist.id
```