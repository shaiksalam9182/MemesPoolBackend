const fs  = require('fs');

exports.getImage = (req,res) =>{
    var file = req.params.name;
    var img = fs.readFileSync('/home/shaiksalam9182/uploads/'+file);
    res.writeHead(200,{'Content-type':'image/png'});
    res.end(img,'binary');
}