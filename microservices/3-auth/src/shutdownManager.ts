type ShutdownCallback = () => Promise<void> | void;

export class ShutdownManager {
    
  private callbacks: ShutdownCallback[] = [];

  constructor() {
    process.on('SIGINT', () => this.shutdown('SIGINT'));
    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
  }

  register(callback: ShutdownCallback) {
    this.callbacks.push(callback);
  }

  private async shutdown(signal: string) {
    console.log(`\n[Shutdown] Received ${signal}. Cleaning up...`);
    
    for (const cb of this.callbacks) {
      
      try {
        await cb();
      } catch (err) {
        console.error('[Shutdown] Error during shutdown:', err);
      }
    }

    console.log('[Shutdown] Done. Exiting.');
    process.exit(0);
  }
}


export const shutdown = new ShutdownManager();
