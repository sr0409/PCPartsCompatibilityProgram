const fs = require('fs')
const cheerio = require('cheerio')
const file = fs.readFileSync('file.html', {encoding: 'utf8'})
const $ = cheerio.load(file)
var table = $('#mw-content-text > div > table:nth-child(26)')
var rows = $('tr', table)
var data = []

rows.each(function(tableidx, row) {
    var cols = $('th, td', row)

    cols.each(function(colidx, col){
        var rowspan = Number($(col).attr('rowspan') || 1)
        var colspan = Number($(col).attr('colspan') || 1)
        var colData = $(col).html()
        for(var a = 0; a < rowspan; ++a){
            if(data.length < (tableidx + a + 1)){
                data.push([])
            }
            for(var b = 0; b < colspan; ++b){
                data[tableidx + a][colidx + b] = colData
            }
            console.log(cols.length)
        }
        
    });
});
