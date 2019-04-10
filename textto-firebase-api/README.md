# TextTo Firebase API

Built with Firestore, Functions, and Storage out of the box

Since every project will need to replicate users in a `Users` collection, this comes with those hooks built-in along with.

## Deployment 

`firebase deploy` - requires CLI (`npm i -g firebase-tools`)

NOTE: You must deploy from within `/functions`

## Additional

Uses the `firestore-rest` package, which is a requirement so long as the Firestore gRPC issue is broken:

https://github.com/samcorcos/firestore-rest

## TODO

Update twilio webhook to deployed call forwarding
Call 14159157866 via skype
(will probably fail)
check logs to see what values came in
see if we can get the phone number from the body
if so, get phone number from DB using rest db api
then use the forwarding number from that user to forward that call instead of hard-coded value