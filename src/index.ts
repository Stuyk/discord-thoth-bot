import "reflect-metadata";
import { container } from "tsyringe";
import { Bot } from "./system/bot";
import "./configs/tsyringe/container";

let bot = container.resolve(Bot);
bot.listen().then(() => {
    console.log(
        `[${new Date(Date.now()).toLocaleTimeString("en-US", {
            hour12: true,
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        })}] Started Thoth Successfully. Listening for Messages.`
    );
});
