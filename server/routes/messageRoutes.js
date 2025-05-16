const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// All routes require authentication (teacher or student)
router.use(auth, (req, res, next) => {
  if (!['Teacher', 'Student'].includes(req.user.type)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
});

router.get('/contacts', messageController.getContacts);
router.post('/send', messageController.upload, messageController.sendMessage);
router.get('/:contactId', messageController.getConversation);

module.exports = router;