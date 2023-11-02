# Atom values and url

Jotai and its atoms are used to store the state for the exploration page.  
Since this page's state needs to be shareable between users, some of the state needs to end up in the url, which is achieved using jotai-location.

Its usage is, in principle, simple: We create an atom that communicates with the url, so every time a value is set, the url is updated and vice versa.

### Problem 1 - URL update limits
The browser has a limit to how many updates can be made to the url in a given amount of time. When this limit is reached an error is thrown that crashes the app.

This was resolved by creating an atom that holds the same value as the url but without updating it. In this way we can make all the updates we want. We then debounce the url update so it is not frequent enough to reach the limit.

See the code in [./url.ts](./url.ts).

### Problem 2 - URL as source of truth
Using the url as a source of truth means that all data that goes to the url is converted to and from string. I.e. every time we want to read a value we parse the url string value.

Example for a simple value
```ts
const valueAtom = atom(
  (get) => {
    const value = get(urlAtom).searchParams?.get('value');
    return value;
  },
  (get, set, updates) => {
    set(urlAtom, updates);
  }
);
```

This is not a problem for most values, but it is for objects because the resulting value will always be a new object, even if the source string is the same.

Example for an object
```ts
const valueAtom = atom(
  (get) => {
    const value = get(urlAtom).searchParams?.get('value');
    return value ? JSON.parse(value) : null;
  },
  (get, set, updates) => {
    set(urlAtom, JSON.stringify(updates));
  }
);
```

The result is that these values cannot be used dependencies for hooks because they will always change.
For example, the selectedDate is converted to a ISO string when it goes to the url, and when we create a Date from the string it will be different.

The solution used here was to create an external cache that is checked before returning the value from the atom. This way we can return the same object if it is already in the cache.

The previous example would become
```ts
const valueAtom = atom(
  (get) => {
    const value = get(urlAtom).searchParams?.get('value');
    const parsedValue = value ? JSON.parse(value) : null;
    return getStableValue('value-key', parsedValue);
  },
  (get, set, updates) => {
    set(urlAtom, JSON.stringify(updates));
  }
);
```

The cache is pretty simple and it is in [./cache.ts](./cache.ts).