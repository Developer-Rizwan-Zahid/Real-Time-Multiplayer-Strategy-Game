from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GameData(BaseModel):
    id: int
    player1Id: int
    player2Id: int
    player1Score: int
    player2Score: int
    isFinished: bool
    startedAt: datetime
    finishedAt: Optional[datetime]

class AnalyticsInput(BaseModel):
    playerId: int
    games: List[GameData]

class AIResponse(BaseModel):
    winProbability: float
    recommendedOpponentSkill: int
    strategyTips: List[str]
    predictedSkill: int
