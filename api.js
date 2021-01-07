let movies = [];
let top_movies = fetch('top_movies.json')
                    .then(response => response.json())
                    .then(data => top_movies = data['data']);

function getMovie() {
    return top_movies[Math.floor(Math.random() * top_movies.length)];
}
