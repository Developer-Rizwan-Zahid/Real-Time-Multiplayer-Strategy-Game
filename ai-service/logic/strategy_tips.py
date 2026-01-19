def generate_strategy_tips(win_rate):
    tips = []

    if win_rate < 0.4:
        tips.append("Focus on defensive moves")
        tips.append("Avoid risky early attacks")
    elif win_rate < 0.7:
        tips.append("Balance attack and defense")
        tips.append("Adapt strategy based on opponent moves")
    else:
        tips.append("Maintain aggressive play")
        tips.append("Exploit opponent weaknesses")

    return tips
