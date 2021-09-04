//展示所有组件id
var arr = $('.card')
var a = '['
for (var i = 0; i < arr.length; i++) {
    console.log(i, arr[i].id)
    a=a+'"'+arr[i].id+'"'+','
}
a=a+']'
console.log(a)