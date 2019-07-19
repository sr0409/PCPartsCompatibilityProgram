var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../PartsDB.db');

const fs = require('fs')
var cheerio = require('cheerio')
var cheerioTableparser = require('cheerio-tableparser');
db.serialize(function() {
        parseTable(db)
})

function parseTable(db){
    var file = fs.readFileSync('coffeelake.html', {encoding: 'utf8'})
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
    regex = /\d+GB/gi
    file = file.replace(regex, '')
    regex = /\n/gi
    file = file.replace(regex, ' ')
    

    const $ = cheerio.load(file)
    cheerioTableparser($);
    var data = $('#mw-content-text > div > table:nth-child(42)').parsetable(true, true, true);// table location on html
    var rowCount = data[0].length
   
    var stmt = db.prepare("INSERT INTO CPU (architecture, processor_brand, processor_model, cores_threads, cpu_clock_normal, cpu_turbo_clock, igpu_clock, igpu_turbo_clock, l3_cache, tdp, release_date, socket, pcie_version, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    //stmt field names on the table + equal num of ?
    for(var i = 3; i < rowCount; ++i){ //change (i)accordingly to the table
        
        if (data[8][i] != null && data[8][i] != 'N/A'){
            data[8][i] = data[8][i] + " GHz"
        }
       
        if (data[11][i] == ''){
            data[11][i] = data[4][i] + " GHz 1 or 2 cores"
        }
        else if (data[11][i] != 'N/A' && data[11][i] != ''){
            data[11][i] = data[11][i] + " GHz"
        }
          
        regex = /\s/
        data[16][i] = data[16][i].replace(regex, '-')

        var record = [
            "Coffee Lake",
            data[0][i], //Brand
            data[1][i], //Model
            data[2][i], //Cores/Threads
            data[3][i], //Clock (normal)
            data[11][i], //Turbo clock
            "N/A", //iGPU clock(normal)
            data[13][i], //iGPU clock(turbo)
            data[14][i], //L3 Cache
            data[15][i], //TDP
            "2018/2019", //Release date
            "LGA1151", //Socket
            "DMI 3.0 PCIe 3.0", //PCIe v
            data[16][i] //Memory

        ]
        
        stmt.run(...record)
        
    }
    stmt.finalize();
}
db.close()

