export interface iFunObj {
    kvForEach: <ValueType>(
        input: { [key: string]: ValueType },
        callback: (
            key: string,
            value: ValueType,
            iteratorIndex: number,
            obj: { [key: string]: ValueType }
        ) => void,
        thisArg?: any
    ) => void;
    kvFilter: <ValueType>(
        input: { [key: string]: ValueType },
        callback: (
            key: string,
            value: ValueType,
            iteratorIndex: number,
            obj: { [key: string]: ValueType }
        ) => boolean,
        thisArg?: any
    ) => { [key: string]: ValueType };
    kvMap: <ValueType, MappedValueType>(
        input: { [key: string]: ValueType },
        callback: (
            key: string,
            value: ValueType,
            iteratorIndex: number,
            obj: { [key: string]: ValueType }
        ) => MappedValueType,
        thisArg?: any
    ) => { [key: string]: MappedValueType };
    kvReduce: <ValueType, OutputType>(
        input: { [key: string]: ValueType },
        callback: (
            acc: OutputType,
            key: string,
            value: ValueType,
            iteratorIndex: number,
            obj: { [key: string]: ValueType }
        ) => OutputType,
        initialValue?: OutputType
    ) => OutputType;
    keysIntersection: (a: {[key: string]: any}, b: {[key:string]: any}) => string[];
    keysIntersect: (a: {[key: string]: any}, b: {[key:string]: any}) => boolean;
}
