# Funscript - Functional Typescript

![Coverage lines](./coverage/badge-lines.svg)
![Coverage functions](./coverage/badge-functions.svg)
![Coverage branches](./coverage/badge-branches.svg)
![Coverage statements](./coverage/badge-statements.svg)

This library facilitates functional programming practices by offering:
* recursive object cloning
* recursive object locking
* asynchronous versions of array functions
* compose utility to pipe multiple functions into one

These will aid in creating and working with immutable objects.

## Clone
The ```Clone``` function is straightforward: it recursively clones an object and returns the new object:
```javascript
const newObj = Clone(oldObject);
console.log(oldObject === newObj); //false
```

If the object has its own ```clone``` method, this function will utilize it. Otherwise, it will do a default recursive clone.

## Lock
The ```Lock``` function clones an object and freezes all properties on that clone, preventing any further mutation:
```javascript
const newObj = Lock(oldObject);
console.log(oldObject === newObj); //fales

try {
    newObj.property = false;
    //if 'strict mode' is not enabled, no error will be thrown
    //but the object field will not be updated
} catch (err) {
    //an error will be thrown if you have 'strict mode' enabled
    //which I recommend you should
}

```

## FunAr
FunAr: *functional asynchronous array*, provides asynchronous versions of the common functional array methods in *sequential* and *parallel* flavors:
* Sequential
    * map
    * filter
    * reduce
    * find
    * forEach (not technically functional but included for completeness)
* Parallel
    * map
    * filter
    * forEach (not technically functional but included for completeness)
    
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