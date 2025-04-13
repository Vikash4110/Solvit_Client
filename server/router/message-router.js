const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, deleteMessage } = require('../controllers/message-controller');
const counselorMiddleware = require('../middlewares/counselor-middleware');
const clientMiddleware = require('../middlewares/client-middleware');

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, Token not provided" });
    }
    counselorMiddleware.authMiddleware(req, res, () => {
      if (req.user) {
        req.role = "counselor";
        return next();
      }
      clientMiddleware.authMiddleware(req, res, () => {
        if (req.user) {
          req.role = "client";
          return next();
        }
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
      });
    });
  };

router.post('/send-message', sendMessage);
router.get('/messages/:userId1/:userId2', getMessages);
router.delete('/delete-message/:messageId', deleteMessage);

module.exports = router;