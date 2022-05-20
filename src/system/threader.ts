import "reflect-metadata";
import { Client, Message, MessageEmbed, TextChannel } from "discord.js";
import { container, inject, singleton } from "tsyringe";
import { config } from "../configs";

const routes: Array<{
    from: string;
    to: string;
    callback: (client: Client, message: Message, to: string) => Promise<void>;
}> = [];

@singleton()
export class Threader {
    constructor(@inject("Client") private readonly client: Client) {
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

    public async createTicket(client: Client, message: Message, to: string): Promise<void> {
        const content = message.content;
        const authorText = `${message.author.username}#${message.author.discriminator}`;
        const threadName = `${authorText} Ticket`;
        const author = `<@!${message.author.id}>`;
        await message.delete();

        const channel = client.channels.cache.get(to) as TextChannel;
        const embed = new MessageEmbed({
            title: `Support Ticket for ${authorText}`,
            description: `${content}`,
            color: "AQUA",
            footer: {
                text: `Requested by ${message.author.tag}. If someone is able to answer your question they will write in this thread. Please be patient.`,
                iconURL: message.author.avatarURL() ?? "",
            },
        });

        const newMessage = await channel.send({ embeds: [embed], content: `${author}` });
        const thread = await newMessage.startThread({ name: threadName, reason: `Support Ticket Request` });

        let tagList = "";

        for (const role of config.rolesToTag) {
            tagList += `<@&${role}>, `;
        }

        thread.send(`Tagging Roles: ${tagList}`);
    }
}
