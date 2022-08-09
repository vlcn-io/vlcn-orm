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

Lamport: https://www.youtube.com/watch?v=rkZzg7Vowao

Solidjs architecture: https://www.youtube.com/watch?v=_ne2BsvFBH0, https://www.youtube.com/watch?v=j8ANWdE7wfY


# Dep Tracking

How might we have Model properties integrated into SolidJS's reactivity system?
Live queries too.


# Signoz:

http://localhost:3301/application