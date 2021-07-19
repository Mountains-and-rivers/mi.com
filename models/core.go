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
}
//dsn := "root:123456@tcp(localhost:3306)/testdb?charset=utf8mb4&parseTime=True&loc=Local"