var fs = require('fs');

try {  
    
        var data = fs.readFileSync('NASDAQ.txt', 'utf8');
    // console.log(data.toString()); 
       
} catch(e) {
    console.log('Error:', e.stack);
}
// module.exports= ready

//https://stackoverflow.com/questions/36120265/how-to-convert-text-file-to-json-in-javascript
var cells = data.split('\n').map(function (el) { return el.replace(/\r/,'').split(/\t/) });
var headings = cells.shift();
var out = cells.map(function (el) {
  var obj = {};
  for (var i = 0, l = el.length; i < l; i++) {
    obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
  }
  return obj;
});


var json = JSON.stringify(out);
console.log(json)
// console.log(JSON.stringify(out, null, 2));

