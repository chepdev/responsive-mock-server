module.exports = function(req, res) {
  return {
    'status': 'OK',
    'count': 3,
    'users': [
      {
        'userId': 1,
        'name': 'Andrew McElroy',
        'email': 'andrew@responsive.co.za',
        'etc': 'etc..'
      },
      {
        'userId': 2,
        'name': 'Marsh Middleton',
        'email': 'marsh@responsive.co.za',
        'etc': 'etc..'
      },
      {
        'userId': 3,
        'name': 'Wayne Butler',
        'email': 'wayne@responsive.co.za',
        'etc': 'etc..'
      }
    ]
  };
};
