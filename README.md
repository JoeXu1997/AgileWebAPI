# Assignment 2 - Web API - Automated development process.

Name: YUE XU

## Overview.

The theme of this project is movie, users can vote and comment on movies they like here. Three different modes in this project are linked through their properties, and some operations change two data sets simultaneously.Ordinary users and system users have different operation rights.

github: https://github.com/JoeXu1997/AgileWebAPI

## API endpoints.
 Routes for movies:
1.Get  /movies                              Return all movies in database

2.Get  /movies/:movietype           Return a specific type of movie

3.Get  /movies/actor/:mainActor     Return movies have a specific actor(fuzzy search)

4.Get  /movies/director/:Directedby     Return movies have a specific director

5.Post  /movies                 Add a new movie record

6.Put   /movies/:id           Change movie’s upvote

7.Delete  /movies/:id         Remove one movie 

Routes for users:
1.Get  /usr           Return all users(only for admin)

2.Get  /usr/myself          Return current user’s info

3.Get  /usr/upvote/:upvotefor       Return users who upvote for one movie

4.Get  /usr/upvote/:commentfor      Return users who comment on one movie

5.Post  /usr            Add one user

6.Put  /usr/pw            Change one user’s password

7.Put  /usr/vote          Change vote object for one user, and also change the upvote value in relevant movie object

8.Delete  /usr/:id          Remove one user 

Routes for comment:
1.Get  /comment/one/:id       Return one comment

2.Get  /comment         Return all comments

3.Get  /comment/movie/:commentfor     Return comments for specific movie

4.Get  /comment/:username       Return one user’s all comments

5.Put  /comment/:id         Change comment’s content and also change items in relevant user object’s comment attribute

6.Post  /comment          Add one comment and also add items in relevant usr object’s comment attribute

7.Delete /comment/:id         Remove one comment
 


## Continuous Integration and Test results.

. . . URL of the Travis build page for web API, e.g.

https://travis-ci.org/JoeXu1997/AgileWebAPI


. . . URL of published test coverage results on Coveralls, e.g.  

https://coveralls.io/github/JoeXu1997/AgileWebAPI


## Extra features.

