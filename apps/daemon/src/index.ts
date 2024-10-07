import ApiClient from "./api/ApiClient";
import { OAuth } from "./auth/tokens";
import initEnv from "./initEnv";
import { ScheduleHandler } from "./ScheduleState";
import getPromiseUserStoppedProcess from "./signalHandler";

async function main() {
    console.log("Starting...");
    const promiseUserStopped = getPromiseUserStoppedProcess();
    const env = initEnv();
    const auth = await OAuth.create(
        env.AUTH0_DOMAIN,
        env.AUTH0_AUDIENCE,
        env.AUTH0_CLIENT_ID,
        env.TOKENS_FILE_PATH,
    );

    try {
        const apiClient = new ApiClient(env.API_BASE_URL, auth);

        const scheduler = new ScheduleHandler(apiClient);
        scheduler
            .start()
            .then(() => console.log("Scheduler started"))
            .catch((err) => console.error(err));

        promiseUserStopped
            .then(() => {
                console.log("Stopping services");
                scheduler.stop();
                console.log("Stopped all services");
            })
            .catch(() => {
                console.error("Failed to stop services");
            });
    } catch (error) {
        console.error("Error:", error);
    }
}

main().catch(console.error);
