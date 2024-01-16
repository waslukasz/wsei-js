function asyncAdd(a, b) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(a+b)
        }, 100);
    });
}

async function asyncAddTest(a, b) {
    const sum = await asyncAdd(a, b);
    console.log(`asyncAdd: [${a} + ${b}] = ${sum}`);
    return sum;
}

async function asyncMeasureTime(func) {
    const start = performance.now();
    await func();
    const stop = performance.now();
    console.log(`Czas: ${stop - start}ms`);
}

let arr = Array.from({length: 100}, () => Math.floor(Math.random() * 40));

async function asyncAddArray(array) {
    let sum = 0;
    let asyncOperations = 0;

    for (let i = 0; i < array.length; i++) {
        const el = array[i];
        sum = await asyncAdd(sum, el);
        asyncOperations++;
    }
    console.log(`asyncAddArray: [sum = ${sum}], [asyncOps = ${asyncOperations}]`);
}
asyncMeasureTime(() => asyncAddTest(1, 2));
asyncMeasureTime(() => asyncAddArray(arr));