import { dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { PATH, API_BASE_URL, AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_AUDIENCE } =
    process.env;

let running = true;

process.on("SIGTERM", function onSigterm() {
    console.info(
        "Got SIGTERM. Graceful shutdown start",
        new Date().toISOString(),
    );
    // start graceul shutdown here
    running = false;
});

console.log("Was able to run index.js with PATH:" + PATH);
console.log(process.cwd());
console.log(__dirname);

async function main() {
    let remainingRuns = 2;
    while (remainingRuns) {
        try {
            console.log(PATH);
            console.log(
                AUTH0_DOMAIN,
                AUTH0_AUDIENCE,
                AUTH0_CLIENT_ID,
                API_BASE_URL,
            );
            console.log("Got here1");
            console.log("Got here2");
            console.log("Got here3");

            console.log(API_BASE_URL);
            console.log(process.cwd());
            console.log(__dirname);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            remainingRuns = remainingRuns - 1;
        } catch (err) {
            console.log(err);
        }
    }
}

main().then(
    () => console.log("Shutdown gracefully"),
    (err) => console.log("Shutdown with error: " + err),
);
