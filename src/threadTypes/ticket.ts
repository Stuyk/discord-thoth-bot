import { Client, Message, MessageEmbed, TextChannel } from "discord.js";
import { mainConfig } from "../system/mainConfig";

/**
 * Create a new ticket in the specified channel.
 * @param {Client} client - Client - The client object.
 * @param {Message} message - The message that triggered the command.
 * @param {string} to - The channel ID of the channel to send the ticket to.
 * @returns None
 */
export async function createTicket(client: Client, message: Message, to: string) {
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
            iconURL: message.author.avatarURL() as string,
        },
    });

    const newMessage = await channel.send({ embeds: [embed], content: `${author}` });
    const thread = await newMessage.startThread({ name: threadName, reason: `Support Ticket Request` });

    let tagList = "";

    for (const role of mainConfig.rolesToTag) {
        tagList += `<@&${role}> `;
    }

    thread.send(`Tagging Roles: ${tagList}`);
}
