from fastapi import FastAPI
from schemas import AnalyticsInput, AIResponse
from logic.win_probability import calculate_win_probability
from logic.opponent_recommendation import recommend_opponent_skill
from logic.strategy_tips import generate_strategy_tips
from logic.skill_prediction import predict_skill

app = FastAPI(title="Game AI Service")

@app.post("/analyze", response_model=AIResponse)
def analyze_player(data: AnalyticsInput):
    win_prob = calculate_win_probability(data.playerId, data.games)
    win_rate = win_prob

    # Dummy current skill 
    current_skill = 1000

    opponent_skill = recommend_opponent_skill(current_skill)
    tips = generate_strategy_tips(win_rate)
    predicted_skill = predict_skill(current_skill, win_rate)

    return AIResponse(
        winProbability=win_prob,
        recommendedOpponentSkill=opponent_skill,
        strategyTips=tips,
        predictedSkill=predicted_skill
    )
