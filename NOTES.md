# Releases

## Step 1

Run
```
pnpm changeset
```

Select only the packages that were actually modified. `changeset` will discover depedents and bump them correctly.

## Step 2

Run
```
pnpm changeset version
```

Literally "version" rather than some version name/number.

Answer the questions.

## Step 3

Run
```
pnpm install
```

## Step 4


Run
```
pnpm publish -r --access=public --otp=___
```

# Inspiration

https://www.youtube.com/watch?v=rkZzg7Vowao