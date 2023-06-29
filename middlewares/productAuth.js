const jwt = require('jsonwebtoken');
require('dotenv').config
const { client } = require('../db/redis');


const productAdminAuth = async (req, res, next) => {
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
     reRefreshToken(req,res,next);
    }
  }
  else {
    res.status(400).send({
      isError: true,
      error: "Unauthorised. Provide email ."
    })
  }
}

const reRefreshToken = async (req, res, next) => {
  let { email } = req.headers;
  let refreshTok = await client.get(`${email}refresh`);
  if (refreshTok) {
    let blackTok = await client.get(`${email}blackrefresh`);
    if (blackTok === refreshTok) {
      res.status(400).send({
        isError: true,
        error: "Please Login First"
      })
    }
    else {
      try {
        let refreshData = jwt.verify(refreshTok, process.env.refreshToken);
        let accessTok = jwt.sign({
          email: refreshData.email, isAdmin: refreshData.isAdmin,id:refreshData.id
        }, process.env.accessToken, { expiresIn: '60s' });
        await client.setEx(`${email}access`, 60 , accessTok);
        next();
      } catch (error) {
        res.status(400).send({
          isError: true,
          error
        })
      }
    }
  }
  else {
    res.status(400).send({
      isError: true,
      error: " Please Login Again"
    })
  }
}

module.exports = { productAdminAuth , reRefreshToken}