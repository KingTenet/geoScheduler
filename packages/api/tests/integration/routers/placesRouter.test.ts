import { createCaller, createTRPCContext } from "../../../src/index";

const RESERVED_TEST_USER_NAME = "RESERVED_TEST_USER_NAME";

// throw new Error(process.env.DATABASE_URL);

jest.mock("../../../src/auth", () => ({
    __esModule: true,
    ...jest.requireActual("../../../src/auth"),
    verify: () => ({
        sub: RESERVED_TEST_USER_NAME,
    }),
}));

test("get all actions", async () => {
    const ctx = await createTRPCContext({
        auth: {
            accessToken: "nonsense_access_token",
        },
        headers: new Headers(),
    });
    const caller = createCaller(ctx);
    await caller.actions.getAll();
});
