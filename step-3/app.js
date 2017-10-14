import bar from './bar';
import Vue from 'vue'
var app = new Vue({
    el: '#app',
    data: {
          newTodo: '',
          todoList: []
    },
    created: function(){
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

        addTodo: function(){
                  this.todoList.push({
                            title: this.newTodo,
                            createdAt: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                            done: false,// 添加一个 done 属性

                  })
            this.newTodo = ''  // 变成空
          },
          // 加了👇这个函数
          removeTodo: function(todo){
                  let index = this.todoList.indexOf(todo) // Array.prototype.indexOf 是 ES 5 新加的 API
                  this.todoList.splice(index,1) // 不懂 splice？赶紧看 MDN 文档！
          }
        }
  })

