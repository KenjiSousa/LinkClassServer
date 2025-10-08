import { HashEntry } from "#interfaces/hashStoreInterfaces.js";

export class HashStore {
  private static instance: HashStore;
  private hashes: Map<string, HashEntry> = new Map();

  private constructor() {}

  public static getInstance(): HashStore {
    if (!HashStore.instance) {
      HashStore.instance = new HashStore();
    }

    return HashStore.instance;
  }

  public add(hash: string, eventoId: number, ttlSeconds: number): void {
    this.hashes.set(hash, { eventoId });

    setTimeout(() => {
      this.hashes.delete(hash);
    }, ttlSeconds * 1000);
  }

  public has(hash: string): boolean {
    return this.hashes.has(hash);
  }

  public get(hash: string): HashEntry | undefined {
    return this.hashes.get(hash);
  }
}
