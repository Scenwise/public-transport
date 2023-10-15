/* eslint-disable @typescript-eslint/no-explicit-any */

export type Filter = {
    optionTitle: string;
    optionKey: string;
    type: string;
    options?: any[]; //number[] | string[];
    variants?: any[]; //number[] | string[];
    variant?: any; //number | string;
    setting?: { [key: string]: any };
};
