var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../PartsDB.db');
 
const fs = require('fs')
var cheerio = require('cheerio'),
    cheerioTableparser = require('cheerio-tableparser');
db.serialize(function() {
    parseTable(db)
    
})

function parseTable(db){
    var file = fs.readFileSync('file.html', {encoding: 'utf8'})
    var regex = /<br\s*\/?>/gi
    file = file.replace(regex, ' ')
    regex = /Up to (?:dual|quad) channel /gi
    file = file.replace(regex, '')
    regex = /\[\d+\]/gi
    file = file.replace(regex, '')


    const $ = cheerio.load(file)
    cheerioTableparser($);
    var data = $("#mw-content-text > div > table:nth-child(26)").parsetable(true, true, true);
    var rowCount = data[0].length
    var stmt = db.prepare("INSERT INTO CPU (processor_brand, processor_model, cores_threads, cpu_clock_normal, cpu_turbo_clock, igpu_clock, igpu_turbo_clock, l3_cache, tdp, release_date, socket, pcie_version, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    for(var i = 2; i < rowCount; ++i){ //change accordingly to the table
        var record = [
            data[1][i], //Brand
            data[2][i], //Model
            data[3][i], //Cores/Threads
            data[4][i], //Clock (normal)
            data[5][i], //Turbo clock
            data[6][i], //iGPU clock(normal)
            data[7][i], //iGPU clock(turbo)
            data[8][i], //L3 Cache
            data[9][i], //TDP
            data[10][i], //Release date
            data[12][i], //Socket
            data[13][i], //PCIe v
            data[14][i] //Memory

        ]
        stmt.run(...record)
    }
    stmt.finalize();
    db.close()
}

