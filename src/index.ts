require("dotenv").config();

import "reflect-metadata";

import { TYPES } from "./system/types";
import container from "./system/inversify.config";
import { Bot } from "./system/bot";

let bot = container.get<Bot>(TYPES.Bot);
bot.listen()
    .then(() => {
        console.log("Thoth has successfully logged in.");
    })
    .catch((error) => {
        console.log("An error occured! => ", error);
    });
