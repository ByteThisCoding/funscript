# Funscript - Functional Typescript

![Coverage lines](./coverage/badge-lines.svg)
![Coverage functions](./coverage/badge-functions.svg)
![Coverage branches](./coverage/badge-branches.svg)
![Coverage statements](./coverage/badge-statements.svg)

**For details + info on how to use:** https://bytethisstore.com/articles/pg/funscript

This library facilitates functional programming practices by offering:

-   recursive object cloning
-   recursive object locking
-   asynchronous versions of array functions
-   compose utility to pipe multiple functions into one
-   deep equality checking

These will aid in creating and working with immutable objects.

## Install

Library with typescript definitions available as npm package.

```
npm install @byte-this/funscript
```

## Clone

The `Clone` function is straightforward: it recursively clones an object and returns the new object:

```javascript
const newObj = Clone(oldObject);
console.log(oldObject === newObj); //false
```

If the object has its own `clone` method, this function will utilize it. Otherwise, it will do a default recursive clone.

## Lock

The `Lock` function clones an object and recursively freezes all properties on that clone, preventing any further mutation:

```javascript
const oldObj = {
    property: {
        a: true,
        b: false,
    },
};
const newObj = Lock(oldObject);
console.log(oldObject === newObj); //fales

try {
    newObj.property.a = false;
    //if 'strict mode' is not enabled, no error will be thrown
    //but the object field will not be updated
} catch (err) {
    //an error will be thrown if you have 'strict mode' enabled
    //which I recommend you should
}
```

## FunAr

FunAr: _functional asynchronous array_, provides asynchronous versions of the common functional array methods in _sequential_ and _parallel_ flavors:

-   Sequential
    -   map
    -   filter
    -   reduce
    -   find
    -   forEach (not technically functional but included for completeness)
-   Parallel
    -   map
    -   filter
    -   forEach (not technically functional but included for completeness)

The sequential methods invoke the callback for each item one after another. The parallel methods invoke the callback for each item simultaneously.

```javascript
//the methods have the same signature as the regular version, except the input array is added as the first argument
const reduced = await FunAr.async.seq.reduce(inputArray, reduceFunction, initialValue);

const mapped = await FunAr.async.parallel.map(inputArray, (item, index) => /*..async*/ return mapped);

```

## Compose

Compose multiple functions and assign it to a single variable or execute immediately:

```javascript
const compositeFunction = Compose(fOne, fTwo, fThree, fFour);
const result = compositeFunction(initialParam, otherParm); //first input function can accept more than one parameter

//async version
const compositeAsyncFunction = ComposeAsync(fOneAsync, fTwoAsync, fThreeAsync);
const result = await compositeAsyncFunction(input);

//dynamic composition
const dynamicComposition = Compose(...arrayOfFunctions);
const result = dynamicComposition();
```

## Equals

Check if two objects are equal. The following are considered to be equal:

-   Two primitives with the same value
-   Two objects with the same object reference
-   Two dates with the same datetime
-   Two arrays with the same contents in the same order and the contents are Equal
-   Two objects with the same keys and value pairs are Equal

```javascript
Equals(true, true); //true
```

## Memoization

Memoization is a technique where the response of a function is stored so that future calls with the same parameters receive the cached response instead of executing from scratch. Below is a basic example:

```javascript
const memoized = Memoize(exensiveFunc);
const resultOne = memoized(funcParamOne, funcParamTwo); //this first call runs the expensiveFunc
const resultTwo = memoized(funcParamOne, funcParamTwo); //this second call does not run expensiveFunc, it returns the result from the first execution
const resultThree = memoized(newFuncParamOne, newFuncParamTwo); //this runs expensiveFunc again because the arguments are different than the first call
```

With the default parameters, cached values are stored indefinitely. It is also possible to configure an expiration time:

```javascript
const memoized = Memoize(exensiveFunc, {
    cacheExpiration: {
        evaluate: () => numMs, //a function which returns a number in milliseconds
        type: "relative" | "absolute", //specificy if the timestamp is relative to now or absolute
    },
});
```

When the cache item expires, the memoized fnction will run the real function the next time it is invoked.

Async version:

```javascript
const memoized = MemoizeAsync(expensiveFunc);
```

Decorator version:

```javascript
class TestClass {
    @MemoizeMethod() //this can take the same options as the normal method call
    expensiveFuncOne() {
        /** some expensive operation */
    }

    @MemoizeAsyncMethod()
    async expensiveFuncTwo() {
        /** some async expensive operation */
    }
}
```

## Collect Pending Method Invocations

Wrap an async function so it collects multiple invocations and waits for the response of the first call instead of calling the function multiple times.

```javacript
const asyncFunc = async () => { /** some async function, such as network call */ return response; };

const wrappedFunc = CollectPendingInvocations(asyncFunc);

Promise.all([
    wrappedFunc(param),
    wrappedFunc(param),
    wrappedFunc(param)
]).then(data => console.log(data)); //logs array of three responses, but original method was only called once
```

There is also a decorator for class methods:

```javascript
class TestClass {
    @CollectPendingMethodInvocations
    asyncOperation() {
        /** some async operation */
        return response;
    }
}
```

## Other Array Functions

The following functions exist on FunAr and can have custom equality comparators passed in when applicable

-   **uniqueValues**: get the unique values of an array
-   **subset**: get a subset of an array from the start to end index
-   **isSubsetOf**: check if an array is a subset of another array
-   **isSupersetOf**: check if an array is a superset of another array
-   **intersection**: get the intersection (common values) of two arrays
-   **intersects**: check if two arrays have any intersection
