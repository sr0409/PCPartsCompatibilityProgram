var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../PartsDB.db');
 
const fs = require('fs')
var cheerio = require('cheerio')
var cheerioTableparser = require('cheerio-tableparser');
db.serialize(function() {
    parseTable(db)
    
})

function parseTable(db){
    var file = fs.readFileSync('haswell.html', {encoding: 'utf8'})
    var regex = /<br\s*\/?>/gi
    file = file.replace(regex, ' ')
    regex = /Up to dual channel /gi
    file = file.replace(regex, 'x2 ')
    regex = /Up to triple channel /gi
    file = file.replace(regex, 'x3')
    regex = /Up to quad channel /gi
    file = file.replace(regex, 'x4 ')
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
    var data = $("#mw-content-text > div > table:nth-child(45)").parsetable(true, true, true);// table location on html
   
    var rowCount = data[0].length
    var stmt = db.prepare("INSERT INTO CPU (architecture, processor_brand, processor_model, cores_threads, cpu_clock_normal, cpu_turbo_clock, igpu_clock, igpu_turbo_clock, l3_cache, tdp, release_date, socket, pcie_version, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    //stmt field names on the table + equal num of ?
    for(var i = 2; i < rowCount; ++i){ //change (i)accordingly to the table
        regex = /\d\d\d\d-\d\d-\d\d/
        var a = data[10][i].match(regex)

        if (a!=null){
            data[10][i] = a[0];
        }
        var record = [
            "Haswell",
            data[2][i], //Brand
            data[3][i], //Model
            data[1][i], //Cores/Threads
            data[4][i], //Clock (normal)
            data[5][i], //Turbo clock
            "N/A", //iGPU clock(normal)
            "N/A", //iGPU clock(turbo)
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


