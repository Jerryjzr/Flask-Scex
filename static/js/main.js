const UserConfig = {
    name: '',
    location: '',
    deadlines: [
        {
            name: '上网课',
            target: "2021-9-6"
        },
        {
            name: '开学',
            target: "2021-9-18"
        }
    ],
    bilimid: 0
}

WIDGET = {
    "CONFIG": {
        "layout": "1",
        "width": "380",
        "height": "170",
        "background": "5",
        "dataColor": "FFFFFF",
        "borderRadius": "20",
        "city": UserConfig.location,
        "key": "f301684a0f0d4713ab5c05041b767f5d"
    }
}

function getleft(target) {
    var date = Date.parse(new Date(target))
    var now = Date.now()
    left = Math.round((date - now) / 1000 / 60 / 60 / 24)
    return left
}


const clockWidget = new Vue({
    el: "#clock-widget",
    data: {
        date: '',
        time: '',
        hello: "",
        name: UserConfig.name
    },
    mounted() {
        this.getdate();
        this.gettime();
        this.timer = setInterval(() => {
            this.getdate();
            this.gettime();
        }, 2000)
    },
    methods: {
        getdate: function () {
            let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            let time = new Date();
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let day = time.getDate();
            let week = weeks[time.getDay()];
            this.date = year + '/' + month + '/' + day + " " + week;
            hour = time.getHours()
            console.log(hour)
            if (hour < 6) {
                hello = "凌晨了";
            }
            else if (hour < 9) {
                hello = "早上好";
            }
            else if (hour < 12) {
                hello = "上午好";
            }
            else if (hour < 17) {
                hello = "下午好";
            }
            else if (hour < 22) {
                hello = "晚上好";
            }
            else {
                hello = "晚安";
            }
            this.hello = hello;

        },
        gettime: function () {
            let time = new Date();
            let hour = time.getHours();
            let minutes = time.getMinutes();
            if (minutes < 10) {
                minutes = '0' + minutes
            }
            if (hour < 10) {
                hour = '0' + hour
            }
            this.time = hour + ":" + minutes
        }

    }

})


const phoneWidget = new Vue({
    el: "#phone-widget",
    data: {
        PhoneInfo: {
            totalmem: 0,
            freemem: 0,
            ischarging: '',
            level: 0,
        },
        cd: {
            name: '上网课',
            left: 0,
            target: "2021-9-6"
        },
        todo: "假期中，暂无课程",
        ip: "127.0.0.1",
        deadline: '倒计时\n'

    },
    mounted() {
        this.updateip();
        this.updatebattery();
        this.updatecd();
        this.timer = setInterval(() => {
            this.updatebattery();
            this.updatecd();
        }, 2000)
    },
    methods: {
        updateip() {
            $.get({
                url: "/getip",
                success: function (data) {
                    console.log(data)
                    phoneWidget.ip = data.ip
                }
            })
        },
        updatebattery() {
            $.get({
                url: "/getbattery",
                success: function (data) {
                    console.log(data.USBpowered)
                    if (data.USBpowered == 'true') {
                        data.ischarging = '⚡'
                        console.log('cging')
                    }
                    phoneWidget.PhoneInfo = data
                }
            })
        },
        updatecd() {
            title = '倒计时\n\t'
            for (var i = 0; i < UserConfig.deadlines.length; i++) {
                var member = UserConfig.deadlines[i]
                var left = getleft(member.target)
                // console.log(i, deadlines[i])
                title = `${title} 距离 ${member.name} 还有 ${left} 天\n\t`
            }
            console.log(title)
            this.deadline = title
        }
    }
})

// phoneWidget.$mount("#phone-widget")
const yiyanWidget = new Vue({
    el: "#yiyan-widget",
    data: {
        content: ""
    },
    mounted() {
        this.getyiyan()
    },
    methods: {
        getyiyan() {
            $.get({
                url: "https://v1.hitokoto.cn",
                dataType: "jsonp", //指定服务器返回的数据类型
                success: function (data) {
                    result = $.parseJSON(data)
                    console.log(result.hitokoto)
                    yiyanWidget.content = result.hitokoto
                }

            })
        },
    }
})

const todoWidget = new Vue({
    el: '#todo-widget',
    data: {
        content: "假期中，暂无课程",
        courses:[],
        co:0
    },
    mounted() {
        this.updatecourse()
        this.timer = setInterval(() => {
            this.updatecourse
        }, 1000 * 60 * 60)
        this.timer2 = setInterval(() => {
            this.updatecontent()
        }, 3000)
    },
    methods: {
        updatecourse: function () {
            $.get({
                url: "/getcourse",
                success: function (data) {
                    todoWidget.courses=data.data
                }
            })
        },
        updatecontent:function(){
            course_count=this.courses.length
            if(course_count==0){
                this.content='今日暂无课程'
            }
            else{
                course=this.courses[this.co]
                let date=new Date();
                // if (date.getHours()<12){
                    this.content=`第 ${course.sections}节在${course.position}上${course.name}`
                // }
            }
            if(course_count-1>this.co){
                this.co+=1
            }else{
                this.co=0
            }
        }
    }
})

const mybiliWidget = new Vue({
    el: '#mybili-widget',
    data: {
        card: {},
        upstate: {}
    },
    mounted() {
        $.get({
            url: "/getbilistate",
            data: { mid: UserConfig.bilimid },
            success: function (resdata) {
                mybiliWidget.card = resdata
            }
        })

        $.get({
            url: "/getupstate",
            data: { mid: UserConfig.bilimid },
            success: function (resdata) {
                if (!resdata.hasOwnProperty('article')) {
                    alert("未登录无法获取详细播放数据，将前往登录页面")
                    window.location = 'biliLogin.html'
                }
                mybiliWidget.upstate = resdata
            }
        })

        this.timer = setInterval(() => {
            $.get({
                url: "/getbilistate",
                data: { mid: UserConfig.bilimid },
                success: function (resdata) {
                    mybiliWidget.card = resdata
                }
            })

            $.get({
                url: "/getupstate",
                data: { mid: UserConfig.bilimid },
                success: function (resdata) {
                    mybiliWidget.upstate = resdata
                }
            })

        }, 60000)
    }
})

const schoolWidget = new Vue({
    el: '#school-widget',
    data: {
        dormitory: {
            area: '未知地区',
            power: 0
        },
        money: {
            current: 0,
            trans: 0
        }
    },
    mounted() {
        this.update()
        this.timer = setInterval(() => {
            this.update()
        }, 1000 * 60 * 60)
    },
    methods: {
        update: function () {
            $.get({
                url: "/getDormitoryPower",
                success: function (resdata) {
                    schoolWidget.dormitory = resdata
                }
            })

            $.get({
                url: "/getCardMoney",
                success: function (resdata) {
                    schoolWidget.money = resdata
                }
            })
        }
    }
})