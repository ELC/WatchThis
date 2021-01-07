from fastapi import FastAPI
import requests

app = FastAPI()

recommend_url = "https://raw.githubusercontent.com/ELC/WatchThis/master/data/recommendations.json"
RECOMMENDATIONS = requests.get(recommend_url).json()

suggestions_url = "https://raw.githubusercontent.com/ELC/WatchThis/master/data/suggestions.json"
SUGGESTIONS = requests.get(suggestions_url).json()


@app.get("/")
async def root():
    return "Nothing to Look Here"


@app.get("/recommend/{user_id}")
async def get_recommend(user_id):
    global RECOMMENDATIONS

    if user_id not in RECOMMENDATIONS:
        return  {user_id: []}

    return {user_id: RECOMMENDATIONS[user_id]}


@app.get("/suggest/{user_id}")
async def get_recommend(user_id):
    global SUGGESTIONS

    if user_id not in RECOMMENDATIONS:
        return  {user_id: []}

    return {user_id: SUGGESTIONS[user_id]} 

