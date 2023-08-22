import logging
### make it easier to get user info
def getUserInfo(interaction):
    try:
        user = {
            'id': interaction.user.id,
            'mention': f'<@{interaction.user.id}>',
            'avatar': interaction.user.display_avatar
        }
        return user
    except Exception as e:
        logging.error(e)