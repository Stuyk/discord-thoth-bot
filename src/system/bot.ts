import { Client } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import { injectable, inject } from "inversify";
import { createTicket } from "../threadTypes/ticket";
import { mainConfig } from "./mainConfig";
import { Threader } from "./threader";
import { TYPES } from "./types";

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;

    constructor(@inject(TYPES.Client) client: Client, @inject(TYPES.Token) token: string) {
        this.client = client;
        this.token = token;
    }

    public listen(): Promise<string> {
        this.client.on("ready", () => {
            if (this.client.user) {
                this.client.user.setActivity("Support Requests", { type: ActivityTypes.LISTENING });
            }
            this.client.on("messageCreate", Threader.handle);

            // Threads for Channels to Watch for
            Threader.init(this.client);
            Threader.bind(mainConfig.supportTicketChannels.from, mainConfig.supportTicketChannels.to, createTicket);

            // Log the Bot is ready
            console.log(`[${Date.now()}] Started Thoth Successfully. Listening for Messages.`);
        });

        return this.client.login(this.token);
    }
}
