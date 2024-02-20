const { toDataURL } = require("qrcode");
const whatsapp = require("wa-multi-session");
const ValidationError = require("../../utils/error");
const {
  responseSuccessWithMessage,
  responseSuccessWithData,
} = require("../../utils/response");

exports.createSession = async (req, res, next) => {
  try {
    const scan = req.query.scan;
    const sessionName =
      req.body.session || req.query.session || req.headers.session;
    if (!sessionName) {
      throw new Error("Bad Request");
    }

    if (whatsapp.getSession(sessionName)) {
      return res.status(400).json({
        success: false,
        message: "Session Already",
      });
    }

    whatsapp.onQRUpdated(async (data) => {
      if (res && !res.headersSent) {
        const qr = await toDataURL(data.qr);
        if (scan && data.sessionId == sessionName) {
          res.render("scan", { qr: qr });
        } else {
          res.status(200).json(
            responseSuccessWithData({
              qr: qr,
            })
          );
        }
      }
    });
    await whatsapp.startSession(sessionName, { printQR: true });
  } catch (error) {
    next(error);
  }
};
exports.deleteSession = async (req, res, next) => {
  try {
    const sessionName =
      req.body.session || req.query.session || req.headers.session;
    if (!sessionName) {
      throw new ValidationError("session Required");
    }
    whatsapp.deleteSession(sessionName);
    res
      .status(200)
      .json(responseSuccessWithMessage("Success Deleted " + sessionName));
  } catch (error) {
    next(error);
  }
};
exports.sessions = async (req, res, next) => {
  try {
    const key = req.body.key || req.query.key || req.headers.key;

    // is KEY provided and secured
    if (process.env.KEY && process.env.KEY != key) {
      throw new ValidationError("Invalid Key");
    }

    res.status(200).json(responseSuccessWithData(whatsapp.getAllSession()));
  } catch (error) {
    next(error);
  }
};
exports.session = async (req, res, next) => {
  try {
    const key = req.body.key || req.query.key || req.headers.key;
    const sessionName =
      req.body.session || req.query.session || req.headers.session;

    // is KEY provided and secured
    if (process.env.KEY && process.env.KEY != key) {
      return res.status(400).json({
        success: false,
        message: "Invalid key",
      });
    }

    if (!sessionName) {
      return res.status(400).json({
        success: false,
        message: "Require session name",
      });
    }

    const checkSession = whatsapp.getSession(sessionName);

    if (!checkSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found!",
      });
    }

    return res.status(200).json({
      success: true,
      data: checkSession.user,
    });
  } catch (error) {
    next(error);
  }
};
