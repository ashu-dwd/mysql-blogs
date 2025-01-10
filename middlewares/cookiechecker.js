const handlingLimitedAccessToUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.render('login', {
            error: 'Please Login First to access blog writing.',
        });
    }
    next();
}

module.exports = handlingLimitedAccessToUser;