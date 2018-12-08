# Assignment 1 - API testing and Source Control.

Name: YUE XU    20082476

## Overview.

The theme of this project is movie, users can vote and comment on movies they like here. Three different modes in this project are linked through their properties, and some operations change two data sets simultaneously.Ordinary users and system users have different operation rights.

Github:https://github.com/JoeXu1997/AgileTest

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


## Data storage.
Database with mlab: var mongodbUri ='mongodb://joe:a123456@ds149593.mlab.com:49593/dbtest' 

## Sample Test execution.

        $ npm test

       > movie@0.0.0 test /Users/xuyue/WebApplicationDevelop/Movie
       > mocha test/routes/user-test.js --timeout 10000

          User API
            GET functions
               GET /usr
                  GET /usr 200 312.820 ms - 1080
                     ✓ should return all the user with an array if the operator is an admin (339ms)
                  GET /usr 200 147.752 ms - 57
                     ✓ should return wrong message if operator is not an admin (154ms)
              GET /usr/myself
                  GET /usr/myself 200 152.638 ms - 442
                          ✓ should return only one user  (157ms)
                  GET /usr/myself 200 143.999 ms - 4
                          ✓ should return null if username doesnot exist  (147ms)
              /usr/upvote/:upvotefor
                  GET /usr/upvote/Inception 200 147.498 ms - 536
                          ✓ should return one user who upvote for specific movie (152ms)
                  GET /usr/upvote/asd 200 141.630 ms - 2
                          ✓ should return empty array if the voted-movie doesnot exist  (145ms)
              /usr/comment/:commentfor
                  GET /usr/comment/Inception 200 151.503 ms - 536
                          ✓ should return users who comment on a specific movie (156ms)
                  GET /usr/upvote/asd 200 146.775 ms - 2
                          ✓ should return empty array if the commented-movie doesnot exist  (150ms)
            POST functions
               POST /usr
                  POST /usr 200 245.274 ms - 264
                          ✓ should return success message and update database(add a new user) (249ms)
                  GET /usr 200 300.014 ms - 948
            PUT functions
               PUT /usr/pw
                  PUT /usr/pw 200 155.782 ms - 237
                          ✓ should return success message and user password should be different with before (161ms)
                  PUT /usr/pw 200 152.211 ms - 42
                          ✓ should failed message if the operator doesnot exist (160ms)
               PUT /usr/vote
                  PUT /usr/vote 200 379.874 ms - 268
                          ✓ should return success message and user should voted for one movie after this (387ms)
                  PUT /usr/vote 200 147.006 ms - 53
                          ✓ should return failed message if the user had already vote for other movies (153ms)
            DELETE /usr/:id
                 DELETE /usr/5bdf26eb29abe2144d0ce30b 200 302.044 ms - 289
                          ✓ should return a message and delete a user record (307ms)

            14 passing (11s)


           $ npm test

          > movie@0.0.0 test /Users/xuyue/WebApplicationDevelop/Movie
          > mocha test/routes/movie-test.js --timeout 10000

          Movie API
             GET functions
                GET /movies
                   GET /movies 200 164.316 ms - 490
                      ✓ should return all the movies in an array ordered by upvotes (185ms)
                GET /movies/actor/:mainActor
                   GET /movies/actor/Xing 200 142.581 ms - 490
                      ✓ should return movies which has someone as actor  (147ms)
                  GET /movies/actor/Audaarey 200 142.102 ms - 2
                      ✓ should return empty array if there is no matching result (147ms)
                GET /movies/director/:Directedby
                   GET /movies/director/Zhen 200 142.576 ms - 490
                      ✓ should return movies which has someone as director (146ms)
                   GET /movies/director/Liuaaaa 200 141.851 ms - 2
                      ✓ should return empty array if there is no matching result (144ms)
                GET /movies/:movietype
                   GET /movies/Comedy 200 148.072 ms - 490
                      ✓ should return movies according to types  (151ms)
                   GET /usr/upvote/asd 200 142.064 ms - 2
                      ✓ should return empty array if no matching results  (145ms)
            POST functions
                POST /addmoviestest 200 159.579 ms - 167
                    ✓ should return success message and update database(add a new movie) (163ms)
                GET /movies 200 154.186 ms - 458
            PUT functions
                PUT /movies/5bdf28cb07ec1f145d3a94a8 200 448.891 ms - 195
                    ✓ should return success message and add 1 to movie upvotes (601ms)
                PUT /movies/5bdf28cc07ec1f145d3a94ab 200 141.218 ms - 53
                    ✓ should failed message if the operator already vote for other movies (289ms)
            DELETE /movies/:id
                DELETE /movies/5bdf28cd07ec1f145d3a94ae 200 300.687 ms - 31
                    ✓ should return success message and delete one movie (548ms)
                DELETE /movies/5bdf28ce07ec1f145d3a94b1 200 143.188 ms - 43
                    ✓ should failed message if the operator not an admin (391ms)


                12 passing (10s)

            $ npm test
            > movie@0.0.0 test /Users/xuyue/WebApplicationDevelop/Movie
            > mocha test/routes/comment-test.js --timeout 10000

            Comments API
               GET functions
                 GET /comment
                    GET /comment 200 161.479 ms - 451
                      ✓ should return all the comments in an array (185ms)
                GET /comment/one/:id
                    GET /comment/one/5bdf29ffcbfcfd1466fc570e 200 155.161 ms - 183
                      ✓ should return one comment with specific id (166ms)
                GET /comment/movie/:commentfor
                    GET /comment/movie/Inception 200 155.240 ms - 451
                      ✓ should return specific movie's all comments  (160ms)
                GET /comment/:username
                    GET /comment/xu 200 157.589 ms - 451
                      ✓ should return specific user's all comments  (161ms)
              POST /comment
                POST /comment 200 177.057 ms - 189
                    ✓ should return confirmation message and update database(add a new comment) (181ms)
              PUT /comment/:id
                PUT /comment/5bdf2a04cbfcfd1466fc571f 200 329.880 ms - 186
                    ✓ should return a comment and the comment content should be different with before (337ms)
              DELETE /comment/:id
                  DELETE /comment/5bdf2a05cbfcfd1466fc5723 200 147.949 ms - 179
                     ✓ should return a message and delete a donation record (154ms)

               7 passing (16s)

## Extra features

## Something I have to explain
In comment test I need to validate the data in other models' collections as well as in comment collection at the same time, and some data would be deleted afer the API operations so that the isolation principle would not be broken.So when I do PUT, DELETE and POST test in comment-test.js, I used describe.only() to test these three blocks separately。