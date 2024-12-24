const { validateToken } = require("../services/auth");

function checkAuthCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
      // No cookie, proceed to the next middleware
      //res.redirect("/login");
      return next();
    }

    try {
      // Validate the token and attach user payload to the request
      const userPayload = validateToken(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {
      console.error("Token validation error:", error);
      // Clear invalid cookie (optional)
      res.clearCookie(cookieName);
    }

    // Proceed to the next middleware or route handler
    next();
  };
}

module.exports = { checkAuthCookie };
