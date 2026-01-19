def recommend_opponent_skill(player_skill):
    if player_skill < 1000:
        return player_skill + 50
    elif player_skill < 1500:
        return player_skill + 25
    else:
        return player_skill
