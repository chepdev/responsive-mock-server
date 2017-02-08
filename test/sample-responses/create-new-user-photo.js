module.exports = function(req, res) {
  const userId = req.param.userId;
  return {
    'status': 'OK',
    'message': `Nice one! Photo created successfully for user: ${userId}!`
  };
};
