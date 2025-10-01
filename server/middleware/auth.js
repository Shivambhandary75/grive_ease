module.exports = (req, res, next) => {
    console.log("Auth middleware triggered");
    // In real apps, decode token here
    req.user = { id: "demoUserId" };
    next();
};
