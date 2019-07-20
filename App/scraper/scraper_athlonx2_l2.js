var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../PartsDB.db');
var selector = ['#mw-content-text > div > table:nth-child(7)',
                '#mw-content-text > div > table:nth-child(10)',
                '#mw-content-text > div > table:nth-child(13)',
                '#mw-content-text > div > table:nth-child(20)',
                '#mw-content-text > div > table:nth-child(23)',
                '#mw-content-text > div > table:nth-child(26)',
                '#mw-content-text > div > table:nth-child(29)'


]
const fs = require('fs')
var cheerio = require('cheerio')
var cheerioTableparser = require('cheerio-tableparser');
db.serialize(function() {
    for(var i = 0; i < selector.length;++i){
        parseTable(db,selector[i])
    }
    
})

function parseTable(db, selector){
    var file = fs.readFileSync('athlonx2.html', {encoding: 'utf8'})
    var regex = /<br\s*\/?>/gi
    file = file.replace(regex, ' ')
    const $ = cheerio.load(file)
    cheerioTableparser($);
    var data = $(selector).parsetable(true, true, true);// table location on html
    var rowCount = data[0].length
    
    var stmt = db.prepare("INSERT OR IGNORE INTO CPU (architecture, processor_brand, processor_model, cores_threads, cpu_clock_normal, cpu_turbo_clock, igpu_clock, igpu_turbo_clock, l3_cache, tdp, release_date, socket, pcie_version, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    //stmt field names on the table + equal num of ?
    
    for(var i = 1; i < rowCount; ++i){ //change (i)accordingly to the table
        data[0][i] = data[0][i].replace("Athlon X2 ", "");
        data[0][i] = data[0][i].replace("Athlon II X2 ", "");
        if (data[0][i].match(/2\d\d/|/\d\d\d\w/) && data[0][i].length <= 4) {
            var memory = "2x DDR-1333"
            
         }
        else {
            memory = "unknown"
        }
        if (data[9][i] == ""){
            data[9][i] = "unknown"
        }
        data[8][i] = data[8][i].match(/AM\d|AM\d./)[0]
        var record = [
            "Brisbane(older)/Kuma",
            "Athlon X2", //Brand
            data[0][i], //Model
            "2 (2)", //Cores/Threads
            data[2][i], //Clock (normal)
            'N/A', //Turbo clock
            'N/A', //iGPU clock(normal)
            'N/A', //iGPU clock(turbo)
            'N/A', //L3 Cache
            data[7][i], //TDP
            data[9][i], //Release date
            data[8][i], //Socket
            "PCIe 2.0", //PCIe v
            memory //Memory

        ] 
        
        stmt.run(...record)
        
    }
    
    stmt.finalize(); 
}
 
db.close() 

