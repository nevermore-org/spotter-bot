export type Achievement = {
    id: number;
    level: {min: number, max: number},
    required_access?: {product: string, condition: string}
}
