import BaseFractal from "./BaseFractal";

export default interface Fractal extends BaseFractal {
    id: number | null;
    icon: string | null;
    description: string | null;
    requirement: string | null;
    locked_text: string | null;
    type: string | null;
    flags: string[] | null;
    recommended: boolean | null;
}
