import { spawn } from "child_process";
import type { ChildProcess } from "child_process";

import type { ConfigurationManager } from "./ConfigurationManager";
import type { Action, ActionExecutionConfig } from "./interfaces";
import type { Logger } from "./Logger";
import type { PrismaDaemonAction } from "./types/actions";

export class TaskExecutor {
    constructor(
        private config: ConfigurationManager,
        private logger: Logger,
    ) {}

    // TODO - figure out if this should be returning a promise
    async executeTask(action: PrismaDaemonAction): Promise<ChildProcess> {
        const executionConfig = this.getExecutionConfig(action);

        return new Promise((resolve, reject) => {
            const process = spawn(executionConfig.script, executionConfig.args);

            process.stdout.on("data", (data) => {
                this.logger.info(`Task ${action.id} output: ${data}`);
            });

            process.stderr.on("data", (data) => {
                this.logger.error(`Task ${action.id} error: ${data}`);
            });

            process.on("error", (error) => {
                this.logger.error(`Failed to start task ${action.id}`, error);
                reject(error);
            });

            process.on("exit", (code) => {
                if (code !== 0) {
                    this.logger.error(
                        `Task ${action.id} exited with code ${code}`,
                    );
                } else {
                    this.logger.info(
                        `Task ${action.id} completed successfully`,
                    );
                }
            });

            resolve(process);
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
                // ...this.buildActionArgs(action),
            ],
        };
    }

    // private buildActionArgs(action: PrismaDaemonAction): string[] {
    //     return Object.entries(action.config).map(
    //         ([key, value]) => `--${key}=${value}`,
    //     );
    // }
}
