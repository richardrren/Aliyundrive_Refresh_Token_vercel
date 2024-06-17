const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

const client_id = '123456789'; // 阿里云盘开发者应用ID
const client_secret = '123456789'; // 阿里云盘开发者应用密钥

app.disable('x-powered-by');

function isSSL(req) {
  return req.secure || req.headers['x-forwarded-proto'] === 'https' || req.connection.encrypted;
}

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle authorization redirect
app.get('/authorize', (req, res) => {
  const protocol = isSSL(req) ? 'https://' : 'http://';
  const redirect_uri = encodeURIComponent(`${protocol}${req.headers.host}/callback`);

  // Redirect to Aliyun Pan authorization page
  const auth_url = `https://openapi.alipan.com/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:base,file:all:read,file:all:write&state=&response_type=code`;

  res.redirect(auth_url);
});

// Handle OAuth callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Missing code parameter');
  }

  const api_url = 'https://openapi.alipan.com/oauth/access_token';
  const grant_type = 'authorization_code';

  const post_data = {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: grant_type,
    code: code,
    redirect_uri: `https://${req.headers.host}/callback` // Ensure to include redirect_uri in the token request
  };

  try {
    const response = await axios.post(api_url, post_data, {
      headers: {
        'Content-type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      }
    });

    const data = response.data;
    const refresh_token = data.refresh_token;

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <title>Get Aliyundrive Refresh Token</title>
          <link rel="shortcut icon" href="//www.520yxl.cn/favicon.ico">
          <link href="//unpkg.com/layui@2.8.6/dist/css/layui.css" rel="stylesheet">
          <link href="//lib.baomitu.com/twitter-bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet"/>
          <script src="//lib.baomitu.com/jquery/1.12.4/jquery.min.js"></script>
          <script src="//lib.baomitu.com/twitter-bootstrap/3.4.1/js/bootstrap.min.js"></script>
          <script src="//lib.baomitu.com/layer/3.5.1/layer.js"></script>
          <!--[if lt IE 9]>
            <script src="//lib.baomitu.com/html5shiv/3.7.3/html5shiv.min.js"></script>
            <script src="//lib.baomitu.com/respond.js/1.4.2/respond.min.js"></script>
          <![endif]-->
      </head>
      <body>
      <div class="container">
      <div class="col-xs-12 col-sm-10 col-md-8 col-lg-6 center-block" style="float: none;">
      <div class="panel panel-primary">
          <div class="panel-heading" style="text-align: center;"><h3 class="panel-title">
              Get Aliyundrive Refresh Token
          </div>
          <div class="panel-body" style="text-align: center;">
              <div class="list-group">
                  <ul class="nav nav-tabs"></ul>
                  <div class="list-group-item"><img src="https://img.alicdn.com/imgextra/i3/O1CN01qcJZEf1VXF0KBzyNb_!!6000000002662-2-tps-384-92.png"></div>
                  <div id="load" class="alert alert-info" style="font-weight:bold;display:none;"></div>
                  <div id="login" class="list-group-item">
                      <div class="form-group qqlogin">
                          <div class="input-group"><div class="input-group-addon">刷新令牌</div>
                          <input type="text" id="uin" value="${refresh_token}" class="form-control" onkeydown="if(event.keyCode==13){submit.click()}"/>
                      </div></div>
                      </div>
                      <a href="/authorize"><button type="button" id="submit" class="btn btn-primary btn-block">点击跳转阿里云盘授权登陆</button></a>
                  </div>
              </div>
          </div>
      </div>
      </div>
      </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching the refresh token.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
