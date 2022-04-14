import { Client, Intents } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import { getClientToken } from "./system/config";
import { Threader } from "./system/threader";
import { createTicket } from "./threadTypes/ticket";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const supportTicketChannels = {
    from: "926540793701888081",
    to: "926541432892821514",
};

client.on("ready", () => {
    client.user.setActivity("Support Requests", { type: ActivityTypes.LISTENING });
    client.on("messageCreate", Threader.handle);

    // Threads for Channels to Watch for
    Threader.init(client);
    Threader.bind(supportTicketChannels.from, supportTicketChannels.to, createTicket);

    // Log the Bot is ready
    console.log(`[${Date.now()}] Started Thoth Successfully. Listening for Messages.`);
});

client.login(getClientToken());
