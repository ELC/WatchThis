#!/usr/bin/env python
# coding: utf-8

# # Imports

# In[1]:


import json
from time import perf_counter

from firebase import firebase
import pandas as pd
import numpy as np

print("Libraries Imported")


# # Read Data

# In[2]:


try:
    fb_app = firebase.FirebaseApplication('https://watchthis-a7537-default-rtdb.firebaseio.com', None)
    result = fb_app.get('/ratings', None)

    with open("database_backup.json", "w") as db_file:
        json.dump(result, db_file)
    
    print("Database Successfully Read and Backed Up")
    print(f"Database Contains {len(result)} entries")
    
except:
    print("Database could not be read, using last backup")
    
    with open("database_backup.json", "w") as db_file:
        result = json.load(db_file)
        
    print(f"Backup Read - Contains {len(result)} entries")


# # Format Data

# In[3]:


ratings = []
for rating in result.values():
    row = (rating["userId"], rating["movieId"], rating["rating"], rating["timestamp"])
    ratings.append(row)

ratings_df = pd.DataFrame(columns=["userId", "movieId", "rating", "timestamp"], data=ratings)
ratings_df["rating"] = ratings_df["rating"].replace(-1, -7).replace(1, 7)

print("Data Formated - Unique Elements:")
print(ratings_df[["userId", "movieId"]].nunique())


# # User and Movie Mappings

# In[4]:


movie_mappings = (ratings_df['movieId']
                      .drop_duplicates()
                      .sort_values()
                      .reset_index(drop=True)
                      .reset_index()
                      .set_index("movieId")["index"]
                      .to_dict()
                 )

user_mappings = (ratings_df['userId']
                      .drop_duplicates()
                      .sort_values()
                      .reset_index(drop=True)
                      .reset_index()
                      .set_index("userId")["index"]
                      .to_dict()
                )

user_mappings_reverse = {value:key for key, value in user_mappings.items()}
movie_mappings_reverse = {value:key for key, value in movie_mappings.items()}

with open("movie_mappings.json", "w") as movie_file:
    json.dump(movie_mappings, movie_file)

with open("user_mappings.json", "w") as user_file:
    json.dump(user_mappings, user_file)

print("User and Movie Mappings Created and Saved")


# # Preparing Data

# In[5]:


# Apply Mappings
ratings_df["movieId"] = ratings_df["movieId"].replace(movie_mappings)
ratings_df["userId"] = ratings_df["userId"].replace(user_mappings)

# Change Type for efficiency
ratings_df["movieId"] = ratings_df["movieId"].astype("uint16")
ratings_df["userId"] = ratings_df["userId"].astype("uint16")
ratings_df["rating"] = ratings_df["rating"].astype("int8")

# Save Dataset
ratings_df.to_csv("watch_this_dataset.csv", index=False)

print("Data Ready and Saved")


# # Pivot Matrix

# In[6]:


ratings_sparse = ratings_df.pivot(index='userId', columns='movieId', values='rating')
ratings_sparse


# In[7]:


print(ratings_df.info(memory_usage="deep"))


# In[8]:


def stochastic_gradient_descent_l2(X_, alpha=0.01, lambda_=0.14, num_epochs=50, mini_batch_size=1, r=None, seed=42):
    
    # Pandas DataFrame to NumPy
    X = X_.to_numpy()

    if r is None:
        r = X.shape[1]
    
    np.random.seed(seed)
    
    # Initialize p and q
    variance = 0.1    
    p = np.random.normal(0, variance, (X.shape[0], r))
    q = np.random.normal(0, variance, (X.shape[1], r))
    
    train_rmses = []
    
    # Iterate only over non-nan indexes
    non_nan_indexes = list(zip(*np.where(~np.isnan(X))))
    
    if mini_batch_size == 0:
        mini_batch_size = len(non_nan_indexes) - 1
    
    for _ in range(num_epochs):
        
        # Stochastic part
        np.random.shuffle(non_nan_indexes)
        
        # Save p and q
        p_new = p.copy()
        q_new = q.copy()
        
        for index, (u, i) in enumerate(non_nan_indexes):
            
            # Update p and q every mini_batch_size iterations
            if index % mini_batch_size == 0:
                p = p_new.copy()
                q = q_new.copy()
            
            # Update p and q new with L2 regularization derivatives
            error = X[u][i] - np.dot(p[u], q[i]) 
            
            p_new[u] += alpha * (error * q[i] - lambda_ * (2 * p[u])) / mini_batch_size
            q_new[i] += alpha * (error * p[u] - lambda_ * (2 * q[i])) / mini_batch_size
        
        # Calculate RSME
        rmse = np.sqrt(np.nanmean((X - p @ q.T) ** 2))
        train_rmses.append(rmse)
        
    return p, q, train_rmses


# In[9]:


def calc_rmse(train, test, p, q):
    errors = []
    
    X_approx = p @ q.T
    
    for _, (user_, movie_, rating) in test[["userId", "movieId", "rating"]].iterrows():
        user_index = np.argmax(train.index == user_)
        movie_index = np.argmax(train.columns == movie_)
        error = rating - X_approx[user_index, movie_index]
        errors.append(error)

    errors = np.array(errors)
    return np.sqrt(np.mean(errors ** 2))


# # Training on Data

# In[10]:


print("Fitting the Model")

start_time = perf_counter()
p, q, rmse_train = stochastic_gradient_descent_l2(ratings_sparse)
elapsed_time = perf_counter() - start_time

print(f"Model Fit successfully - RMSE on Data: {rmse_train[-1]:.2f} - Fitting Time: {elapsed_time:.2f}s")

with open("p_vector.json", "w") as p_file:
    json.dump(p.tolist(), p_file)

with open("q_vector.json", "w") as q_file:
    json.dump(q.tolist(), q_file)

print("Parameters Saved")


# # Predictions

# In[11]:


X_approx = p @ q.T
predictions = pd.DataFrame(X_approx)

predictions_replaced = predictions.rename(user_mappings_reverse).rename(movie_mappings_reverse, axis=1)
predictions_replaced


# # Recommendations

# In[12]:


print("Computing Best Recommendations for Every User")
start_time = perf_counter()

recommendations = {}

for user, movies in predictions_replaced.iterrows():
    watched_movies = set(ratings_df[ratings_df["userId"] == user]["movieId"])
    
    predicted_recommendations = np.argsort(movies)[::-1]
    
    user_recommendations = predicted_recommendations[~predicted_recommendations.isin(watched_movies)]
    
    recommendations[user] = list(user_recommendations[:10].replace(movie_mappings_reverse))

elapsed_time = perf_counter() - start_time
print(f"Recommendations Computed - Computation Time: {elapsed_time:.3f}s")


# In[14]:


with open("recommendations.json", "w") as recommendations_file:
    json.dump(recommendations, recommendations_file)

print("Recommendations Saved")

recommendations


# # Suggestions

# In[15]:


print("Computing Suggestion to Rate for Every User")
start_time = perf_counter()

suggestions = {}

for user, movies in predictions_replaced.iterrows():
    watched_movies = set(ratings_df[ratings_df["userId"] == user]["movieId"])
    
    predicted_suggestions = np.argsort(np.abs(movies))
    
    user_suggestions = predicted_suggestions[~predicted_suggestions.isin(watched_movies)]
    
    suggestions[user] = list(user_suggestions[:10].replace(movie_mappings_reverse))

elapsed_time = perf_counter() - start_time
print(f"Suggestions Computed - Computation Time: {elapsed_time:.3f}s")


# In[16]:


with open("suggestions.json", "w") as suggestions_file:
    json.dump(suggestions, suggestions_file)

print("Suggestions Saved")

suggestions


# In[ ]:




