const messageService = require("./message.service")();
const { isDate } = require("lodash");
const fetch = require("node-fetch");
const config = require("config");

// You can find your project ID in your Dialogflow agent settings
const projectId = "askak-olnxkt"; //https://dialogflow.com/docs/agents#settings
const sessionId = "123456";
const languageCode = "en-US";

const dialogflow = require("dialogflow");

const dialogConfig = {
  credentials: {
    private_key: config.get("DIALOGFLOW_PRIVATE_KEY"), //process.env.DIALOGFLOW_PRIVATE_KEY,
    client_email: config.get("DIALOGFLOW_CLIENT_EMAIL") //process.env.DIALOGFLOW_CLIENT_EMAIL
  }
};

const sessionClient = new dialogflow.SessionsClient(dialogConfig);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.
const FACEBOOK_ACCESS_TOKEN = config.get("FACEBOOK_ACCESS_TOKEN"); //process.env;

const sendTextMessage = (userId, text) => {
  return fetch(
    `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`,
    {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        messaging_type: "RESPONSE",
        recipient: {
          id: userId
        },
        message: {
          text
        }
      })
    }
  );
};

module.exports = event => {
  const userId = event.sender.id;
  const message = event.message.text;
  messageService.createMessage({
    userId,
    message
  });
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode
      }
    }
  };

  sessionClient
    .detectIntent(request)
    .then(async responses => {
      const result = responses[0].queryResult;
      if (result.action === "input.calc") {
        const days = await messageService.getDayRemaining(userId);

        return sendTextMessage(
          userId,
          `There are ${days} days left until your birthday`
        );
      }
      return sendTextMessage(userId, result.fulfillmentText);
    })
    .catch(err => {
      console.error("ERROR:", err);
    });
};
