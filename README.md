## Server APIs ##
__GET: /api/events/event_list__  
Parameters:
* page: int (optional)

Returns an array of JSON objects:  
* id: int
* event_name: string
* org_name: string
* start_date: Date()
* end_date: Date()
* venue: string
* description: string
* status: boolean

Description:
* Returns first 10 event results sorted by date from current date.
* Returns next 10 events depending on *page*.
* Returns error message when *page* is out of range.

__POST: /api/events/add_event__  
Parameters:
* event_name: string
* org_name: string
* start_date: Date()
* end_date: Date()
* venue: string
* description: string

Returns the added event as a JSON object:  
* id: int
* event_name: string
* org_name: string
* start_date: Date()
* end_date: Date()
* venue: string
* description: string

Description:
* Adds an event into the database and returns the event ID
  
Useful Git Commands
-------------------
__Deploying to Heroku from C9__  
git add -A .  
git commit -a -m "Comments here"  
git push  
git push heroku-target master  
  
__Linking Cloud9 with Git__  
http://support.cloud9ide.com/entries/21468947-Deploy-your-app-to-Heroku-using-the-Cloud9-console  