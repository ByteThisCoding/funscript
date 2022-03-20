import { IterableList } from "../models/iterable-list";

/**
 * Util which will standardize interface for performing operations over arrays and sets
 */
export class IterableListUtil {

    /**
     * Check if the input is an iterable type
     */
    static isIterableList(item: any): boolean {
        return item instanceof Set || Array.isArray(item);
    }

    /**
     * Check if the list includes an item
     */
    static includes<T>(list: IterableList<T>, item: T): boolean {
        if (list instanceof Set) {
            return list.has(item);
        }
        return list.includes(item);
    }

    /**
     * Given two iterables, return their intersection
     */
    static intersectionOf<T>(a: IterableList<T>, b: IterableList<T>): Set<T> {
        // if only one is a set, we want to make that the lookup item
        let lookupIt = a instanceof Set ? a : b;
        let loopIt = a === lookupIt ? b : a;

        // if both are sets, make smaller size the loop,
        if (lookupIt instanceof Set && loopIt instanceof Set && this.size(lookupIt) < this.size(loopIt)) {
            const tmp = loopIt;
            loopIt = lookupIt;
            lookupIt = tmp;
        } else if (Array.isArray(lookupIt) && Array.isArray(loopIt) && this.size(loopIt) < this.size(lookupIt)) {
            // if both are arrays, make lareger size the loop
            const tmp = loopIt;
            loopIt = lookupIt;
            lookupIt = tmp;
        }

        const intersection = new Set<T>();
        for (const item of loopIt) {
            if (this.includes(lookupIt, item)) {
                intersection.add(item);
            }
        }
        return intersection;
    }

    /**
     * Get the size of the collection
     */
    static size<T>(list: IterableList<T>): number {
        if (list instanceof Set) {
            return list.size;
        }
        return list.length;
    }

}