module.exports = function(req, res) {
  const userId = req.params.userId;
  return {
    'status': 'OK',
    'message': `Nice one! Photo created successfully for user: ${userId}!`
  };
};
