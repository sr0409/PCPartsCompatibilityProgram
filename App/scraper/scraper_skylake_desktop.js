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
    file = file.replace(regex, 'x2')
    regex = /Up to triple channel /gi
    file = file.replace(regex, 'x3')
    regex = /Up to quad channel /gi
    file = file.replace(regex, 'x4')
    regex = /\[\d+\]/gi
    file = file.replace(regex, '')
    regex = /\[a\]/gi
    file = file.replace(regex, '')

    const $ = cheerio.load(file)
    cheerioTableparser($);
    var data = $("#mw-content-text > div > table:nth-child(47)").parsetable(true, true, true);// table location on html
   
    var rowCount = data[0].length
    var stmt = db.prepare("INSERT INTO CPU (architecture, processor_brand, processor_model, cores_threads, cpu_clock_normal, cpu_turbo_clock, igpu_clock, igpu_turbo_clock, l3_cache, tdp, release_date, socket, pcie_version, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    //stmt field names on the table + equal num of ?
    for(var i = 2; i < rowCount; ++i){ //change (i)accordingly to the table
        var record = [
            "Skylake",
            data[1][i], //Brand
            data[2][i], //Model
            data[0][i], //Cores/Threads
            data[3][i], //Clock (normal)
            data[4][i], //Turbo clock
            "N/A", //iGPU clock(normal)
            data[9][i], //iGPU clock(turbo)
            data[11][i], //L3 Cache
            data[13][i], //TDP
            data[15][i], //Release date
            data[14][i], //Socket
            "DMI 3.0 PCIe 3.0", //PCIe v
            "DDR4-1866/2133, DDR3L-1333/1600" //Memory

        ]
        
        stmt.run(...record)
    }
    stmt.finalize();
    db.close()
}

