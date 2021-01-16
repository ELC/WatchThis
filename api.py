import csv

from fastapi import FastAPI
import requests

app = FastAPI()

recommend_url = "https://raw.githubusercontent.com/ELC/WatchThis/master/data/recommendations.json"
RECOMMENDATIONS = requests.get(recommend_url).json()

suggestions_url = "https://raw.githubusercontent.com/ELC/WatchThis/master/data/suggestions.json"
SUGGESTIONS = requests.get(suggestions_url).json()


def get_recommendation_by_user(user_id):
    global RECOMMENDATIONS

    response = {user_id: []}

    if user_id in RECOMMENDATIONS:
        response[user_id] = RECOMMENDATIONS[user_id]
        return response
    
    return get_recommendation_by_similar_user(user_id)


def get_recommendation_by_similar_user(user_id):
    base_url = "https://watchthis-a7537-default-rtdb.firebaseio.com"
    new_user = requests.get(f'{base_url}/ratings.json?orderBy="userId"&equalTo="{user_id}"').json()

    new_user_movies = {movie["movieId"]:movie["rating"] for movie in new_user.values()}
    new_user_movies_id = list(new_user_movies.keys())

    CSV_URL = 'https://raw.githubusercontent.com/ELC/WatchThis/master/data/predictions_matrix.csv'

    with requests.Session() as session:
        download = session.get(CSV_URL)

    decoded_content = download.content.decode('utf-8')
    
    users = {}

    csv_reader = csv.reader(decoded_content.splitlines(), delimiter=',')
    database_movie_ids = next(csv_reader)[1:]
    
    for alias, *movies in csv_reader:
        user_data = {}
        for movie_index, movie_rating in enumerate(movies):
            movie_id = database_movie_ids[movie_index]
            if movie_id in new_user_movies_id:
                user_data[movie_id] = float(movie_rating)
        
        users[alias] = user_data


    user_distances = []

    for user_name, user_ratings in users.items():
        errors_squared_sum = 0
        for movie_id, rating in user_ratings.items():
            errors_squared_sum += (new_user_movies[movie_id] - rating) ** 2

        distance = errors_squared_sum ** 0.5
        user_distances.append((user_name, distance))

    similar_users = sorted(user_distances, key=lambda x: x[1])
    most_similar_user = similar_users[0][0]
    
    global RECOMMENDATIONS

    response = {user_id: []}

    if most_similar_user in RECOMMENDATIONS:
        response[user_id] = RECOMMENDATIONS[most_similar_user]

    return response


@app.get("/recommend/{user_id}")
async def get_recommend(user_id):
    return get_recommendation_by_user(user_id)


@app.get("/suggest/{user_id}")
async def get_recommend(user_id):
    global SUGGESTIONS

    response = {user_id: []}

    if user_id in SUGGESTIONS:
        response[user_id] = SUGGESTIONS[user_id]

    return response

