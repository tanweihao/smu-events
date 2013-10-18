Server APIs
-----------
<table>
    <tr>
        <th>Path</th>
        <th>Type</th>
        <th>Parameters</th>
        <th>JSON Structure</th>
        <th>Result Key</th>
        <th>Result Value</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>/api/event_list</td>
        <td>GET</td>
        <td>[page (int)]</td>
        <td>Array of JSON objects</td>
        <td>
            eid<br>
            eName<br>
            oName<br>
            sDate<br>
            eDate<br>
            venue<br>
            description<br>
            status<br>
        </td>
        <td>
            int<br>
            string<br>
            string<br>
            Date()<br>
            Date()<br>
            string<br>
            string<br>
            boolean<br>
        </td>
        <td>
            <ul>
                <li>Returns first 10 event results sorted by date from current date.</li>
                <li>Returns next 10 events depending on <i>page</i>.</li>
                <li>Returns error message when <i>page</i> is out of range.</li>
            </ul>
        </td>
    </tr>
</table>
  
Useful Git Commands
-------------------
__Deploying to Heroku from C9__  
git add -A .  
git commit -a -m "Comments here"  
git push  
git push heroku-target master  
  
__Linking Cloud9 with Git__  
http://support.cloud9ide.com/entries/21468947-Deploy-your-app-to-Heroku-using-the-Cloud9-console  