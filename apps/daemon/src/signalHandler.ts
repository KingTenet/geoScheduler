export default function (): Promise<void> {
    return new Promise<void>((resolve) => {
        process.on("SIGTERM", function onSigterm() {
            console.info(
                "Got SIGTERM. Graceful shutdown start",
                new Date().toISOString(),
            );
            resolve();
        });
    });
}
