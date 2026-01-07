# Functional Requirements: Youtube Playlist Generator

## Project Vision

This project aims to provide a resource for people to easily create a playlist of videos based on a list of topics. It should provide them with an easy to use interface that compiles the most relevant videos for each topic as well as provide utility to automatically shorten the total duration of the playlist by swapping out videos with shorter ones.

---

## Potential User Stories

**As a student**, I have a rubric with topics for my exam that I need to learn ASAP and I don't want to search for each video individually.  
**As a busy learner**, I like to see exactly how long I'll have to spend watching videos so I can fit learning into my schedule.  
**As a procrastinator**, I have a lot of topics I need to cover and not a lot of time to cover them, I want to learn with the best resources while also minimizing time spent watching.  
**As a returning user**, I want to go back to see the previous playlists I created for extra review.

---

## Intended User Expirence

**Main Usage**
* At the top of the site will be options to sign up, or log in, as well as view and edit previous playlists.
* User connects to the website and is given a blank text box with placeholder text showing how the text box should be used. 
* The User types in their list of topics and clicks a "Generate Playlist" Button
* The textbox becomes greyed out and it will display a loading icon
* Upon completion, under the textbox the videos will be displayed sequentially
  - Each video will display their title, thumbnail, duration, views, and likes vertically
  - At the top it will display the total length of the playlist with an option for a dropdown that displays the length at certain playback speeds and average video length
  - Next to that it will display an option to shorten the playlist which will then load and replace the current playlist with a shorter one
  - There will be a button for the user to click with the text "Save Playlist". If the user is logged in it will ask for a playlist title and then save it or else it will display the log in page. 

**Account Creation and sign in**
* If a user clicks the sign up option they will be prompted to enter an email, a username, a password, and complete a captcha. If the email is unique then it will create the account and log them in. When logged in they can acess their previous playlists and can change topics or request for them to be shorter. 
* If a user clicks log in they will just be asked to provide their email and password and a captcha and then log in. If they input an email or password incorrectly it will prompt them "Either the email or the password is incorrect". There will also be an option to click forget password. Logging in will display their username instead of the log in option and will also have a log out option, and they will be able to access previous playlists. 
* Not current priority but also add functionality for forgot password and google sign in

**Previous Playlists Page** 

* If a user is logged in they will be redirected here when they click view saved playlists otherwise they will be prompted to log in
* All the saved playlists a user made will be displayed with the title they used to save it and the thumbnail of the first video in the playlist, they will be displayed in order of creation. 
* A user may click the title of a playlist to restore it, in which it will display it in the main page with all the same videos and the topic list filled out in which a user can shorten it or replace topics. If they leave without clicking save again it will prompt them about unsaved changes, and a new option to delete a playlist will appear


## Constraints and possible issues
* Youtube API Quota
* User Authentication and Secruity 


