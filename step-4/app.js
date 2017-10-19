// import bar from './bar';
import Vue from 'vue'
import AV from 'leancloud-storage'

var APP_ID = '8pQIXmAs1v4vMJSflUoplmi5-gzGzoHsz';
var APP_KEY = '0qShYbHHsO2xGPmANvtf3cRn';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});




var app = new Vue({
    el: '#app',
    data: {
          newTodo: '',
          todoList: [],
          actionType: 'signUp',
          formData:{
              username:'',
              password:'',
          },
          currentUser: null,
    },
    created: function(){
        console.log(12)
        window.onbeforeunload = ()=>{
        let dataString = JSON.stringify(this.todoList)
        window.localStorage.setItem('myTodos', dataString)
        let dataString2 = JSON.stringify(this.newTodo)
        window.localStorage.setItem('mynewTodos', dataString2)
       }

        let oldDataString = window.localStorage.getItem('myTodos')
        let oldData = JSON.parse(oldDataString)
        this.todoList = oldData || []
        let oldDataString2 = window.localStorage.getItem('mynewTodos')
        let oldData2 = JSON.parse(oldDataString2)
        this.newTodo = oldData2 || []
        this.currentUser = this.getCurrentUser();
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    },
    methods: {
        addTodo: function () {
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                done: false,// 添加一个 done 属性
            });
            this.newTodo = ''  // 变成空
        },
        removeTodo: function (todo) {
            let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是 ES 5 新加的 API
            this.todoList.splice(index, 1) // 不懂 splice？赶紧看 MDN 文档！
        },
        signUp: function () {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, function (error) {
                alert('注册失败')
            });
        },
        login: function () {
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, function (error) {
                alert('登录失败')
            });
        },
        getCurrentUser: function () { // 👈
            let current=AV.User.current()
            debugger
            console.log(12)
            if(current){
                let {id, createdAt, attributes: {username}} =current
                return {id, username, createdAt}
            }else{
                return null
            }

        },
        logout: function () {
                  AV.User.logOut()
                 this.currentUser = null
                 window.location.reload()
        }
    }
  })

