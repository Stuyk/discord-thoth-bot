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
    public async handle(message: Message): Promise<void> {
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

    /**
     * It creates a ticket in a specified channel, and tags a specified role
     * @param {Client} client - Client - The client object
     * @param {Message} message - Message - The message that was sent to the bot
     * @param {string} to - string - The channel ID to send the ticket to
     */
    public async createTicket(client: Client, message: Message, to: string): Promise<void> {
        const content = message.content;
        const authorText = `${message.author.username}#${message.author.discriminator}`;
        const threadName = `${authorText} Ticket`;
        const author = `<@!${message.author.id}>`;
        const userRoles = message.member?.roles.cache.map((role) => role.id);

        await message.delete();

        if (!userRoles?.some((role) => config.rolesAllowedToUse.includes(role))) {
            await message.channel.send(
                "You do not have the required role to use this feature. Check out https://www.patreon.com/stuyk"
            );
            return;
        }

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
