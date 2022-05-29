import "reflect-metadata";

import { Client } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import { Threader } from "./threader";
import { config } from "../configs";
import { inject, singleton } from "tsyringe";

require("dotenv").config();

@singleton()
export class Bot {
    constructor(
        @inject("Client") private readonly client: Client,
        @inject("Threader") private readonly threader: Threader
    ) {}

    public listen(): Promise<string> {
        this.client.on("ready", () => {
            if (this.client.user) {
                this.client.user.setActivity("Support Requests", { type: ActivityTypes.LISTENING });
            }

            this.client.on("messageCreate", this.threader.handle.bind(this));
            this.threader.bindThreader(
                config.supportTicketChannels.from,
                config.supportTicketChannels.to,
                this.threader.createTicket.bind(this)
            );
        });

        return this.client.login(process.env.DISCORD_BOT_SECRET ?? "");
    }
}
