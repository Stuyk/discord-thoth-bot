import * as Gun from "gun";

const gun = Gun();
const user = gun.user();

export class GunHelper {
    /**
     * It creates a user with the given username and password, and if the user creation fails, it
    exits the process with a non-zero exit code.
     * @param {string} username - The username to use for authentication
     * @param {string} password - The password to use for the user.
     */
    static async create(username: string, password: string): Promise<boolean> {
        return new Promise((resolve: Function) => {
            user.create(username, password, (ack) => {
                if (ack["err"] && ack["err"] !== "User already created!") {
                    console.warn(ack["err"]);
                    console.warn(`[${Date.now()}] Could not authenticate with GUN, username or password is too short`);
                    process.exit(1);
                }

                if (typeof ack["err"] === "string" && ack["err"].includes("already created")) {
                    console.log(`[${Date.now()}] Username Already Exists. Skipping.`);
                    return resolve(true);
                }

                console.log(`[${Date.now()}] Created User for GUN Database`);
                return resolve(true);
            });
        });
    }

    /**
     * Authenticates with the GUN server.
     * @param {string} username - The username to authenticate with
     * @param {string} password - The password to use for authentication
     * @returns A boolean value.
     */
    static async auth(username: string, password: string): Promise<boolean> {
        return new Promise((resolve: Function) => {
            user.auth(username, password, (ack) => {
                if (ack["err"]) {
                    console.warn(ack["err"]);
                    console.warn("[${Date.now()}] Could not authenticate with GUN, username or password is incorrect");
                    process.exit(1);
                }

                console.log(`[${Date.now()}] Authenticated with GUN Database`);
                return resolve(true);
            });
        });
    }

    static async put<T>(key: string, data: T): Promise<void> {
        user.get(key).put(data);
    }

    static async get<T>(key: string): Promise<T> {
        return new Promise((resolve: Function) => {
            user.get(key).once((data, key) => {
                return resolve(data);
            });
        });
    }
}
