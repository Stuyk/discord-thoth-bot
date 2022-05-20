import "reflect-metadata";
require("dotenv").config();
import { Client } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import { Threader } from "./threader";
import { config } from "../configs";
import { createTicket } from "../threadTypes/ticket";
import { autoInjectable, container, inject } from "tsyringe";

@autoInjectable()
export class Bot {
    constructor(
        @inject("Client") private readonly client: Client,
        @inject("Threader") private readonly threader: Threader
    ) {
        this.client = container.resolve("Client");
        this.threader = container.resolve("Threader");
    }

    public listen(): Promise<string> {
        this.client.on("ready", () => {
            if (this.client.user) {
                this.client.user.setActivity("Support Requests", { type: ActivityTypes.LISTENING });
            }

            this.client.on("messageCreate", this.threader.handle.bind(this));
            this.threader.bindThreader(
                config.supportTicketChannels.from,
                config.supportTicketChannels.to,
                createTicket
            );
        });

        return this.client.login(process.env.DISCORD_BOT_SECRET as string);
    }
}
