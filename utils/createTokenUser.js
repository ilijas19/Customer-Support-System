const createTokenUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    role: user.role,
    userId: user._id,
  };
};

module.exports = createTokenUser;
