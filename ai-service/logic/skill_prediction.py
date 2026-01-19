def predict_skill(current_skill, win_rate):
    improvement = int(win_rate * 50)
    return current_skill + improvement
