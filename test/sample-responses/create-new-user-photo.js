module.exports = function(req, res) {
  const userId = req.query.userId;
  return {
    'status': 'OK',
    'message': `Nice one! Photo created successfully for user: ${userId}!`
  };
};
