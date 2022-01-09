import { Client, Collection, ThreadChannel } from "discord.js";
import { IAntiArchiveThread } from "../interfaces/IAntiArchiveThread";
import { IThreadStore } from "../interfaces/IThreadStore";
import { getGunPassword, getGunUsername } from "./config";
import { GunHelper } from "./gun";

const TIME_BETWEEN_UPDATES = 60000;
let client: Client;

/**
 * Pulls data from PouchDB and uses it.
 *
 * @param {boolean} [isStartup=false]
 */
async function update(isStartup = false) {
    const threads = client.channels.cache.filter((ch) => ch.isThread()) as Collection<string, ThreadChannel>;

    threads.forEach(async (threadChannel) => {
        const threadInfo = await GunHelper.get<IThreadStore>(threadChannel.id);
        if (!threadInfo) {
            return;
        }

        if (!isStartup) {
            if (!threadInfo.neverArchive && threadChannel.archived) {
                return;
            }

            if (Date.now() < threadInfo.refreshTime && !threadInfo.neverArchive) {
                return;
            }
        }

        try {
            await threadChannel.setArchived(false);
            const msg = await threadChannel.send("Bump");
            if (msg.deletable) {
                msg.delete();
            }
        } catch (err) {
            console.log(`[${Date.now()}] Could not unarchive thread.`);
        }

        console.log(`[${Date.now()}] Bumped Thread: ${threadChannel.name}`);

        await GunHelper.put<IThreadStore>(threadChannel.id, {
            thread: threadChannel.id,
            update: Date.now() + threadInfo.refreshTime,
            neverArchive: threadInfo.neverArchive,
            refreshTime: threadInfo.refreshTime,
        });
    });
}

export class AntiArchive {
    /**
     * Pulls all threads stored in PouchDB and bumps them on startup.
     * Only bumps threads that should be bumped.
     *
     * @static
     * @param {Client} _client
     * @memberof AntiArchive
     */
    static async init(_client: Client) {
        client = _client;

        await GunHelper.create(getGunUsername(), getGunPassword());
        await GunHelper.auth(getGunUsername(), getGunPassword());

        await update(true);
        setInterval(update, TIME_BETWEEN_UPDATES);
    }

    /**
     * Register a thread to never be archived, unless manually archived.
     * All threads will be continuously bumped forever.
     *
     * @static
     * @param {IAntiArchiveThread} thread
     * @memberof AntiArchive
     */
    static async register(data: IAntiArchiveThread) {
        await GunHelper.put<IThreadStore>(data.thread.id, {
            thread: data.thread.id,
            update: Date.now() + data.refreshTimeInMs,
            neverArchive: data.neverArchive,
            refreshTime: data.refreshTimeInMs,
        });

        console.log(`[${Date.now()}] Probably stored thread ${data.thread.id} for archive based bumping`);
    }
}
