import { Client, Message, MessageEmbed, TextChannel } from "discord.js";

/**
 * Creates a new feature request ticket in the specified channel.
 * @param {Client} client - Client - The client object.
 * @param {Message} message - Message - The message that triggered the command.
 * @param {string} to - The channel ID of the channel to send the ticket to.
 * @returns None
 */
export async function createFeatureRequest(client: Client, message: Message, to: string) {
    const title = message.content.toString().slice(0, 28) + "...";
    const content = message.content;
    const authorText = `${message.author.username}#${message.author.discriminator}`;
    const author = `<@!${message.author.id}>`;
    await message.delete();

    const channel = client.channels.cache.get(to) as TextChannel;
    const embed = new MessageEmbed({
        title: `Feature Request by ${authorText}`,
        description: `${content}`,
        color: "LUMINOUS_VIVID_PINK",
        footer: {
            text: `Created by ${message.author.tag}. Please provide any additional details in-thread.`,
            iconURL: message.author.avatarURL(),
        },
    });

    const newMessage = await channel.send({ embeds: [embed], content: `${author}` });
    await newMessage.startThread({ name: title, reason: `Feature Request Ticket` });
}
