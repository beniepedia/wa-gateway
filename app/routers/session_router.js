const { Router } = require("express");
const {
  createSession,
  deleteSession,
  sessions,
  session,
} = require("../controllers/session_controller");

const SessionRouter = Router();

SessionRouter.all("/start-session", createSession);
SessionRouter.all("/delete-session", deleteSession);
SessionRouter.all("/sessions", sessions);
SessionRouter.all("/session", session);

module.exports = SessionRouter;
