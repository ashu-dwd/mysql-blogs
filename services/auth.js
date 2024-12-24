const JWT = require("jsonwebtoken");

const secret = "Ashu234@34";

function createTokenForUser(user) {
  const payload = {
    id: user.user_id,
    email: user.email,
    name: user.full_name,
  };
  const token = JWT.sign(payload, secret);
  //console.log(payload)
  return token;
}
function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  createTokenForUser,
  validateToken, 
};
