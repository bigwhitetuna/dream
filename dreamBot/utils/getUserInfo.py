### make it easier to get user info
def getUserInfo(interaction):
    user = {
        'id': interaction.user.id,
        'mention': f'<@{interaction.user.id}>',
        'avatar': interaction.user.display_avatar
    }
    return user