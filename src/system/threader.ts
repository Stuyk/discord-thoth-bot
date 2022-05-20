import "reflect-metadata";
import { Client, Message } from "discord.js";
import { autoInjectable, container, delay, inject } from "tsyringe";

const routes: Array<{
    from: string;
    to: string;
    callback: (client: Client, message: Message, to: string) => Promise<void>;
}> = [];

@autoInjectable()
export class Threader {
    constructor(@inject(delay(() => Client)) private readonly client: Client) {
        this.client = container.resolve("Client");
    }
    /**
     * Bind all messages in a specific channel to go to create a thread in a specific channel.
     * @static
     * @param {string} from
     * @param {string} to
     * @param {(message: Message, to: string) => void} callback
     * @memberof Threader
     */
    public bindThreader(
        from: string,
        to: string,
        callback: (client: Client, message: Message, to: string) => Promise<void>
    ) {
        routes.push({ from, to, callback });
    }

    /**
     * Handles messages being created.
     * @static
     * @param {Message} message
     * @return {*}
     * @memberof Threader
     */
    public handle(message: Message): void {
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

        console.log(
            `[${new Date(Date.now()).toLocaleTimeString("en-US", {
                hour12: true,
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
            })}] Processed Request on Channel: ${message.channelId}`
        );
        route.callback(this.client, message, route.to);
    }
}
