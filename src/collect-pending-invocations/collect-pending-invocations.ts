
import { Clone } from "../clone/clone";
import { Equals } from "../equals/equals";
import { iCollectPendingInvocations } from "../models/collect-pending-invocations";

interface iPendingArgs {
    args: any[];
    promise: Promise<any>;
}

interface iPending extends iPendingArgs {
    func: Function;
}

// map pending function calls, function => params[]
class ListNode {
    public next: ListNode | null = null;
    constructor(
        public readonly value: iPendingArgs
    ) {}
}

interface iArgsList {
    findInList(args: any[]): iPendingArgs | null;

    addToList(pending: iPendingArgs): void;

    deleteFromList(args: any[]): { itemRemoved: boolean; listIsEmpty: boolean; }
}

class ArgsLinkedList implements iArgsList {
    head: ListNode | null = null;

    constructor(
        pending: iPendingArgs
    ) {
        this.head = new ListNode(pending);
    }

    findInList(args: any[]): iPendingArgs | null {
        let node = this.head;

        while (node) {
            if (Equals(node.value.args, args)) {
                return node.value;
            }
            node = node.next;
        }

        return null;
    }

    addToList(pending: iPendingArgs): void {
        const newNode = new ListNode(pending);
        newNode.next = this.head;
        this.head = newNode;
    }

    deleteFromList(args: any[]): { itemRemoved: boolean; listIsEmpty: boolean; } {
        let prevNode: ListNode | null = null;
        let node = this.head;

        while (node) {
            if (Equals(node.value.args, args)) {
                if (prevNode) {
                    prevNode.next = node.next;
                    return {
                        itemRemoved: true,
                        listIsEmpty: false
                    };
                } else if (!node.next) {
                    this.head = null;
                    return {
                        itemRemoved: true,
                        listIsEmpty: true
                    };
                } else {
                    this.head = node.next;
                    return {
                        itemRemoved: true,
                        listIsEmpty: false
                    };
                }
            }
            prevNode = node;
            node = node.next;
        }

        return {
            itemRemoved: false,
            listIsEmpty: false
        };
    }
}


class PendingCallsContainer {

    private funcMap = new Map<Function, iArgsList>();
    private size = 0;

    constructor() { }

    findPendingItem(func: Function, params: any[]): iPending | void {
        const argList = this.funcMap.get(func);
        if (!argList) {
            return void 0;
        }

        const pendingArgs = argList.findInList(params);
        if (!pendingArgs) {
            return void 0;
        }

        return {
            func,
            ...pendingArgs
        }
    }

    addPendingItem(
        func: Function,
        args: any[],
        promise: Promise<any>
    ): void {
        if (!this.funcMap.has(func)) {
            this.funcMap.set(func, new ArgsLinkedList({ args, promise }));
        } else {
            this.funcMap.get(func)!.addToList({ args, promise });
        }
        this.size++;
        if (this.size > 1_000) {
            console.log("DEBUG issue");
        }
    }

    removePendingItem(func: Function, args: any[]): void {
        const funcPending = this.funcMap.get(func);
        if (!funcPending) {
            return;
        }

        const { itemRemoved, listIsEmpty } = funcPending.deleteFromList(args);
        if (itemRemoved) {
            this.size --;
        }

        if (listIsEmpty) {
            this.funcMap.delete(func);
        }
    }

}

const pendingCollection = new PendingCallsContainer();

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
            const pendingItem = pendingCollection.findPendingItem(func, params);
            if (pendingItem) {
                return pendingItem.promise as Promise<ReturnType>;
            } else {
                const promise = func.apply(me, clonedParams);
                pendingCollection.addPendingItem(func, clonedParams, promise);
                promise
                    .catch(() => { })
                    .finally(() => {
                        pendingCollection.removePendingItem(func, clonedParams);
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