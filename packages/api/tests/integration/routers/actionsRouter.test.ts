import { createCaller, createTRPCContext } from "../../../src/index";

const RESERVED_TEST_USER_NAME = "RESERVED_TEST_USER_NAME";

jest.mock("../../../src/auth", () => ({
    __esModule: true,
    ...jest.requireActual("../../../src/auth"),
    verify: () => ({
        sub: RESERVED_TEST_USER_NAME,
    }),
}));

describe("places router", () => {
    let caller: ReturnType<typeof createCaller>;
    beforeEach(async () => {
        const ctx = await createTRPCContext({
            auth: {
                accessToken: "nonsense_access_token",
            },
            headers: new Headers(),
        });
        caller = createCaller(ctx);
    });

    test("get all actions", async () => {
        await caller.actions.getAll();
    });

    test("get all actions again", async () => {
        await caller.actions.getAll();
    });
});
