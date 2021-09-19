import dotenv from "dotenv";

export default function loadDotenv(): void {
    if (process.env.NODE_ENV === "local") {
        console.log("Using .env.local file to supply config environment variables");
        dotenv.config({ path: ".env.local" });
    } else {
        console.log("Using .env file to supply config environment variables");
        dotenv.config({ path: ".env" });
    }
}