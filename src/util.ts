// Function to limit decimal places to four
export const limitDecimalPlaces = (coordinates: number[]): number[] => {
    return [Number(coordinates[0].toFixed(3)), Number(coordinates[1].toFixed(3))];
};

// Function to compare arrays by values
export const arraysMatch = (arr1: number[], arr2: number[]): boolean => {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
};

// Add a function to get unique values from array
declare global {
    interface Array<T> {
        unique(): T[];
        sortAndUnique(): T[];
    }
}
Array.prototype.unique = function <T>(): T[] {
    return this.filter((v, i, a) => a.indexOf(v) == i);
};
Array.prototype.sortAndUnique = function <T>(): T[] {
    return this.sort().unique();
};
