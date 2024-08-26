import type initEnv from "./initEnv";
import ApiClient from "./api/ApiClient";
import { OAuth } from "./auth/tokens";

export async function startServices(
    env: ReturnType<typeof initEnv>,
    promiseShutdown,
) {
    const apiClient = new ApiClient(
        env.API_BASE_URL,
        await OAuth.create(
            env.AUTH0_DOMAIN,
            env.AUTH0_AUDIENCE,
            env.AUTH0_CLIENT_ID,
        ),
    );
    await apiClient.getPath();
}
