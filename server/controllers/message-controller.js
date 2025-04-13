const Message = require('../models/message-model');

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message, senderModel, receiverModel } = req.body;

    if (!senderId || !receiverId || !message || !senderModel || !receiverModel) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['Client', 'Counselor'].includes(senderModel) || !['Client', 'Counselor'].includes(receiverModel)) {
      return res.status(400).json({ message: 'Invalid sender or receiver model' });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      senderModel,
      receiverModel,
    });
    await newMessage.save();
    res.status(201).json({ newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message', error });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    if (!userId1 || !userId2) {
      return res.status(400).json({ message: 'User IDs are required' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this message' });
    }

    await Message.deleteOne({ _id: messageId });
    req.io.to(message.receiverId).emit('messageDeleted', { messageId });
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { sendMessage, getMessages, deleteMessage };