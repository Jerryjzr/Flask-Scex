const resdata = {
    "code": 0,
    "message": "0",
    "ttl": 1,
    "data": {
        "card": {
            "mid": "2",
            "name": "未登录",
            "sex": "保密",
            "rank": "0",
            "face": "http://i1.hdslb.com/bfs/face/3e60b20604b6fdc7d081eb6a1ec72aa47c5a3964.jpg",
            "fans": 0,
            "friend": 0,
            "attention": 0,
            "sign": "个性签名",
            "level_info": {
                "current_level": 6,
                "current_min": 0,
                "current_exp": 0,
                "next_exp": 0
            },
            "nameplate": {
                "nid": 10,
                "name": "见习偶像",
                "image": "http://i0.hdslb.com/bfs/face/e93dd9edfa7b9e18bf46fd8d71862327a2350923.png",
                "image_small": "http://i1.hdslb.com/bfs/face/275b468b043ec246737ab8580a2075bee0b1263b.png",
                "level": "普通勋章",
                "condition": "所有自制视频总播放数\u003e=10万"
            },
            "Official": {
                "role": 2,
                "title": "认证信息",
                "type": 0
            },
            "vip": {
                "vipType": 2,
                "vipStatus": 1,
            }
        },
        "space": {
            "s_img": "http://i2.hdslb.com/bfs/space/768cc4fd97618cf589d23c2711a1d1a729f42235.png",
            "l_img": "http://i2.hdslb.com/bfs/space/cb1c3ef50e22b6096fde67febe863494caefebad.png"
        },
        "archive_count": 0,
        "follower": 0
    }
}
detail = {
    "code": 0,
    "message": "0",
    "ttl": 1,
    "data": {
    "archive": {
    "view": 17040
    },
    "article": {
    "view": 2
    },
    "likes": 339
    }
    }
viewdata = resdata.data;

const appdata = {
    saying: "",
    hello: "",
    name: "SwetyCore",
    myinfo: viewdata,
    upstate: detail.data
}


const clockWidget = new Vue({
    el: "#clock-widget",
    data: {
        date: '',
        time: '',
        hello: "",
        name: "SwetyCore"
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
            level: 0,
        },
        cd: {
            name: '上网课',
            left: 0,
            target: "2021-9-6"
        },
        todo: "假期中，暂无课程",
        ip: "127.0.0.1"

    },
    mounted() {
        this.updateip();
        this.updatebattery();
        this.updatecd();
        this.timer = setInterval(() => {
            this.updatebattery();
            this.updatecd();
        }, 60000)
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
                    console.log(data)
                    phoneWidget.PhoneInfo = data
                }
            })
        },
        updatecd() {
            var date = Date.parse(new Date(this.cd.target))
            var now = Date.now()
            left = Math.round((date - now) / 1000 / 60 / 60 / 24)
            this.cd.left = left
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
        content: "假期中，暂无课程"
    },
    mounted() {

    },
    methods: {

    }
})

const mybiliWidget = new Vue({
    el: '#mybili-widget',
    data: {
        card:resdata.data,
        upstate:detail.data
    },
    mounted() {
        $.get({
            url: "/getbilistate",
            data: { mid: 156785512 },
            success: function (resdata) {
                mybiliWidget.card = resdata
            }
        })

        $.get({
            url: "/getupstate",
            data: { mid: 156785512 },
            success: function (resdata) {
                if (!resdata.hasOwnProperty('article')){
                    alert("未登录无法获取详细播放数据，将前往登录页面")
                    window.location='biliLogin.html'
                }
                mybiliWidget.upstate = resdata
            }
        })

        this.timer = setInterval(() => {
            $.get({
                url: "/getbilistate",
                data: { mid: 156785512 },
                success: function (resdata) {
                    mybiliWidget.card = resdata
                }
            })

            $.get({
                url: "/getupstate",
                data: { mid: 156785512 },
                success: function (resdata) {
                    mybiliWidget.upstate = resdata
                }
            })

        }, 60000)
    }
})
const myhome = new Vue({
    data() {
        return appdata
    },
    mounted() {
    },
    methods: {


        getbiliinfo() {
            $.get({
                url: "/getbiliinfo",
                data: { mid: 156785512 },
                // myinfo: viewdata,
                // upstate:detail.data
                success: function (resdata) {
                    myhome.myinfo = resdata.data;
                }
            })
        },
        getbilistate() {
            $.get({
                url: "/getbilistate",
                data: { mid: 156785512 },
                // myinfo: viewdata,
                // upstate:detail.data
                success: function (resdata) {
                    myhome.upstate = resdata.data;
                }
            })
        }

    }
})

// myhome.$mount("#app")
