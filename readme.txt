commandshell : 
(maak een .env file)
git init
(en een .gitignore maken)
git add .
git commit "eerste git setup"
(ga naar github voor new rep en volg de instructies)
git (volgens de instructies van github)
git push -u origin master
(daarna is git push voldoende)
Dan heroku en gebruik steeds de derde regels van de handelingen omdat je al een git repo heb opgezet
Dan via setting in Heroku de env variabelen definieren
dan via MongoDb atlas een db opzetten en in de env variabelen van Heroku opzetten
In Heroku nog wel de connect met de Github repo maken
git push heroku master

Per route heb je een speciale folder in views met alle views voor die route
Partials folder zijn onderdelen die je include in andere files
De partials include je weer in de layouts file
Partial files begin je met een _ (underscore)

body-parser om makkelijk de inputelement van de server makkelijker te gebruiken
de urlencoded is om de fom data te lezen (waar bij de input name="de naam") de naam wordt gebruikt

multer package om multipart form te kunne verwerken en ook in de form tag aangegeven als enctyp="multipart/formdata"
multer maakt ook zelf de betreffende folder aan
? wordt niet meer gebruikt in de finale versie

Filepond om fileuploads makkelijk te maken
Dit gaat via een cdn 
Aanvullend de cdn voor fileencode als extra cdn (alleen de 1e)
Aanvullend imagepreview en image resize









