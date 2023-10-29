# Dream
The Frankenstein's monster brought to you by (in order of contribution):
- Chat GPT4
- Co-Pilot
- Bing Integrated AI
- Houston
## Overview
Dream is an integrated project that includes a Discord bot (`dreambot`), a web application (`dreamweb`), and an API service (`dreamapi`). This project allows a users to submit prompts and additional paramters via slash commands to the Discord bot, and get an image as a response. That response is also stored in the database, which allows the webapp to show a gallery of all the images that have been generated, as well as view their favorites they have selected.

This project uses Docker containers, with PostGres as the database.

- **dreambot** - Discord bot that handles slash commands and responses
  - Python
- **dreamweb** - Web application that allows users to view a gallery of images, and select favorites
  - React
- **api** - API service that handles requests from the bot and webapp, and handles database interactions
  - Python & FastAPI
- **db** - PostGres database that stores all the images and user information

## Quick Start
1. Clone the repo `git clone https://github.com/bigwhitetuna/dream.git`
2. Navigate to project directory `cd dream`
3. Populate .env files (both in `/dream/api/.env` and `/dream/dreambot/.env`) with required variables
4. Run `sudo docker-compose up -f docker-compose.yml --build` (or `docker-compose up --build`, depending)
   1. Note the specification for the development compose yaml, not the production version. Development yaml **DOES NOT PERSIST DATA**. Production yaml does.

## Considerations
As of right now, the "images" themselves are not being stored in the database. Instead, the image is generated, uploaded to Discord as a file, and then the Discord CDN URL for the image is captured and stored in the database.

There doesn't appear to be any concrete definition of how long the Discord CDN will store the image, so this is a potential issue. However, I have found CDN image links that are well over 2 years old, and it is much cheaper this way, so will stick with it for now.

But this IS a potential risk for losing all the historical images that have been generated, including favorites. It may be that Favorites are stored as images in the future, to prevent loss.

For more detailed information on each component, refer to the READMEs in each subdirectory.

I'm just testing