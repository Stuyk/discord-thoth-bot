import { Client, Intents } from "discord.js";
import { container } from "tsyringe";
import { Threader } from "../../system/threader";

container.register<Client>("Client", {
    useValue: new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }),
});

container.registerSingleton<Threader>("Threader", Threader);
