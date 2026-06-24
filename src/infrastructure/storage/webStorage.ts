// import { IStorage } from "./iStorage";

// export class WebStorage implements IStorage { 
//     async save(name: string, data: unknown): Promise<void> {
//         const storage = this.getStorage();
//         try {
//             await storage.setItem(name, JSON.stringify(data));
//         } catch (error) {
//             throw error;
//         }
//     }

//     private getStorage() {
//         if (!("localStorage" in globalThis)) {
//             return null;
//         }

//         return (globalThis as any).localStorage;
//     }
// }
