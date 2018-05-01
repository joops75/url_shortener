# URL Shortener Microservice
An app which converts a url to a shorter version, which then may be used to access the original. It is a modified version of the code at https://coligo.io/create-url-shortener-with-node-express-mongo/.

After the user enters a url, the mongoDB database is checked to see if there is a record of it. If so, it returns the shortened version of this recorded url by converting its database index number (of base 10) to a number of base 36 and appending it to the app's homepage url. If it is not present in the database, it uses the valid-url package to check if the entered url is valid. If so, it assigns an index number to the url, stores it the database and displays the shortened url.

When a short url is clicked or entered into the address bar, the app decodes it's appended base 36 number to an index number of base 10, which is then used to search the database for the corresponding entry. If such a record exists, the user is redirected to the web address of the stored original url associated with this index. Otherwise they are redirected to the app's homepage.

The user may use either the input box on the webpage or the address bar to create a short url. If the input box is used, the output is displayed in html. If the address bar is used, it is displayed in json. If there is an error creating a short url due to an invalid url being entered, the html response will contain an error message, whereas the json response will contain a blank string.

Technologies used in this project:
* node
* express
* mongoDB
* mongoose
* html
* css

Addtional packages of note:
* valid-url
