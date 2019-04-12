# TextTo

Allows people to send and receive SMS as email.

This app uses Twilio and SendGrid to make it happen.

There are two main pieces of functionality for this app. The first allows someone who has signed up for the service (Person A) to send an email to a given person (Person B), which is then converted into a text message. This is accomplished using SendGrid's [Inbound Parse](https://sendgrid.com/docs/for-developers/parsing-email/setting-up-the-inbound-parse-webhook/) webhook.

```
Customer sends email => Parsed by SendGrid => Data stored in database => Sent to recipient via Twilio
```

The next piece of functionality is when the person who received the SMS (Person B) responds to the SMS, the message is managed by Twilio's [webhooks](https://www.twilio.com/docs/chat/webhook-events), which forward the message along to the customer's (Person A) email account. These messages are threaded by person and interaction.

When a customer signs up for an account, they select a phone number from which they will send and receive SMS. They then decide whether they want that number to forward calls to their existing number.

```
Receive SMS => Parsed by Twilio => Hit webhook => Send email to customer
```

## TODO

- [ ] set up subscription with stripe
- [ ] allow people to unsubscribe
- [ ] keep track of messages sent and time since subscription