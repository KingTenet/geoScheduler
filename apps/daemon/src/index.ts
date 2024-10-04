import ApiClient from "./api/ApiClient";
import { OAuth } from "./auth/tokens";
import initEnv from "./initEnv";
import Scheduler from "./Scheduler";
import { ScheduleState } from "./ScheduleState";
import getPromiseUserStoppedProcess from "./signalHandler";
import { PrismaDaemonAction } from "./types/actions";


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

        const blah = new ScheduleHandler(apiClient);
        blah.start();


        promiseUserStopped
            .then(() => {
                console.log("Stopping services");
                scheduleState.stop();
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
