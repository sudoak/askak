require("dotenv").config({ path: "variables.env" });

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

require("./config/db")(app);

const verifyWebhook = require("./service/verify-webhook");
const messageWebhook = require("./service/message-webhook");

const messageService = require("./service/message.service")();
const customService = require("./service/custom.service")();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/webhook", messageWebhook);
app.get("/webhook", verifyWebhook);

// app.listen(process.env.PORT, () =>
//   console.log("Express server is listening on port 5000")
// );
app.get("/messages", messageService.getAllMessages);
app.post("/messages", messageService.postMessage);
app.get("/messages/:id", messageService.getMessageById);
app.delete("/messages/:id", messageService.deleteMessageById);

app.get("*", customService.noMatchingUrl);

app.on("ready", function() {
  app.listen(process.env.PORT, () => console.log("webhook is listening"));
});

module.exports = app;
