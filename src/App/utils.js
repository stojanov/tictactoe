
export const idFn = x => x;

export const clone = o => JSON.parse(JSON.stringify(o));

export const createArray = (n, fn = idFn) => {
    const res = fn(--n);
    return n == 0 ? [ res ] : createArray(n, fn).concat(res);
}