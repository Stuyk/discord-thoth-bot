require("dotenv").config();
import { Container } from "inversify";
import { Client, Intents } from "discord.js";
import { Bot } from "../system/bot";
import { TYPES } from "./inversifyTypes";

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container
    .bind<Client>(TYPES.Client)
    .toConstantValue(new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }));
container.bind<string>(TYPES.Token).toConstantValue(process.env.DISCORD_BOT_SECRET as string);

export default container;
