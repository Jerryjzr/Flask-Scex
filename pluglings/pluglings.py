adb='adb'
import os
import re
import json
import socket
import requests

ses=requests.session()
ses.headers={
    'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 Edg/92.0.902.84'
}

def s2d(request_str):
    ret = ""
    pattern = '^(.*?):(.*)$'
    for line in request_str.splitlines():
        ret += re.sub(pattern, '"\\1":"\\2",', line) + "\n"
    ret = "{" + ret.strip()[:-1] + "}"
    # print(ret)
    return json.loads(ret)

def adbCMD(cmd):
    a = os.popen(f"{adb} {cmd}").read()
    print(a)
    return a
def removeAll(txt, str1):
    while str1 in txt:
        txt = txt.replace(str1, "")
    return txt

def getbattery():
    # 设备电量获取
    resp = adbCMD("shell dumpsys battery")
    resp = removeAll(resp, " ")
    # print(resp)
    return s2d(resp)

def getIP():
    # ip获取
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    finally:
        s.close()

    return {'ip': ip}

def getLoginUrl():
    # 登录二维码
    response=ses.get('http://passport.bilibili.com/qrcode/getLoginUrl')
    data=json.loads(response.content)['data']
    return data

def getLoginInfo(oauthkey):
    # 登录状态
    response=ses.post('http://passport.bilibili.com/qrcode/getLoginInfo',data={'oauthKey':oauthkey})
    data=json.loads(response.content)
    isLogin=data["status"]
    num=data["data"]
    lgInfo={}
    if num==-4:
        lgInfo['statue']="等候扫描..."
    elif num==-5:
        lgInfo['statue']="等候确认..."
    elif isLogin:
        lgInfo['statue']="登录成功！"
    else:
        lgInfo['statue']="发生了错误！"
    lgInfo['islogin']=isLogin
    return lgInfo

def getBiliCard(mid):
    # 个人简介信息
    response=ses.get('http://api.bilibili.com/x/web-interface/card',params={'mid':mid})
    return json.loads(response.content)['data']

def getupstate(mid):
    # 播放量，浏览量等信息
    response=ses.get('https://api.bilibili.com/x/space/upstat',params={'mid':mid})
    print(response.content)
    return json.loads(response.content)['data']

def getDormitoryPower():
    # 宿舍电量情况
    electBillApi='http://xxxx.edu.cn/queryElecRoomInfo.html'
    data={
        'xxbh': 'synjones',
        'aid': '00000000000000',
        'account': 70000,
        'area': '{"area":"D区","areaname":""}',
        'building': '{"building":"0","buildingid":"0"}',
        'floor': '{"floor":"","floorid":"1"}',
        'room': '{"room":"","roomid":"000"}'
    }
    resp=requests.post(electBillApi,data)
    data=json.loads(resp.content)
    area,b=data['errmsg'].split(',')
    power,statue=b.split('-')
    return {'area':area,'power':power,'statue':statue}

def getCardMoney():
    # 一卡通情况
    data = {
        'xxbh': 'synjones',
        'idtype': 'acc',
        'id': 70454
    }

    response = requests.post(url='xxxx.edu.cn/getCardInfo.html', data=data)
    data=json.loads( response.content)['card'][0]
    current=data['db_balance']
    trans=data['unsettle_amount']
    return {'current':current,'trans':trans}



if __name__=="__main__":
    # 测试
    # print(getLoginUrl())
    # print(getLoginInfo('oauthkey'))
    # print(getBiliState(156785512))
    # print(getupstate(156785512))
    pass



