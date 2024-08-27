// src/index.ts
import ApiClient from "./api/ApiClient";
import { OAuth } from "./auth/tokens";
import initEnv from "./initEnv";

async function main() {
    console.log("Started");
    const env = initEnv();
    const auth = await OAuth.create(
        env.AUTH0_DOMAIN,
        env.AUTH0_AUDIENCE,
        env.AUTH0_CLIENT_ID,
        env.TOKENS_FILE_PATH,
    );

    try {
        const apiClient = new ApiClient(env.API_BASE_URL, auth);
        const geoScheduleById = await apiClient.getGeoScheduleById("abc");
        console.log(geoScheduleById);
    } catch (error) {
        console.error("Error:", error);
    }
}

main().catch(console.error);
