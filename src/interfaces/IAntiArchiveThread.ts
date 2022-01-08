import { ThreadChannel } from "discord.js";

export interface IAntiArchiveThread {
    /**
     * The thread to use for this AntiArchive mechanism
     * @type {ThreadChannel}
     * @memberof IAntiArchiveThread
     */
    thread: ThreadChannel;

    /**
     * Recommend at least 43,200,000 MS (12 Hours)
     * @type {number}
     * @memberof IAntiArchiveThread
     */
    refreshTimeInMs: number;

    /**
     * Just keep bumping the thread regardless if it's marked as archived
     * @type {boolean}
     * @memberof IAntiArchiveThread
     */
    neverArchive: boolean;
}
