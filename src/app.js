const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next){
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error:"Repository Id not found"})
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (request, response) => {
  
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes:0
  }

  repositories.push(repository)

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  
  const {id} = request.params;

  const {title, url, techs} = request.body;

  const repository = {
    title,
    url,
    techs
  }

  const index = repositories.indexOf(repositories.find(repository =>  repository.id === id))
  

  Object.assign(repositories[index], repository)

  return response.json(repositories[index])

});

app.delete("/repositories/:id", (request, response) => {
  
  const {id} = request.params;

  const index = repositories.indexOf(repositories.find(repository =>  repository.id === id))

  repositories.splice(index,1)

  return response.sendStatus(204)


});

app.post("/repositories/:id/like", (request, response) => {
  
  const {id} = request.params

  const repository = repositories.find(repository => repository.id === id)

  repository.likes++;

  response.json(repository);
});

module.exports = app;
