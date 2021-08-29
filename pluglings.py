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
    resp = adbCMD("shell dumpsys battery")
    resp = removeAll(resp, " ")
    # print(resp)
    return s2d(resp)

def getIP():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    finally:
        s.close()

    return {'ip': ip}

def getLoginUrl():
    response=ses.get('http://passport.bilibili.com/qrcode/getLoginUrl')
    data=json.loads(response.content)['data']
    return data

def getLoginInfo(oauthkey):
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
    response=ses.get('http://api.bilibili.com/x/web-interface/card',params={'mid':mid})
    return json.loads(response.content)['data']

def getupstate(mid):
    response=ses.get('https://api.bilibili.com/x/space/upstat',params={'mid':mid})
    print(response.content)
    return json.loads(response.content)['data']

if __name__=="__main__":
    # 测试
    # print(getLoginUrl())
    # print(getLoginInfo('oauthkey'))
    # print(getBiliState(156785512))
    # print(getupstate(156785512))
    pass



