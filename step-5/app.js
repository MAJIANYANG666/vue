import bar from './bar';
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
        window.onbeforeunload = ()=>{
        // let dataString = JSON.stringify(this.todoList)
        // window.localStorage.setItem('myTodos', dataString)
        let dataString2 = JSON.stringify(this.newTodo)
        window.localStorage.setItem('mynewTodos', dataString2)
       }

        // let oldDataString = window.localStorage.getItem('myTodos')
        // let oldData = JSON.parse(oldDataString)
        // this.todoList = oldData || []
        let oldDataString2 = window.localStorage.getItem('mynewTodos')
        let oldData2 = JSON.parse(oldDataString2)
        this.newTodo = oldData2 || []
        this.currentUser = this.getCurrentUser();
        this.fetchTodos() // 将原来的一坨代码取一个名字叫做 fetchTodos
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
        fetchTodos: function(){
                  if(this.currentUser){
                        var query = new AV.Query('AllTodos');
                        query.find()
                          .then((todos) => {
                                let avAllTodos = todos[0] // 因为理论上 AllTodos 只有一个，所以我们取结果的第一项
                                    let id = avAllTodos.id
                                this.todoList = JSON.parse(avAllTodos.attributes.content) // 为什么有个 attributes？因为我从控制台看到的
                                this.todoList.id = id // 为什么给 todoList 这个数组设置 id？因为数组也是对象啊
                                  }, function(error){
                                console.error(error)
                              })
                      }
                },
        updateTodos: function(){
                  // 想要知道如何更新对象，先看文档 https://leancloud.cn/docs/leanstorage_guide-js.html#更新对象
                      let dataString = JSON.stringify(this.todoList) // JSON 在序列化这个有 id 的数组的时候，会得出怎样的结果？
                      let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
                      avTodos.set('content', dataString)
                      avTodos.save().then(()=>{
                            console.log('更新成功')
                          })
                    },
        saveTodos: function(){
                  let dataString = JSON.stringify(this.todoList)
                  var AVTodos = AV.Object.extend('AllTodos');
                  var avTodos = new AVTodos();
                  var acl = new AV.ACL()
                  acl.setReadAccess(AV.User.current(),true) // 只有这个 user 能读
                  acl.setWriteAccess(AV.User.current(),true) // 只有这个 user 能写

                  avTodos.set('content', dataString);
                  avTodos.setACL(acl) // 设置访问控制
                  avTodos.save().then((todo) =>{
                        this.todoList.id = todo.id  // 一定要记得把 id 挂到 this.todoList 上，否则下次就不会调用 updateTodos 了
                      console.log('保存成功');
                      }, function (error) {
                        alert('保存失败');
                      });
                },
                saveOrUpdateTodos: function(){
                  if(this.todoList.id){
                        this.updateTodos()
                      }else{
                        this.saveTodos()
                      }
                },
        addTodo: function () {
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                done: false,// 添加一个 done 属性
            });
            this.newTodo = ''  // 变成空
            this.saveOrUpdateTodos()
        },
        removeTodo: function (todo) {
            let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是 ES 5 新加的 API
            this.todoList.splice(index, 1) // 不懂 splice？赶紧看 MDN 文档！
            this.saveOrUpdateTodos()
        },
        signUp: function () {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, function (error) {
                // alert('注册失败')
                alert(error)
            });
        },
        login: function () {
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
                this.fetchTodos() // 登录成功后读取 todos
            }, function (error) {
                // alert('登录失败')
                alert(error)
            });
        },
        getCurrentUser: function () { // 👈
            let current=AV.User.current()
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

