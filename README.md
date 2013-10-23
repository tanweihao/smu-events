## Server APIs ##
__GET: /api/events/event_list__  
Parameters:
* page: int (optional)
* org_id: int (optional)

Returns JSON array:  
* id: int
* event_name: string
* org_name: string
* org_id: int
* start_date: Date()
* end_date: Date()
* venue: string
* description: string
* status: boolean

Description:
* Returns first 10 event results sorted by date from current date.
* Returns next 10 events depending on *page*.
* Returns error message when *page* is out of range.
* Returns events specific to event organizer when organizer ID is specified

__POST: /api/events/add_event__  
Parameters:
* event_name: string
* org_name: string
* org_id: int
* start_date: Date()
* end_date: Date()
* venue: string
* description: string

Returns JSON object:  
* id: int

Description:
* Adds an event into the database and returns the event ID

__POST: /api/users/add_user__  
Parameters:
* username: string
* password: string

Returns JSON object:  
* id: int

Description:
* Adds a new user into the database and returns the user ID

__POST: /api/login__  
Parameters:
* username: string
* password: string

Returns JSON object:  
* id: int

Description:
* Checks if there is valid user in the database, returns -1 if invalid
* Checks if password is valid, returns -1 if invalid
* Returns the user ID if both username and password is valid
  
Project Setup and Administration
-------------------
__Deploying to Heroku from C9__  
git add -A .  
git commit -a -m "Comments here"  
git push  
git push heroku-target master  
  
__Installing socket.io__  
http://www.gianlucaguarini.com/blog/nodejs-and-a-simple-push-notification-server/  
  
__Linking Cloud9 with Git__  
http://support.cloud9ide.com/entries/21468947-Deploy-your-app-to-Heroku-using-the-Cloud9-console  