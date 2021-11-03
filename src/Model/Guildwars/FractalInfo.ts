export type FractalInfo = {
    type: string;
    name: string;
    levels: number[];
}

export interface InstabFractalInfo extends FractalInfo {
    instabilities: string[][];
};
