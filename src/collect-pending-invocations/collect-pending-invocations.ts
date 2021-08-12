//import EventEmitter from "eventemitter3";
import EventEmitter from "events";
import { Clone } from "../clone/clone";
import { Equals } from "../equals/equals";
import { iCollectPendingInvocations } from "../models/collect-pending-invocations";

interface iPending {
    func: Function;
    args: Array<any>;
    promise: Promise<any>;
}

const eventEmitter = new EventEmitter();

const findPendingIndex = (func: Function, ...params: any): number => {
    return pending.findIndex(
        (item) => item.func === func && Equals(params, [item.args])
    );
};

const findPendingItem = (
    func: Function,
    ...params: any
): iPending | undefined => {
    return pending.find(
        (item) => item.func === func && Equals(params, [item.args])
    );
};

const addPendingItem = (
    func: Function,
    args: any[],
    promise: Promise<any>
): void => {
    pending.push({
        func,
        args: args,
        promise,
    });
    eventEmitter.emit("update", pending.length);
};

const removePendingItem = (func: Function, args: any[]): void => {
    const finishedInd = findPendingIndex(func, args);
    if (finishedInd > -1) {
        pending.splice(finishedInd, 1);
        eventEmitter.emit("update", pending.length);
    }
};

const pending: Array<iPending> = [];

export const CollectPendingInvocations: iCollectPendingInvocations = <
    ParamsType extends any[],
    ReturnType
>(
    func: (...params: ParamsType) => Promise<ReturnType>
): ((...params: ParamsType) => Promise<ReturnType>) => {
    const decorated = function (...params: any): Promise<ReturnType> {
        try {
            //@ts-ignore
            const me = this;
            const clonedParams = Clone(params);
            const pendingItem = findPendingItem(func, params);
            if (pendingItem) {
                return pendingItem.promise as Promise<ReturnType>;
            } else {
                const promise = func.apply(me, clonedParams);
                addPendingItem(func, clonedParams, promise);
                promise
                    .catch(() => {})
                    .finally(() => {
                        removePendingItem(func, clonedParams);
                    });
                return promise;
            }
        } catch (err) {
            console.error(`Error caught at CollectPendingInvocations`, err);
            return Promise.reject(err);
        }
    };

    return decorated;
};

//useful for unit test purposes
export const AwaitAllCollections = () => {
    if (pending.length === 0) {
        return Promise.resolve(void 0);
    }
    return new Promise((resolve) => {
        eventEmitter.on("update", (len) => {
            if (len === 0) {
                resolve(void 0);
            }
        });
    });
};
