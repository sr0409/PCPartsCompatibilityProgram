var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../PartsDB.db');
 
const fs = require('fs')
var cheerio = require('cheerio')
var cheerioTableparser = require('cheerio-tableparser');
db.serialize(function() {
    parseTable(db)
    
})

function parseTable(db){
    var file = fs.readFileSync('ivybridge.html', {encoding: 'utf8'})
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
    regex = /\w or/gi
    file = file.replace(regex, '/')
    regex = /Up to /gi
    file = file.replace(regex, '')

    const $ = cheerio.load(file)
    cheerioTableparser($);
    var data = $("#mw-content-text > div > table:nth-child(57)").parsetable(true, true, true);// table location on html
    var rowCount = data[0].length
    
    var stmt = db.prepare("INSERT INTO CPU (architecture, processor_brand, processor_model, cores_threads, cpu_clock_normal, cpu_turbo_clock, igpu_clock, igpu_turbo_clock, l3_cache, tdp, release_date, socket, pcie_version, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    //stmt field names on the table + equal num of ?
    for(var i = 2; i < rowCount; ++i){ //change (i)accordingly to the table
        var record = [
            "Ivy Bridge",
            data[0][i], //Brand
            data[1][i], //Model
            data[2][i], //Cores/Threads
            data[3][i], //Clock (normal)
            data[4][i], //Turbo clock
            data[5][i], //iGPU clock(normal)
            data[6][i], //iGPU clock(turbo)
            data[7][i], //L3 Cache
            data[8][i], //TDP
            data[9][i], //Release date
            data[11][i], //Socket
            data[12][i], //PCIe v
            data[13][i], //Memory

        ]
        stmt.run(...record)
        
    }
    stmt.finalize();
    db.close()
}

