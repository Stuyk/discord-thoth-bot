import { Client, Message } from "discord.js";

const routes: Array<{
    from: string;
    to: string;
    callback: (client: Client, message: Message, to: string) => Promise<void>;
}> = [];

let client: Client;

export class Threader {
    /**
     * Get the client instance from entrypoint to here.
     * @param {Client} _client - The client object that is calling the function.
     * @returns None
     */
    static init(_client: Client) {
        client = _client;
    }

    /**
     * Bind all messages in a specific channel to go to create a thread in a specific channel.
     * @static
     * @param {string} from
     * @param {string} to
     * @param {(message: Message, to: string) => void} callback
     * @memberof Threader
     */
    static bind(from: string, to: string, callback: (client: Client, message: Message, to: string) => Promise<void>) {
        routes.push({ from, to, callback });
    }

    /**
     * Handles messages being created.
     * @static
     * @param {Message} message
     * @return {*}
     * @memberof Threader
     */
    static handle(message: Message): void {
        if (message.author.bot) {
            return;
        }

        const index = routes.findIndex((currentRoute) => currentRoute.from === message.channel.id);
        if (index <= -1) {
            return;
        }

        const route = routes[index];
        if (!route.callback) {
            return;
        }

        console.log(`[${Date.now()}] Processed Request on Channel: ${message.channel.id}`);
        route.callback(client, message, route.to);
    }
}
