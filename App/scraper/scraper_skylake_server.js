var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../PartsDB.db');
 
const fs = require('fs')
var cheerio = require('cheerio')
var cheerioTableparser = require('cheerio-tableparser');
db.serialize(function() {
    parseTable(db)
    
})

function parseTable(db){
    var file = fs.readFileSync('skylake.html', {encoding: 'utf8'})
    var regex = /<br\s*\/?>/gi
    file = file.replace(regex, ' ')
    regex = /Up to dual channel /gi
    file = file.replace(regex, '2x ')
    regex = /Up to triple channel /gi
    file = file.replace(regex, '3x ')
    regex = /Up to quad channel /gi
    file = file.replace(regex, '4x ')
    regex = /\[\d+\]/gi
    file = file.replace(regex, '')
    regex = /\[a\]|\[b\]/gi
    file = file.replace(regex, '')
    regex = /with/gi
    file = file.replace(regex, ' ')
    regex = /..or /gi
    file = file.replace(regex, ', ')
    regex = /Up to /gi
    file = file.replace(regex, '')
    regex = /\w\w\w\d-\d\d\d\d/gi
    var memoryFormat = file.match(regex)
    
    file = file.replace(regex, memoryFormat[0] +",")
    regex = /  /gi
    file = file.replace(regex, ' ')

    const $ = cheerio.load(file)
    cheerioTableparser($);
    
    var data = $("#mw-content-text > div > table:nth-child(61)").parsetable(true, true, true);// table location on html
    
    var rowCount = data[0].length
    var stmt = db.prepare("INSERT INTO CPU (architecture, processor_brand, processor_model, cores_threads, cpu_clock_normal, cpu_turbo_clock, igpu_clock, igpu_turbo_clock, l3_cache, tdp, release_date, socket, pcie_version, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    //stmt field names on the table + equal num of ?
    for(var i = 2; i < rowCount; ++i){ //change (i)accordingly to the table
        regex = /\d\d\d\d-\d\d-\d\d/
        var a = data[12][i].match(regex)
        if (a!=null){           
            data[12][i] = a[0];//if date is fucked up use this loop(change index to the data date location index)
        }
        
        var record = [
            "Skylake",
            data[2][i], //Brand
            data[3][i], //Model
            data[1][i], //Cores/Threads
            data[5][i], //Clock (normal)
            data[6][i], //Turbo clock
            data[7][i], //iGPU clock(normal)
            data[8][i], //iGPU clock(turbo)
            data[9][i], //L3 Cache
            data[11][i], //TDP
            data[12][i], //Release date
            data[14][i], //Socket
            "DMI 3.0 PCIe 3.0", //PCIe v
            data[16][i] //Memory

        ]
        
        stmt.run(...record)
    }
     stmt.finalize();
     db.close()
}


