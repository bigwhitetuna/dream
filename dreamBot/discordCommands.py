### Package imports
import discord
import io
from discord import app_commands
from discord.ext import commands
from typing import Literal, Optional
from discord.ui import Button, View
### Code imports
from dreamBot.utils.getUserInfo import getUserInfo
from dreamBot.utils.imageRequest import imageRequest
from dreamBot.utils.storeRequest import store_request
from dreamBot.utils.getLeaderboardData import get_leaderboard_data

# set intents for discord bot
intents = discord.Intents(
guilds=True,
members=True,
messages=True,
message_content=True,
)

# discordClient = discord.Client(intents=intents)
bot = commands.Bot(command_prefix='/', intents=intents)

#######################################
# Discord bot interactions
#######################################

@bot.event
async def on_ready():
    # friendly message to see bot is running
    print(f'\nDream bot is up and running!\n') 

### Dream Command ###
@bot.tree.command(name='dream', description='Generate an image from a prompt.')
@app_commands.describe(prompt = 'Enter a prompt to generate an image from.',
                    negative_prompt = 'Describe the things you DON\'T want in your image, such as blur, blurry, etc. If you put nothing, blur added as a negative prompt by default.',
                    imagination = 'A number 1-35, 35 being less imaginative, 1 being wildly imaginative',
                    style_preset = 'Style presets provided by Stability, that work very well with their model.')
async def dream(interaction: discord.Interaction,
                prompt: str,
                style_preset: Optional[Literal[    
                    '3d-model',
                    'analog-film',
                    'anime',
                    'cinematic',
                    'comic-book',
                    'digital-art',
                    'enhance',
                    'fantasy-art',
                    'isometric',
                    'line-art',
                    'low-poly',
                    'modeling-compound',
                    'neon-punk',
                    'origami',
                    'photographic',
                    'pixel-art',
                    'tile-texture']],
                imagination: int = 10,
                negative_prompt: Optional[str] = 'blur',
                ):    
    # grab user info
    user = getUserInfo(interaction)

    #######################################
    ### Generate images ###
    #######################################
    try:
        # Defer the reply so we can do some async work before responding
        await interaction.response.defer(ephemeral=False)
        nickname = interaction.user.nick
        if not nickname:
            nickname = interaction.user.name
        # retrive the prompt from the user
        prompt = prompt
        negativePrompt = negative_prompt
        # logic for making sure cfg value is between 1 and 35
        if imagination is None:
            cfg = 10
        else:
            cfg = min(35, max(1, round(imagination)))
        # set styles from response
        style = style_preset

        image_data = None
        # handle if image_data doesn't come through (most likely cause of a lewd prompt, but might be another error)
        try:
            # process response
            image_data = await imageRequest(prompt, negativePrompt, cfg, style, interaction)
        except Exception as e:
            print(e)
        
        #only send response if image data is available
        if image_data:
            # create the embed from the response
            embed = discord.Embed(description=f'**Prompt:** {prompt} \n **Negative Prompt:** {negativePrompt} \n**Imagination #:** {cfg} \n**Style:** {style}')
            file = discord.File(io.BytesIO(image_data), filename='image.png')
            embed.set_image(url="attachment://image.png")
            embed.set_footer(text=f'Requested by {nickname}', icon_url=user['avatar'])

            # add buttons 
            button1 = Button(label="Favorite", style=discord.ButtonStyle.blurple, custom_id="favorite", emoji="❤️")
            button2 = Button(label="Website", style=discord.ButtonStyle.link, url="https://google.com/")
            view = View()
            view.add_item(button1)
            view.add_item(button2)
            # final response to channel and user with image
            message = await interaction.followup.send(
                content=f"Here is your image {user['mention']}!", 
                embed=embed,
                file=file,
                view=view,
                ephemeral=False
                )
  
            image_url = message.embeds[0].image.url
            userDict = {
                'id': user['id'],
                'name': nickname,
                'avatar': user['avatar'].url
            }
            # update db with user request
            await store_request(userDict, prompt, negativePrompt, cfg, style, image_url)

    #######################################
    # Error handling
    #######################################
    ### Discord errors ###
    except (discord.Forbidden, discord.HTTPException, discord.NotFound, discord.RateLimited, discord.DiscordException) as e:
        await interaction.followup.send(content=f"There was an error with Discord. Error message: {e}.", ephemeral=True)
        print(e)
    # Generic error handling
    except Exception as e:
        print(e)
        await interaction.followup.send(content=f"{user['mention']}, there was an error processing your request.", ephemeral=True)
        import traceback
        traceback.print_exc()
    

### Dream Leader ###
@bot.tree.command(name='dreamleader', description='Get the leaderboard for DalleBot')
async def dreamleader(interaction: discord.Interaction):
    # grab user info
    user = getUserInfo(interaction)
    
    rank_emojis = {
        1: "🥇",
        2: "🥈",
        3: "🥉",
    }

    try:
        # Defer the reply so we can do some async work before responding
        await interaction.response.defer()

        # get the leaderboard info from the db
        leaderboard_data = await get_leaderboard_data()

        description = ''
        # TODO: Format this embed to make it pop
        for idx, entry in enumerate(leaderboard_data):
            discord_user_id = entry['discord_user_id']
            count = entry['dream_count']
            member = bot.get_user(discord_user_id)
            if not member:
                continue
            if idx + 1 in rank_emojis:
                description += f"{rank_emojis[idx+1]} {member.name} with **{count}** requests\n"
            else:
                description += f"{idx+1}. {member.name} with **{count}** requests\n"
        # create the embed for the response
        embed = discord.Embed(title='DalleBot Leaderboard', description=description)

        #requestedby footer stuff
        nickname = interaction.user.nick
        if not nickname:
            nickname = interaction.user.name
        embed.set_footer(text=f"Requested by {nickname}", icon_url=user['avatar'])

        # final response to channel
        await interaction.followup.send(
            embed=embed,
            ephemeral=False
            )
    except Exception as e:
        await interaction.followup.send(content=f"{user['mention']}, there was an error processing your request. Please try again.", ephemeral=True)
        raise e

### Command Tree Sync ###
@bot.tree.command(name='dreamsync', description='Sync any new commands to discord')
@commands.has_any_role("Admins")
async def dreamsync(interaction: discord.Interaction):
    try:
        await interaction.response.defer(ephemeral=False)
        await bot.tree.sync()
        await interaction.followup.send(content=f"Commands synced, Daddy.", ephemeral=False)
    except Exception as e:
        await interaction.followup.send(content=f"There was an error syncing the command tree. Error message: {e}.", ephemeral=True)
        print(e)

### Dream Help ###
@bot.tree.command(name='dreamhelp', description='Get help with DreamBot')
async def dreamhelp(interaction: discord.Interaction):
    try:
        await interaction.response.send_message(content="Run `/dream` to generate images. \n\n"
                                       "`prompt`: what is used to generate the image, can be as short or verbose as you like, though the model does enjoy \n"
                                       "`negative_prompt`: what you don't want in the image, such as blur, blurry, etc. If you put nothing, blur added as a negative prompt by default. \n"
                                       "`imagination`: a number 1-35, 35 being less imaginative, 1 being wildly imaginative. \n"
                                       "`style_preset`: style presets provided by Stability, that work very well with their model. \n"
                                        "Example: `/dream prompt=cat negative_prompt=blur imagination=10 style_preset=anime` \n \n"
                                        "Run `/dreamleader` to get the leaderboard for DalleBot. \n"
                                       , ephemeral=True)
    except Exception as e:
        print(e)

### Credits Check ###
# @bot.tree.command(name='dreamsync', description='Sync any new commands to discord')
# @commands.has_any_role("Admins")
# async def dreamsync(interaction: discord.Interaction):
#     try:
#         await interaction.response.defer(ephemeral=True)
#         # call credit check API
#         await 
#         await interaction.followup.send(content=f"Commands synced, Daddy.", ephemeral=True)
#     except Exception as e:
#         await interaction.followup.send(content=f"There was an error syncing the command tree. Error message: {e}.", ephemeral=True)
#         logger.error(f'Error error syncing command tree.', exc_info=True)