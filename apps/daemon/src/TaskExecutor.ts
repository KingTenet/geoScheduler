import { execFile } from "node:child_process";
import type { ChildProcess } from "child_process";

import type { ConfigurationManager } from "./ConfigurationManager";
import type { ActionExecutionConfig } from "./interfaces";
import type { Logger } from "./Logger";
import type { PrismaDaemonAction } from "./types/actions";

function promiseOnce(fn: () => Promise<void>) {
    let promiseResult: undefined | Promise<void>;
    return (): Promise<void> => {
        if (!promiseResult) {
            promiseResult = fn();
        }
        return promiseResult;
    };
}
export class TaskExecutor {
    constructor(
        private config: ConfigurationManager,
        private logger: Logger,
    ) {}

    async executeTask(action: PrismaDaemonAction): Promise<{
        process: ChildProcess;
        abort: () => Promise<void>;
        exit: Promise<void>;
    }> {
        const executionConfig = this.getExecutionConfig(action);
        const abortController = new AbortController();

        return new Promise((resolve, reject) => {
            const process = execFile(
                executionConfig.script,
                executionConfig.args,
                {
                    signal: abortController.signal,
                },
                (error, stdout, stderr) => {
                    if (stdout) {
                        this.logger.info(`Task ${action.id} output: ${stdout}`);
                    }
                    if (stderr) {
                        this.logger.error(`Task ${action.id} error: ${stderr}`);
                    }
                    if (error && error.name !== "AbortError") {
                        this.logger.error(
                            `Task ${action.id} failed: ${error.message}`,
                        );
                        reject(new Error(`Task ${action.id} failed`));
                    }
                },
            );

            const promiseExit = new Promise<void>((resolveExit, rejectExit) => {
                process.on("exit", (code) => {
                    if (code === 0) {
                        this.logger.info(
                            `Task ${action.id} completed successfully`,
                        );
                        resolveExit();
                    } else {
                        this.logger.error(
                            `Task ${action.id} exited with code ${code}`,
                        );
                        rejectExit(
                            new Error(
                                `Task ${action.id} exited with code ${code}`,
                            ),
                        );
                    }
                });
            });

            const promiseAbort = async () => {
                return new Promise<void>((resolveAbort) => {
                    abortController.abort();
                    process.on("error", (error) => {
                        if (error.name === "AbortError") {
                            this.logger.info(`Task ${action.id} aborted`);
                            resolveAbort();
                        }
                    });
                });
            };

            resolve({
                process,
                abort: promiseOnce(promiseAbort),
                exit: promiseExit,
            });
        });
    }

    private getExecutionConfig(
        action: PrismaDaemonAction,
    ): ActionExecutionConfig {
        const defaultConfig = this.config.getDefaultExecutionConfig();
        const actionTypeConfig =
            this.config.getActionTypeConfig("BLOCK_WEBSITE");

        return {
            script: actionTypeConfig.script ?? defaultConfig.script,
            args: [
                ...(actionTypeConfig.args ?? []),
                ...this.buildActionArgs(action),
            ],
        };
    }

    private buildActionArgs(action: PrismaDaemonAction): string[] {
        return [
            `--id=${action.id}`,
            `--apps=${action.appNames.join(",")}`,
            `--from=${action.fromDate.toISOString()}`,
            `--to=${action.toDate.toISOString()}`,
        ];
    }
}
