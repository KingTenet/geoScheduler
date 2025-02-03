export class SimpleTaskExecutor {
    async executeTask() {
        const abort = async () => {
            console.log("Aborting task");
        };
        return { abort };
    }
}
