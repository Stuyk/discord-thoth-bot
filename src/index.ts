import { Client, Intents } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import { AntiArchive } from "./system/antiArchive";
import { getClientToken } from "./system/config";
import { Threader } from "./system/threader";
import { createBugReport } from "./threadTypes/bug";
import { createFeatureRequest } from "./threadTypes/feature";
import { createTicket } from "./threadTypes/ticket";

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const supportTicketChannels = {
    from: "926540793701888081",
    to: "926541432892821514",
};

const bugTicketChannels = {
    from: "918918419607330816",
    to: "914695154751905852",
};

const featureTicketChannels = {
    from: "926544271539077120",
    to: "918166438617960518",
};

client.on("ready", () => {
    client.user.setActivity("Support Requests", { type: ActivityTypes.LISTENING });
    client.on("messageCreate", Threader.handle);

    // Threads for Channels to Watch for
    Threader.init(client);
    Threader.bind(supportTicketChannels.from, supportTicketChannels.to, createTicket);
    Threader.bind(bugTicketChannels.from, bugTicketChannels.to, createBugReport);
    Threader.bind(featureTicketChannels.from, featureTicketChannels.to, createFeatureRequest);

    // Prevent Discord Archiving Channels
    AntiArchive.init(client);

    // Log the Bot is ready
    console.log(`[${Date.now()}] Started Thoth Successfully. Listening for Messages.`);
});

client.login(getClientToken());
