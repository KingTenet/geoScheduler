import axios from "axios";

import type { OAuth } from "../auth/tokens";

export default class ApiClient {
    apiBaseUrl: string;
    auth: OAuth;

    constructor(apiBaseUrl: string, auth: OAuth) {
        this.apiBaseUrl = apiBaseUrl;
        this.auth = auth;
    }

    async getPath() {
        try {
            const response = await axios({
                method: "GET",
                url: `${this.apiBaseUrl}/api/protected`,
                headers: {
                    authorization: "Bearer " + this.auth.getAccessToken(),
                },
            });
            return response.data;
        } catch (err) {
            if (err) console.log(err);
            if (err && typeof err === "object" && "message" in err) {
                console.log(err.message);
            }
        }
    }
}
