import initEnv from "./initEnv";
import startServices from "./Services";
import signalHandler from "./signalHandler";

async function main() {
    const env = initEnv();
    const promiseShutdown = signalHandler();
    startServices(env, promiseShutdown);
}

main().then(
    () => console.log("Shutdown gracefully"),
    (err) => console.log("Shutdown with error: " + err),
);
