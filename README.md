# Thoth Discord Bot

Auto-create threads in a specific channel, and auto-bumps new threads until the thread is archived.

This is a `self-hosted` bot so you can just fork this and adjust it as needed.

Keywords: `auto threader, support ticket, discord threads, discord thread bumper`

![](https://thumbs.gfycat.com/SpectacularScratchyBufflehead-size_restricted.gif)


## Features

* Discord.js
* Quick setup for `from/to` thread creation.
* Easy `.env` based setup.
* Gun Decentralized Database for Thread ID Storage
* Auto-Bump Threads

## Setup

* Install NodeJS 16+
* `npm install`
* Create a file called `.env` (No Extension)
* Add `DISCORD_BOT_SECRET=YOUR_TOKEN_HERE`
* ADD `GUN_USERNAME=ANY_USERNAME_YOU_WANT_TO_USE_MAKE_IT_UNIQUE`
* ADD `GUN_PASSWORD=ANY_PASSWORD_YOU_WANT_TO_USE`
* `npm run start`

Can use either environment variables or an `.env` file to setup.

## Environment Variables

The keys available to put into an `.env` file for processing.

| Key                | DESC                                                        |
| ------------------ | ----------------------------------------------------------- |
| DISCORD_BOT_SECRET | A Discord Bot Secret from Discord Developer Panel           |
| GUN_USERNAME       | A unique username, absolutely must be unique                |
| GUN_PASSWORD       | A unique password, absolutely must be secure, make it long. |