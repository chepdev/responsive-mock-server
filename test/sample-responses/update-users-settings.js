module.exports = function(req, res) {
  const userId = req.query.userId;
  return {
    'status': 'OK',
    'message': `Nice one! Settings successfully updated for user: ${userId}!`
  };
};
