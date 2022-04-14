# Thoth Discord Bot

Auto-create threads in a specific channel, and tags a certain roles.

This is a `self-hosted` bot so you can just fork this and adjust it as needed.

Keywords: `auto threader, support ticket, discord threads`

![](https://thumbs.gfycat.com/SpectacularScratchyBufflehead-size_restricted.gif)

## Features

* Discord.js
* Quick setup for `from/to` thread creation.

## Setup

* Install NodeJS 16+
* `npm install`
* Create a file called `.env` (No Extension)
* Add `DISCORD_BOT_SECRET=YOUR_TOKEN_HERE`
* `npm run start`

Can use either environment variables or an `.env` file to setup.

## Environment Variables

The keys available to put into an `.env` file for processing.

| Key                | DESC                                              |
| ------------------ | ------------------------------------------------- |
| DISCORD_BOT_SECRET | A Discord Bot Secret from Discord Developer Panel |