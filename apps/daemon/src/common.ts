function getUniqueSet<T, X extends string>(
    things: T[],
    getUniqueKey: (thing: T) => X,
): [[X, T][], Set<X>] {
    const mappedKeys: [X, T][] = things.map((thing) => [
        getUniqueKey(thing),
        thing,
    ]);

    const setOfUniqueKeys = new Set<X>(mappedKeys.map(([key]) => key));
    if (setOfUniqueKeys.size !== mappedKeys.length) {
        throw new Error("Data had duplicate keys which should be unique");
    }
    return [mappedKeys, setOfUniqueKeys];
}

function set1NotInSet2<T>(set1: Set<T>, set2: Set<T>) {
    return new Set([...set1].filter((key) => !set2.has(key)));
}

export function getNewThings<T, X extends string>(
    existingThings: T[],
    maybeNewThings: T[],
    getUniqueKey: (thing: T) => X,
): T[] {
    const [_existingKeys, existingKeysSet] = getUniqueSet(
        existingThings,
        getUniqueKey,
    );

    const [maybeNewKeys, maybeNewKeysSet] = getUniqueSet(
        maybeNewThings,
        getUniqueKey,
    );

    const newKeys = set1NotInSet2(maybeNewKeysSet, existingKeysSet);

    return maybeNewKeys
        .filter(([key]) => newKeys.has(key))
        .map(([_key, thing]) => thing);
}

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function execWithTimeout<Thing>(
    promiseThing: Promise<Thing>,
    maxWaitTime: number,
): Promise<
    | {
          data: Thing;
          timedOut: false;
      }
    | {
          timedOut: true;
          data: undefined;
      }
> {
    const timedOutSymbol = Symbol();
    const thingOrTimedOut = await Promise.any([
        sleep(maxWaitTime).then(() => timedOutSymbol),
        promiseThing,
    ]);

    if (timedOutSymbol === thingOrTimedOut) {
        return {
            timedOut: true,
            data: undefined,
        };
    }

    return {
        data: thingOrTimedOut as Thing,
        timedOut: false,
    };
}

export async function execOrThrowOnTimeout<X>(
    promiseThing: Promise<X>,
    maxWaitTime: number,
): Promise<X> {
    const { timedOut, data } = await execWithTimeout<X>(
        promiseThing,
        maxWaitTime,
    );
    if (timedOut) {
        throw new Error("Timed out waiting for promise");
    }
    return data;
}

export function promiseOnce(fn: () => Promise<void>) {
    let promiseResult: undefined | Promise<void>;
    return (): Promise<void> => {
        if (!promiseResult) {
            promiseResult = fn();
        }
        return promiseResult;
    };
}
