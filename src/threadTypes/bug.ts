import { Client, Message, MessageEmbed, TextChannel } from "discord.js";
import { AntiArchive } from "../system/antiArchive";

const rolesToTag = ["790594226437881857"];

/**
 * Create a bug report ticket in the specified channel.
 *
 * # How to use
 * @param {Client} client - Client - The client object.
 * @param {Message} message - The message that triggered the command.
 * @param {string} to - The channel ID to send the bug report to.
 * @returns None
 */
export async function createBugReport(client: Client, message: Message, to: string) {
    const title = message.content.toString().slice(0, 28) + "...";
    const content = message.content;
    const authorText = `${message.author.username}#${message.author.discriminator}`;
    const author = `<@!${message.author.id}>`;
    await message.delete();

    const channel = client.channels.cache.get(to) as TextChannel;
    const embed = new MessageEmbed({
        title: `Bug Report by ${authorText}`,
        description: `${content}`,
        color: "RED",
        footer: {
            text: `Created by ${message.author.tag}. Please provide any additional details in-thread.`,
            iconURL: message.author.avatarURL(),
        },
    });

    const newMessage = await channel.send({ embeds: [embed], content: `${author}` });
    const thread = await newMessage.startThread({ name: title, reason: `Bug Report Ticket` });

    let tagList = "";

    for (let i = 0; i < rolesToTag.length; i++) {
        tagList += `<@&${rolesToTag[i]}> `;
    }

    thread.send(`Tagging Roles: ${tagList}`);
    AntiArchive.register({ thread, neverArchive: false, refreshTimeInMs: 43200000 });
}
