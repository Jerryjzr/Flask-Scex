import os
import time
def checkActivity():
    a = os.popen('adb shell dumpsys window windows')
    lines = a.readlines()
    for lines in lines:
        if "mCurrentFocus=Window" in lines:
            activity = lines.replace('mCurrentFocus=Window{60bfefb u0 ', '').split('/')[1].replace('}\n', '')
            print(activity)
            if activity == 'com.ionitech.airscreen.MainActivity' or activity=='com.ionitech.airscreen.widget.ThanksScreenActivity':
                os.system('adb shell am start webapp.scex/cn.woobx.webapp.WebAppMainActivity')

if __name__ == '__main__':
    while True:
        try:
            checkActivity()
        except:
            pass
        time.sleep(1)
    pass


