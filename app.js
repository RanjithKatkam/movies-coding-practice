const express = require("express");

const app = express();

const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server has Started at localhost:3000");
    });
  } catch (e) {
    console.log(`DB ERROR ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();
module.exports = app.express();

// Get Movies API
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT movie_name
    FROM Movie
    `;
  const dbResponse = await db.all(getMoviesQuery);
  response.send(dbResponse);
});

//Post Movie API
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
    INSERT INTO
    movie (director_id, movie_name, lead_actor)
    VALUES (
        ${directorId},
        '${movieName}',
        '${leadActor}'
    )`;
  await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

// GET Movie API
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT movie_name
    FROM movie
    WHERE movie_id = ${movieId}`;
  const dbResponse = await db.get(getMovieQuery);
  response.send(dbResponse);
});

//Update Movie API
app.put("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const updateDetails = request.body;
  const { directorId, movieName, leadActor } = updateDetails;
  const updateDetailsQuery = `
    UPDATE
    movie 
    SET 
    director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    WHERE movie_id = ${movieId}`;
  await db.run(updateDetailsQuery);
  response.send("Movie Details Updated");
});

//Delete Movie API
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE 
    FROM movie
    WHERE movie_id = ${movieId}`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

// Get Director API
app.get("/directors/", async (request, response) => {
  const getDirectorQuery = `
    SELECT *
    FROM director`;
  const dbResponse = await db.all(getDirectorQuery);
  response.send(dbResponse);
});

// Get Movies by Director API
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMoviesQuery = `
    SELECT movie_name
    FROM movie
    WHERE director_id = ${directorId}`;
  const dbResponse = await db.all(getMoviesQuery);
  response.send(dbResponse);
});
