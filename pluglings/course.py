import json
from datetime import datetime

# taget = '2021-09-06'

filterList = ['name', 'position', 'sections', 'teacher', ]

def countWeek(tg_ts):
    # tg_ts = datetime.strptime(target, '%Y-%m-%d').timestamp()
    try:
        no_ts = datetime.strptime(test, '%Y-%m-%d').timestamp()
    except:
        no_ts = datetime.now().timestamp()
    co_ts = int(no_ts) - int(tg_ts)

    week = int(co_ts / 60 / 60 / 24 / 7)
    if co_ts < 0:
        return None

    return week + 1

def getCourse():
    tt = json.load(open('class.json', 'rb'))['data']
    courses = tt['courses']
    today = []
    tg_ts=int(tt['setting']['startSemester'])/1000
    for course in courses:
        cweek = countWeek(tg_ts)
        day = datetime.today().weekday() + 1
        if not str(cweek) in course['weeks'].split(','):
            continue
        if day == course['day']:
            tmp = {}
            for k in course.keys():
                if k in filterList:
                    tmp[k] = course[k]
            if tmp['sections'] in ['1,2', '3,4']:
                tmp['tm'] = 0
            elif tmp['sections'] in ['5,6', '7,8']:
                tmp['tm'] = 1
            else:
                tmp['tm'] = 2
            today.append(tmp)

    return {'data':today}
    # print(courses)
if __name__ == '__main__':
    test = '2021-09-07'
    getCourse()