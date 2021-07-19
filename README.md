# 环境配置

 - win10
 - Go 1.16.3
 - BeeGo 1.12
 - Mysql 8.0
 - Redis

## 1:生成数据表
在MySql数据库中创建名为`micom`的数据,接着运行sql文件
数据导入成功后,需要修改项目中的数据库连接代码
修改models文件夹中的core.go

```go
package models
import (
	"github.com/astaxie/beego"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

var DB *gorm.DB
var err error

func init() {
	DB,err = gorm.Open("mysql", "root:MyNewPass4!@tcp(192.168.31.240:3306)/micom?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		beego.Error(err)
	}
}func init() {
	DB,err = gorm.Open("mysql", "root:MyNewPass4!@tcp(192.168.31.240:3306)/micom?charset=utf8&parseTime=True&loc=Local")
      //DB,err = gorm.Open("mysql", "用户名:数据库密码@/数据库名称?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		beego.Error(err)
	}
}
```

## 2:安装第三方包

```
go mod tidy
```



## 3:运行项目
准备工作完成后,就可以运行项目啦
你可以选择运行main.go文件,也可以在终端输入`bee run`,运行此项目
最后打开 http://127.0.0.1:8080/ 即可 默认用户:1007643852@qq.com 密码:123456
后台地址 http://127.0.0.1:8080/admin 管理员账号:admin 密码:123456

## 4:oss云存储
我自己部署的项目是将图片放在oss云存储里面的,在app.conf文件中,`ossStatus = true`
但是,在GitHub上面的代码,`ossStatus = false`,也就是默认关闭了这个功能
项目中的图片能够正常显示,是因为我把云存储上面的图片都下载下来放在了项目中

如果你想使用oss云存储功能,需要先在阿里云开通此服务,并将static中的文件全部上传
之所以需要在阿里云开通服务,是因为项目中使用的是阿里云的SDK
开通并上传文件后,在后台中的其他配置中,将所需的参数填入即可
![][8]

最后,在app.conf文件中将`ossStatus`改为`true`

## 5:发送邮件,完善注册功能
想要发送邮件,必须给你自己的邮箱开头STMP服务
之后,在controller/mindex/login.go文件中第143行代码进行修改
![][9]

接着,在浏览代码中你会看见这样的代码
也就是需要将项目部署上线并有域名才能实现这个功能

```go
verifyUrl := "部署上线的域名地址/pass/verifyUrl?verify="+models.Md5(passwd+"micom")+"&email="+email
// 示例代码
verifyUrl := "http://mi.sunyj.xyz/pass/verifyUrl?verify="+models.Md5(passwd+"micom")+"&email="+email
```

## 6:部署上线

### 1:将本地数据库文件复制到服务器的数据中

这里我使用的是Navicat Premium15这个软件进行操作

 1. 首先将本地数据库中的数据加结构转储为SQL文件
![][50]
 2. 使用Navicat连接服务器的数据库
 3. 连接成功后,运行刚才转储的SQL文件
    需要注意的是,SQL文件中的字符集和排序规则**一定**要和服务器数据的类型一样,不然会导入数据失败
    如果类型不一样,先查看服务器中的类型是什么,接着用notepad++或者其他工具打开刚才的SQL文件,进行批量替换就行了
    ![][51]

### 2:打包BeeGO项目
在打包之前,我们需要更改一些项目连接数据库的参数
在腾讯云服务器中,包含数据库文件的数据库为micom,用户为micom,密码为124212,跟本地数据库的信息不同,所以需要在core.go文件中进行修改
```go
func init() {
	DB,err = gorm.Open("mysql", "root:MyNewPass4!@tcp(192.168.31.240:3306)/micom?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		beego.Error(err)
	}
}
```

在GoLand中,打开终端,输入 **bee pack -be GOOS=linux**,即可将BeeGo项目打包成Linux平台可运行的程序
![][52]

### 3:运行项目
```
go run main.go
```



### 4:DNS解析
如果我们想用域名进行访问网站,需要进行域名解析,和Nginx配置
域名解析就不用多解释了,经常玩服务器的同学应该很老练

关于Nginx,我用到了宝塔面板,在面板进行了配置
在/www/server/panel/vhost/nginx 这个目录下,新建了一个配置文件 **micom.conf**
将IP地址指向了刚刚解析的域名,这样我们就可以通过域名进行访问
![][53]
```conf
server {
    listen       80;
    server_name  mi.sunyj.xyz;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
	#设置主机头和客户端真实地址，以便服务器获取客户端真实 IP
	proxy_set_header Host $host;
	proxy_set_header X-Real-IP $remote_addr;
	proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	#禁用缓存
	proxy_buffering off;
        
	proxy_pass http://42.***.**.**:****/;
    }
    location /socket.io {        
		# 此处改为 socket.io 后端的 ip 和端口即可
		proxy_pass http://127.0.0.1:3001;

		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
		proxy_http_version 1.1;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $host;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
 
}
```

[8]: https://syjun.vip/usr/uploads/2021/02/3947349086.png
[9]: https://syjun.vip/usr/uploads/2021/02/1067360970.png
[50]: https://syjun.vip/usr/uploads/2021/02/3637480777.jpg
[51]: https://syjun.vip/usr/uploads/2021/02/3498415197.jpg
[52]: https://syjun.vip/usr/uploads/2021/02/2534936114.jpg
[53]: https://syjun.vip/usr/uploads/2021/02/3150842554.jpg