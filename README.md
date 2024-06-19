# Aliyundrive_Refresh_Token_vercel
使用vercel部署阿里云盘开发者api获取Refresh Token   
本项目由ChatGPT修改自[Aliyundrive_Refresh_Token_php](https://github.com/520yxl/Aliyundrive_Refresh_Token_php)   

  
## 使用方法  
fork项目，填写app.js中第8行的 `client_id` 和第9行的 `client_secret` ，然后直接使用 [vercel](https://vercel.com/new) 一键部署即可  
  
开发者后台中的 **授权回调URI** 可以填写vercel自带域名也可以填写自己的自定义域名  
  
如果没有域名，可以到[cloudns](https://cloudns.org/)免费申请一个cloudns.be然后cname到 `cname-china.vercel-dns.com`  
由于cname质量层次不齐所以也可以自己挑任意一个vercel的ip，比如直接添加A记录`76.76.21.22`
  
## 如何用到alist  
刷新令牌：填 Refresh Token  
Oauth令牌链接：`https://域名`  
客户端ID：开发者后台的 APP ID  
客户端密钥：开发者后台的 App Secret
