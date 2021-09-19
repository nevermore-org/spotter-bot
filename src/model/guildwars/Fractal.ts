export default interface Fractal {
    id: number;
    icon: string;
    name: string;
    description: string;
    requirement: string;
    locked_text: string;
    type: string;
    flags: string[];
    recommended: boolean;
}