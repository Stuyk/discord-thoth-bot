import * as dotenv from "dotenv";

dotenv.config();

export function getClientToken() {
    if (!process.env.DISCORD_BOT_SECRET) {
        console.error(`Failed to get 'DISCORD_BOT_SECRET' from '.env' file or environment variables.`);
        console.error(`Please create an '.env' file with DISCORD_BOT_SECRET=YOUR_TOKEN`);
        process.exit(1);
    }

    return process.env.DISCORD_BOT_SECRET;
}
