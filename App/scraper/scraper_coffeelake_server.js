var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../PartsDB.db');
var selector = ['#mw-content-text > div > table:nth-child(33)',
                '#mw-content-text > div > table:nth-child(45)'
                
]
const fs = require('fs')
var cheerio = require('cheerio')
var cheerioTableparser = require('cheerio-tableparser');
db.serialize(function() {
    for(var i = 0; i < selector.length;++i){
        parseTable(db,selector[i])
    }
    
})

function parseTable(db,selector){
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
    
    var data = $(selector).parsetable(true, true, true);// table location on html
    
    var rowCount = data[0].length
    var stmt = db.prepare("INSERT INTO CPU (architecture, processor_brand, processor_model, cores_threads, cpu_clock_normal, cpu_turbo_clock, igpu_clock, igpu_turbo_clock, l3_cache, tdp, release_date, socket, pcie_version, memory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    //stmt field names on the table + equal num of ?
    for(var i = 1; i < rowCount; ++i){ //change (i)accordingly to the table
        regex = /\s/
        data[9][i] = data[9][i].replace(regex, '-')
        data[9][i] = data[9][i].replace(/memory supported/, '')
        
        var record = [
            "Coffee Lake",
            data[0][i], //Brand
            data[1][i], //Model
            data[2][i], //Cores/Threads
            data[3][i], //Clock (normal)
            data[4][i], //Turbo clock
            "N/A", //iGPU clock(normal)
            data[6][i], //iGPU clock(turbo)
            data[7][i], //L3 Cache
            data[8][i], //TDP
            '2018/2019', //Release date
            'LGA1151', //Socket
            'DMI 2.0 PCIe 3.0', //PCIe v
            data[9][i] //Memory

        ]
        
        stmt.run(...record)
    }
    stmt.finalize();
}

db.close()


