import { execFileSync } from "child_process";
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

async function main() {
    while (running) {
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
            await new Promise((resolve) => setTimeout(resolve, 5000));

            // try {
            //     const stdout = execFileSync("/usr/local/bin/node", ["index.js"], {env: PATH: ""});
            //       console.log(stdout);
            //     } catch (err) {
            //       if (err.code) {
            //         console.log(err.code);
            //       } else {
            //         const { stdout, stderr } = err;
            //         console.log({ stdout, stderr });
            //       }
            //     }

            // }
            // catch (err) {
            //     console.log(err);
            // }
        } catch (err) {
            console.log(err);
        }
    }
}

main().then(
    () => console.log("Shutdown gracefully"),
    (err) => console.log("Shutdown with error: " + err),
);
