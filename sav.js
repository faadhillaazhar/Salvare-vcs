#!/usr/bin/env node

const readline = require('readline/promises');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const gz = require('zlib');
let add = [];


//main
switch (process.argv[2]){
    //version
  case '-v' :
    console.log("Salvare version 0.1")
  break;
    //help
  case 'help':
    console.log("    LIST OF COMMANDS    ");
    console.log("------------------------");
    console.log("-v : show the current version of Salvare");
    console.log("help : show all of the salvare commands");
    console.log("mdir : creating an empty working directory for salvare or recreate an existing one");
    console.log("add : add file to the index");
    console.log("status : show all the untracked files");
    console.log("logs : show all backups");
    console.log("backup : save changes to the working directory");
    console.log("restore : restore previous changes from the working directory");
    console.log("list : show everything that get indexed")
    break;
    //mdir
  case 'mdir':
    fs.mkdirSync(".sav_data",{recursive : true});
    fs.mkdirSync(".sav_data/index",{recursive : true});
    fs.mkdirSync(".sav_data/backups",{recursive : true});
    fs.writeFileSync(".sav_data/index/index.sid",JSON.stringify([],null,2));
    fs.writeFileSync(".sav_data/backups/list.json",JSON.stringify([],null,2));
    //fs.writeFileSync(".sav_data/backups/meta.json",JSON.stringify([],null,2));
    console.log("main directory created at ", process.cwd());
   break;
  case 'add':
    //add
    if(process.argv[3] == 'all'){
      //add all
      if(fs.existsSync(".sav_data/index")){
        
        let files = fs.readdirSync(process.cwd(),{withFileTypes: true});
        let transfer = files.splice(0,files.length);
        const targetDir = path.join(process.cwd(), '.sav_data','index');
        //console.log(transfer);
        
        for(let i=0; i < transfer.length;i++){
          if(transfer[i].isFile() && transfer[i].name !== "sav_data"){
            add.push(transfer[i].name);
          }
        }
        
        for(let i = 0; i < add.length; i++){
        if (add[i] == ".sav_data"){
          add.splice(i,1);
        }
      }

        const indexpath = path.join(targetDir,'index.sid');
        //let loadedData = JSON.parse(fs.readFileSync(indexpath,'utf-8'));
        //let updatedIndex = [...new Set([...loadedData, transfer])]
        fs.writeFileSync(indexpath,JSON.stringify(add, null, 2))
        console.log("done")
        
      } else {
        
        console.log("[ERROR] working directory did not exist");
        
      }
    } else {
      //add file
      let transfer = process.argv[3];
      const targetDir = path.join(process.cwd(), '.sav_data','index');
      const indexpath = path.join(targetDir,'index.sid');

      if(fs.existsSync(indexpath)){
        
        add = JSON.parse(fs.readFileSync(indexpath,'utf-8'));
        if(!Array.isArray(add)){
          add = []
        }
        
      if(add.length > 0){
        
        for(let i = 0; i < add.length; i++){
          
        if(transfer === add[i]){
          
          console.log("[ERROR] file " + transfer + " already exists");
          process.exit();
          
        } else if (add[i] == ".sav_data"){
          
          add.splice(i,1);
          
        }
      }
        
      }
      } else {
        
        console.log("[ERROR] working directory did not exist");
        process.exit();
        
      }
      add.push(transfer);
      
      if(fs.existsSync(".sav_data/index/index.sid")){
        
        let loadedData = JSON.parse(fs.readFileSync(indexpath,'utf-8'));
        if(!Array.isArray(loadedData)){
          loadedData = []
        }
        let updatedIndex = [...new Set([...loadedData, transfer])];
        fs.writeFileSync(indexpath,JSON.stringify(updatedIndex, null, 2))
        console.log("done")
        
      } else if(!(fs.existsSync(".sav_data/index/index.sid") )){
        
        //const indexpath = path.join(targetDir,'index.sid');
        fs.writeFileSync(".sav_data/index/index.sid",JSON.stringify(add, null, 2))
        console.log("done")

      }
    }
    break;
    //indexes
  case 'list':
    if(fs.existsSync(".sav_data/index/index.sid")){
      
      let indexes = JSON.parse(fs.readFileSync(".sav_data/index/index.sid"));
      if(indexes.length == 0){
        console.log("no indexed file");
      } else {
        for(let i=0;i<indexes.length;i++){
          console.log(indexes[i]);
        }
      }
      
    } else {
      console.log("no indexed file");
    }
    break;
  case 'backup':
    //backup
    const indexpath = path.join(process.cwd(),'.sav_data','index','index.sid');

  if(fs.existsSync(".sav_data")){
    
    const savepath = path.join(process.cwd(),'.sav_data','backups');
    const savefile = path.join(savepath,'list.json');
    let index = JSON.parse(fs.readFileSync(indexpath, 'utf-8'));
    
    if(!Array.isArray(index)){
      console.log("[ERROR] no indexed file");
      process.exit();
    }

      const hash = crypto.createHash('sha256').update(process.argv[3]).digest('hex');
      const name = process.argv[3];     
      let saved = JSON.parse(fs.readFileSync(savefile,'utf-8'));

        
        for(let i=0; i < saved.length; i++){
          if(name === saved[i]){
            console.log("[ERROR] Backup ", name, " already exist");
            process.exit();
          }
        }
        if(index.length == 0){
          console.log("[ERROR] no file indexed");
          process.exit();
        }
          
          const foldername = path.join(savepath,hash);
          fs.mkdirSync(foldername, {recursive:true});
        
          for(let i=0;i<index.length;i++){

            const dir = path.join(foldername, `${index[i]}.gz`);
            let readstream = fs.createReadStream(index[i]);
            let writestream = fs.createWriteStream(dir);
            const gzip = gz.createGzip();
            readstream.pipe(gzip).pipe(writestream);
          }
        
          fs.writeFileSync(".sav_data/index/index.sid",JSON.stringify([],null,2));
          let updatedlist = [...new Set([...saved, name])];
          fs.writeFileSync(savefile,JSON.stringify(updatedlist,null,2));
          console.log("backup ", name, " created");
          
        
      } else {
        console.log("[ERROR] working directory did not exist");
      }
    break;
  case 'logs':
    if(fs.existsSync(".sav_data")){
      let logs = JSON.parse(fs.readFileSync(".sav_data/backups/list.json",'utf-8'));
      for(let i=0;i<logs.length;i++){
        console.log(logs[i]);
      }
    } else {
      console.log("no backups");
    }
    break;
  case 'restore':
    //restore
    let name = process.argv[3];
    if(fs.existsSync(".sav_data")){
      let list = JSON.parse(fs.readFileSync(".sav_data/backups/list.json"));
      if(list.includes(name)){
        let hash = crypto.createHash('sha256').update(name).digest('hex');
        let Rpath = path.join(process.cwd(), ".sav_data", "backups", hash);
        let files = fs.readdirSync(Rpath);
        for(let i=0;i<files.length;i++){
          let targetfile = files[i];
          const rs = fs.createReadStream(path.join(Rpath, files[i]));
          const ws = fs.createWriteStream(path.join(process.cwd(), targetfile.slice(0,-3)));
          const gunzip = gz.createGunzip();
          rs.pipe(gunzip).pipe(ws);
        }
        console.log("backup ", name, " restored");
      }else{
        console.log("[ERROR] backup not found");
        process.exit();
      }
    } else {
      console.log("[ERROR] working directory did not exist");
    }
    break;
  case 'status':
    //status
  if(fs.existsSync(".sav_data")){
    let indexed = JSON.parse(fs.readFileSync(".sav_data/index/index.sid"));
    if(indexed.length == 0){
      let untracked = fs.readdirSync(process.cwd(),{withFileTypes:true});
      let show = [];
      for(let i=0;i<untracked.length;i++){
        if(untracked[i].isFile()){
          show.push(untracked[i].name)
        }
      }
      console.log(`found ${show.length} untracked files : `);
      console.log(show);
    } else {
      let files = fs.readdirSync(process.cwd(),{withFileTypes:true});
      let show = []
      for(let i=0;i<files.length;i++){
        if(!(indexed.includes(files[i].name)) && files[i].isFile()){
          show.push(files[i].name);
        }
      }
      console.log(`found ${show.length} untracked files : `);
      console.log(show);
    }
  } else {
    console.log("[ERROR] working directory did not exist");
  }
  break;
default :
    console.log(`invalid command ${process.argv[2]}`)
}