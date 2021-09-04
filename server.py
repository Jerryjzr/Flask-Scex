#!/bin/python3

from flask import Flask,Response,redirect,request
from pluglings.pluglings import *
from pluglings.course import getCourse
# from coursetest import getCourse
app=Flask(__name__)

def responseJson(content):
    return Response(json.dumps(content), mimetype='application/json')

@app.get('/')
def gohome():

    return redirect('http://localhost:5000/static/index.html',code=301)


@app.get("/getip")
def rgetip():

    return responseJson(getIP())

@app.get('/getbattery')
def rgetbattery():
    return responseJson(getbattery())

@app.get('/getLoginUrl')
def rgetLoginUrl():
    return responseJson(getLoginUrl())

@app.get('/getLoginInfo')
def rgetLoginInfo():
    key=request.args.get("oauthkey")
    return responseJson(getLoginInfo(key))

@app.get('/getbilistate')
def rgetbilistate():
    key=request.args.get("mid")
    return responseJson(getBiliCard(key))

@app.get('/getupstate')
def rgetupstate():
    key=request.args.get('mid')
    return responseJson(getupstate(key))

@app.get('/getDormitoryPower')
def rgetDormitoryPower():
    return responseJson(getDormitoryPower())

@app.get('/getCardMoney')
def rgetCardMoney():
    return responseJson(getCardMoney())

@app.get('/getcourse')
def rgetCourse():
    return responseJson(getCourse())

if __name__=='__main__':
    app.run(host="0.0.0.0")