import { dataSource } from "../db";

class DbUtil {
    async getDefaultConnection() {
        return dataSource
    }

    // async init() {
    //     console.log("Creating connection to database...");
    //     const db =  await dataSource.initialize();
    //     if(!db.isInitialized) {
    //         console.log("Database is not initialized");
    //     }
    // }
    async init() {
        console.log("Creating connection to database...");
        await dataSource; // Wait for dataSource to be resolved
        const db = await dataSource.initialize();
        if (!db.isInitialized) {
            console.log("Database is not initialized");
        }
    }
    
}

export default new DbUtil();