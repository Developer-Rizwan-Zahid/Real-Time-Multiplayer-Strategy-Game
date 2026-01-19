def calculate_win_probability(player_id, games):
    wins = 0
    total = 0

    for g in games:
        if not g.isFinished:
            continue

        total += 1
        if (
            (g.player1Id == player_id and g.player1Score > g.player2Score) or
            (g.player2Id == player_id and g.player2Score > g.player1Score)
        ):
            wins += 1

    if total == 0:
        return 0.5  

    return round(wins / total, 2)
