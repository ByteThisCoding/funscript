import { ArFilterAsyncCallback, ArFindAsyncCallback, ArForEachAsyncCallback, ArMapAsyncCallback, ArReduceAsyncCallback, iFunAr } from "../models/fun-ar";

/**
 * Object which will hold async versions of array methods
 * (Yes, I do see the irony in using some imperative programming to implement this)
 */
export const FunAr: iFunAr = {
    async: {
        seq: {
            /**
             * Run a forEach asynchronously where each callback is not invoked until the previous one finished
             * @param input 
             * @param callback 
             * @param thisArg 
             * @returns Promise<void>
             */
            forEach: async <T>(input: T[], callback: ArForEachAsyncCallback<T>, thisArg?: any): Promise<void> => {
                const promise = Promise.resolve();
                input.forEach((item, index) => {
                    if (typeof thisArg !== 'undefined') {
                        promise.then(callback.bind(thisArg, item, index, input));
                    } else {
                        promise.then(() => callback(item, index, input))
                    }
                });
                return promise.then(() => void 0);
            },
            /**
             * Find an item using an asynchronous callback, returns a promise of the first found item or undefined
             * @param input 
             * @param callback 
             * @param thisArg 
             * @returns Promise<T | undefined>
             */
            find: async <T>(input: T[], callback: ArFindAsyncCallback<T>, thisArg?: any): Promise<T | undefined> => {
                let element: T | undefined = void 0;
                let found = false;
                for (let i = 0; !found && i < input.length; i++) {
                    if (typeof thisArg !== 'undefined') {
                        found = await callback.bind(thisArg, input[i], i, input)();
                    } else {
                        found = await callback(input[i], i, input);
                    }
                    if (found) {
                        element = input[i];
                    }
                }
                return element;
            },
            /**
             * Asynchronously map the input of an array to a new array, running each callback one after another
             * @param input 
             * @param callback 
             * @param thisArg 
             * @returns Promise<T[]>
             */
            map: async <T>(input: T[], callback: ArMapAsyncCallback<T>, thisArg?: any): Promise<T[]> => {
                const newAr: T[] = [];
                for (let i = 0; i < input.length; i++) {
                    const item = input[i];
                    let mappedItem: T;
                    if (typeof thisArg !== 'undefined') {
                        mappedItem = await callback.bind(thisArg, item, i, input)();
                    } else {
                        mappedItem = await callback(item, i, input);
                    }
                    newAr.push(mappedItem);
                }
                return newAr;
            },
            /**
             * Asynchronously filter the input of an array to a new array, running each callback one after another
             * @param input 
             * @param callback 
             * @param thisArg 
             * @returns Promise<T[]>
             */
            filter: async <T>(input: T[], callback: ArFilterAsyncCallback<T>, thisArg?: any): Promise<T[]> => {
                const newAr: T[] = [];
                for (let i = 0; i < input.length; i++) {
                    const item = input[i];
                    let doInclude;
                    if (thisArg) {
                        doInclude = await callback.bind(thisArg, item, i, input)();
                    } else {
                        doInclude = await callback(item, i, input);
                    }
                    if (doInclude) {
                        newAr.push(item);
                    }
                }
                return newAr;
            },
            /**
             * Reduce an array asynchronously, invoking each callback sequentially
             * @param input 
             * @param callback 
             * @param initialValue 
             * @returns Promise<A>
             */
            reduce: async <T, A>(input: T[], callback: ArReduceAsyncCallback<T, A>, initialValue?: A): Promise<A> => {
                let value: T | A = input[0];
                let startIndex = 1;
                if (typeof initialValue !== 'undefined') {
                    value = initialValue;
                    startIndex = 0;
                }
                
                for (let i=startIndex; i<input.length; i++) {
                    const item = input[i];
                    value = await callback(value as A, item, i, input);
                }

                return value as A;
            }
        },
        parallel: {
            /**
             * Run a forEach asynchronously where each callback is invoked immediately
             * @param input 
             * @param callback 
             * @param thisArg 
             * @returns Promise<void>
             */
            forEach: async <T>(input: T[], callback: ArForEachAsyncCallback<T>, thisArg?: any): Promise<void> => {
                const promises: Promise<any>[] = [];

                input.forEach((item, index) => {
                    if (typeof thisArg !== 'undefined') {
                        promises.push((async () => {
                            return callback.bind(thisArg, item, index, input)()
                        })());
                    } else {
                        promises.push((async () => {
                            return callback(item, index, input);
                        })());
                    }
                });

                return Promise.all(promises).then(() => void 0);
            },
            /**
             * Asynchronously map the input of an array to a new array, running each callback in parallel
             * @param input 
             * @param callback 
             * @param thisArg 
             * @returns Promise<T[]>
             */
            map: async <T>(input: T[], callback: ArMapAsyncCallback<T>, thisArg?: any): Promise<T[]> => {
                const newAr: T[] = new Array<T>(input.length);
                const promises: Promise<any>[] = [];

                input.forEach((item, index) => {
                    if (typeof thisArg !== 'undefined') {
                        promises.push((async () => {
                            const response = await callback.bind(thisArg, item, index, input)();
                            newAr[index] = response;
                        })());
                    } else {
                        promises.push((async () => {
                            const response = await callback(item, index, input);
                            newAr[index] = response;
                        })());
                    }
                });

                return Promise.all(promises).then(() => newAr);
            },
            /**
             * Asynchronously filter the input of an array to a new array, running each callback in parallel
             * @param input 
             * @param callback 
             * @param thisArg 
             * @returns Promise<T[]>
             */
            filter: async <T>(input: T[], callback: ArFilterAsyncCallback<T>, thisArg?: any): Promise<T[]> => {
                const filterResults: number[] = [];
                const promises: Promise<any>[] = [];

                input.forEach((item, index) => {
                    if (typeof thisArg !== 'undefined') {
                        promises.push((async () => {
                            const response = await callback.bind(thisArg, item, index, input)();
                            if (response) {
                                filterResults.push(index);
                            }
                        })());
                    } else {
                        promises.push((async () => {
                            const response = await callback(item, index, input);
                            if (response) {
                                filterResults.push(index);
                            }
                        })());
                    }
                });

                await Promise.all(promises);
                return filterResults.sort().map(inputIndex => input[inputIndex]);
            }
        }
    }
}