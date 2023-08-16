const { Router } = require("express");
const {
  sendMessage,
  sendBulkMessage,
  sendMedia,
} = require("../controllers/message_controller");
const MessageRouter = Router();

MessageRouter.all("/send-message", sendMessage);
MessageRouter.all("/send-media", sendMedia);
MessageRouter.all("/send-bulk-message", sendBulkMessage);

module.exports = MessageRouter;
