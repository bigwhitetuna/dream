### Package imports
import aiohttp
import base64
### Code imports
from dreambot.config import engineId, baseUrl, apiKey

class EmptyDataError(Exception):
    pass

### text-to-image Stability request and response handling
async def imageRequest(positivePrompt, negativePrompt, cfg, style, interaction):
    image_data = None
    payload = {
                "text_prompts": [
                    {
                        "text": positivePrompt,
                        "weight": 1
                        # TODO: Add support for negative weights
                    },
                    {
                        "text": negativePrompt,
                        "weight": -1
                    }
                ],
                "cfg_scale": int(cfg),
                "height": 1024,
                "width": 1024,
                "samples": 1,
                "steps": 40,
                }
    if style:
        payload["style_preset"] = style

    ### Make post async
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f'{baseUrl}/v1/generation/{engineId}/text-to-image',
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {apiKey}",
            },
            json=payload
        ) as response:
            error_content = await response.text()
            ### Handle Stability API errors###
            if response.status == 400:
                # specifically for naughty prompts
                if 'invalid_prompts' in error_content:
                    await interaction.followup.send(content=f"You tried to be naughty... Pervert!", ephemeral=False)
            # for all other errors not worth erroring to user differently, just logging different
            elif response.status != 200:
                await interaction.followup.send(content=f"There was an error from the Stability API.", ephemeral=True)
            else:
                # get raw data from response
                data = await response.json()  
                if 'artifacts' in data and len(data['artifacts']) > 0:
                    # store image data
                    image_data = base64.b64decode(data['artifacts'][0]['base64'])
                else:
                    print('No artifacts found in response, most likely because a lewd prompt')
                    raise EmptyDataError("Expected image data is empty or missing, most likely because a lewd prompt")
    if not image_data:
        raise EmptyDataError("No image data received")
    return image_data