const users = require('../models/users');

const authController = async (req, res, next) => {
  try {
    const id = req.body.user;
    const user = await users.findById(id, {
      role: 1
    });

    if (!user || user.role === 'client') {
      throw new Error('No access');
    }

    next();
  } catch (error) {
    res.status(401);
    res.end();
  }
};

module.exports = authController;
