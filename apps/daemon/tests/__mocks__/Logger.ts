import { Logger } from "../../src/Logger";

jest.mock("./Logger", () => {
    return jest.fn().mockImplementation(() => {
        return {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        };
    });
});
