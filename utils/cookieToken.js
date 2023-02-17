const cookieToken = (user, res) => {
  // from models we get jwt token
  // get user as parrameter
    const token = user.getJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
      ),
     // httpOnly: true,
    };
  // we sending in json also for mobile  
    user.password = undefined;
    res.status(200).cookie("token", token, options).json({
      success: true,
      token,
      user,
    });
  };
  
  module.exports = cookieToken;
  