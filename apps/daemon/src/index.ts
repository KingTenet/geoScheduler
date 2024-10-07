// index.ts
import { ActionSynchronizer } from "./ActionSynchronizer";
import { ApiClient } from "./ApiClient";
import { OAuth } from "./auth/tokens";
import { ConfigurationManager } from "./ConfigurationManager";
import { DatabaseService } from "./DatabaseService";
import { Logger } from "./Logger";
import { SchedulerCore } from "./SchedulerCore";
import { TaskExecutor } from "./TaskExecutor";
import { TaskScheduler } from "./TaskScheduler";

async function main() {
    const config = new ConfigurationManager();
    const logger = new Logger(config);
    const db = new DatabaseService(logger);

    const auth = await OAuth.create(
        config.getAuthDomain(),
        config.getAuthAudience(),
        config.getAuthClientId(),
        config.getTokensFilePath(),
    );

    const apiClient = new ApiClient(config, auth, logger);

    const actionSynchronizer = new ActionSynchronizer(db, apiClient, logger);
    const taskExecutor = new TaskExecutor(config, logger);
    const taskScheduler = new TaskScheduler(config, taskExecutor, db, logger);

    const schedulerCore = new SchedulerCore(
        actionSynchronizer,
        taskScheduler,
        config,
        logger,
    );

    await schedulerCore.start();
}

main().catch(console.error);
