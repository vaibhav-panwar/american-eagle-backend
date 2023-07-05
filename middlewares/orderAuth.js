const { reRefreshToken } = require('./productAuth');
const {client} = require('../db/redis');

const orderAdminAuth = async (req, res, next) => {
    let { email } = req.headers;
    if (email) {
        let accesstoken = await client.get(`${email}access`);
        if (accesstoken) {
            let blackAccessToken = await client.get(`${email}blackaccess`);
            if (accesstoken == blackAccessToken) {
                res.status(400).send({
                    isError: true,
                    error: "Session Expired . Please login again"
                })
            }
            else {
                try {
                    let user = jwt.verify(accesstoken, process.env.accessToken);
                    if (user.isAdmin) {
                        next();
                    }
                    else {
                        res.status(400).send({
                            isError: true,
                            error: "Not Authorised"
                        })
                    }
                } catch (error) {
                    res.status(400).send({
                        isError: true,
                        error
                    })
                }
            }
        }
        else {
            reRefreshToken(req, res, next);
        }
    }
    else {
        res.status(400).send({
            isError: true,
            error: "Unauthorised. Provide email ."
        })
    }
}

const orderUserAuth = async (req, res, next) => {
    let { email } = req.headers;
    if (email) {
        let accesstoken = await client.get(`${email}access`);
        if (accesstoken) {
            let blackAccessToken = await client.get(`${email}blackaccess`);
            if (accesstoken == blackAccessToken) {
                res.status(400).send({
                    isError: true,
                    error: "Session Expired . Please login again"
                })
            }
            else {
                try {
                    let user = jwt.verify(accesstoken, process.env.accessToken);
                    if (!user.isAdmin) {
                        req.body.userID = user.id;
                        next();
                    }
                    else {
                        res.status(400).send({
                            isError: true,
                            error: "Not Authorised"
                        })
                    }
                } catch (error) {
                    res.status(400).send({
                        isError: true,
                        error
                    })
                }
            }
        }
        else {
            reRefreshToken(req, res, next);
        }
    }
    else {
        res.status(400).send({
            isError: true,
            error: "Unauthorised. Provide email ."
        })
    }
}

module.exports = {orderAdminAuth,orderUserAuth}