from fastapi import FastAPI
import requests

app = FastAPI()

recommend_url = "https://raw.githubusercontent.com/ELC/WatchThis/master/data/recommendations.json"
RECOMMENDATIONS = requests.get(recommend_url).json()

suggestions_url = "https://raw.githubusercontent.com/ELC/WatchThis/master/data/suggestions.json"
SUGGESTIONS = requests.get(suggestions_url).json()


@app.get("/recommend/{user_id}")
async def get_recommend(user_id):
    global RECOMMENDATIONS

    response = {user_id: []}

    if user_id in RECOMMENDATIONS:
        response[user_id] = RECOMMENDATIONS[user_id]

    return response


@app.get("/suggest/{user_id}")
async def get_recommend(user_id):
    global SUGGESTIONS

    response = {user_id: []}

    if user_id in SUGGESTIONS:
        response[user_id] = SUGGESTIONS[user_id]

    return response

