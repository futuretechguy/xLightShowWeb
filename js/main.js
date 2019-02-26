var current_status;
var current_showdata;
var current_row;
var current_playlist;
var current_step;
var current_nextstep;
var conn_status;
var current_Data;
var Current_PlaylistSteps;
var current_Loading;


class Current {
    constructor(current_status,current_playlist, current_step, current_nextstep, conn_status) {
        this.status = current_status;
        this.playlist = current_playlist;
        this.step = current_step;
        this.nextstep = current_nextstep;
        this.connstatus = conn_status;
    }    
}

var current = new Current();


// PlayList Class: Represents a step/song
class Song {
    constructor(title, artist, album, imgpath, sid) {
      this.title = title;
      this.artist = artist;
      this.album = album;
      this.imgpath = imgpath;
      this.sid = sid;
    }
  }

  // UI Class: Handle UI Tasks
class UI {
    static displaySongs(pList) {
        const PlayList = Store.getSongs(pList);
        PlayList.forEach((song) => UI.addSongToTable(song));
      
    }
  
    //create table
    static addSongToTable(song) {

        const rowcont = document.getElementById('tbl-Play-List');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td><input type="checkbox" class="btn-select"></td>
        <td>${song.title}</td>
        <td>${song.artist}</td>
        <td>${song.album}</td>
        <td>${song.imgpath}</td>
        <td><a href="#" title="Click to delete row" class=btn-delete">X<a/></td>
        `
        rowcont.appendChild(row)
    }
 
 
    static showAlert(message, className) {
      const adiv = document.createElement('div');
      adiv.className = `alert alert-${className}`;
      adiv.appendChild(document.createTextNode(message));
      const msgalert = document.querySelector('#Msg-Alert');
      msgalert.appendChild(adiv);
  
      // Vanish in 3 seconds
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    static clearFields() {
      document.querySelector('#title').value = '';
      document.querySelector('#artist').value = '';
      document.querySelector('#album').value = '';
      document.querySelector('#albumimg').value = '';
    }

    static clearTableRows() {
        const playlisttbl = document.querySelector('#tbl-Play-List');
        var rowcount = playlisttbl.rows.length;
        var i;
        for (i = rowcount-1; i>0; i--) {
            playlisttbl.deleteRow(i);
        } 
    }

    static sidExist(sid, plist) {
        const PlayList = Store.getSongs(plist.toLocaleLowerCase);
        var truefalse = false;
        PlayList.forEach((song, index) => {
            if (song.sid === sid) {
                truefalse = true;
            } 
        });
         return truefalse
    }

    static titleExist(title, plist) {
        const PlayList = Store.getSongs(plist.toLocaleLowerCase());
        var truefalse = false;
        PlayList.forEach((song, index) => {
            if (song.title.toLocaleLowerCase() === title.toLocaleLowerCase()) {
                truefalse = true;
            } 
        });
         return truefalse
    }

    static getSelectedRow() {
        const tblcells = document.querySelector('#tbl-Play-List');        
        var i;
        var selid;
        for (i = 0; i < tblcells.rows.length; i++) {
            if (tblcells.rows[i].cells[0].childNodes[0].checked === true) {
                selid = tblcells.rows[i].cells[1].innerHTML;
                break;
            }
        }
        return selid;
    }

    static selectedIndex() {
        const tblcells = document.querySelector('#tbl-Play-List');        
        var selid;
        for (var i = 0; i < tblcells.rows.length; i++) {
            if (tblcells.rows[i].cells[0].childNodes[0].checked === true) {
                selid = i;
                break;
            }
        }
        return selid;
    }

    static clearOthersel(index) {
        const tblcells = document.querySelector('#tbl-Play-List');
        for (var i = tblcells.rows.length - 1; i > index; i--) {
            if (i !== index) {
                tblcells.rows[i].cells[0].childNodes[0].checked = false;
            }
        }
    }


    static uncheckRows() {
        const tblcells = document.querySelector('#tbl-Play-List');        
        for (var i = 1; i < tblcells.rows.length; i++) {
            if (tblcells.rows[i].cells[0].childNodes[0].checked === true) {
                tblcells.rows[i].cells[0].childNodes[0].checked = false;
            }
        }
        return true;
    }

    //for creating row IDs
    static guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + s4();
      }

    static plistExist(plist) {
        var i;
        var truefalse = fales;
        if (localStorage.length > 1) {
            for ( var i = 0, len = localStorage.length; i < len; ++i ) {
                if (String(localStorage.key(i)).toLocaleLowerCase === plist.toLocaleLowerCase) {
                    truefalse = true;
                }
                break;
            } 
        }
        return truefalse;
    }
}


  // Store Class: Handles Storage
class Store {
    static getallStorage() {
        var values = [],
            keys = Object.keys(localStorage),
            i = keys.length;
    
        while ( i-- ) {
            values.push( localStorage.getItem(keys[i]) );
        }
    
        return values;
    }

    static canStoreData() {
        if (typeof Storage !== "undefined") {
            return true;
        } else {
            return false;
        }
    }

    static getSongs(plist) {
      let PlayList;
      if(localStorage.getItem(plist) === null) {
        PlayList = [];
      } else {
        PlayList = JSON.parse(localStorage.getItem(plist));
      }
      return PlayList;
    }
  
    static addSong(song, plist) {
      const PlayList = Store.getSongs(plist);
      PlayList.push(song);
      localStorage.setItem(plist, JSON.stringify(PlayList));
    }
  
    static removeSong(deltitle, plist) {
        const PlayList = Store.getSongs(plist);
        var songloc;
        PlayList.forEach((song, index) => {
            if(song.title === deltitle) {
                songloc = index;
            }
        });  
      PlayList.splice(songloc, 1);   
      localStorage.setItem(plist, JSON.stringify(PlayList));
    }

    static editSong(editsong, plist){
        const PlayList = Store.getSongs(plist);
        var songloc;
        PlayList.forEach((song, index) => {
            if(song.title === editsong.title) {
                songloc = index;
            }
        }); 
        PlayList.splice(songloc, 1, editsong);
        localStorage.setItem(plist, JSON.stringify(PlayList));
    }

    static getCurrSong(title, plist) {
       const PlayList = Store.getSongs(plist.toLocaleLowerCase());
       var songItem
        PlayList.forEach((song) => {
            if (song.title.toLocaleLowerCase() === title.toLocaleLowerCase()) {
                songItem = song;
            }
        });  
           return songItem;
        }
}

function checkImageExists(imageUrl, callBack) {
    var imageData = new Image();
    imageData.onload = function() {
        callBack(true);
    };
    imageData.onerror = function() {
        callBack(false);
    };
    imageData.src = imageUrl;
}

/* function loadData(ofile) {
    var request = new XMLHttpRequest();
    request.open('GET', 'data/' + ofile, false);
    request.send();
    var textfileContent = request.responseText;
    return textfileContent;
} */



function loadfbLink(objlink, eid) {
    var linkEl = document.querySelector(eid);
    if (isNaN(linkEl) === true) {
        window.open(linkEl.href, '_blank');
        if (typeof objlink !== "undefined") {
            if (objlink.toString().length > 0) {
                linkEl.setAttribute('href', objlink)
            }
        } else {
            return false;
        }
    }
}
    


function stashRetrieve(xsKeyName) {
    var xsKey = 'Get' + xsKeyName;   
    current_Loading =xsKey;
    var wsmessage = {Type:"stash", Command:"Retrieve",Key:xsKey, Data:"", Reference:""};
    var cmdjson = JSON.stringify(wsmessage);
    ws.send(cmdjson); 
}

function stashStore(xsKeyName){
    var xsKeyData = JSON.parse(localStorage.getItem(xsKeyName.toLocaleLowerCase()));
    if (typeof xsKeyData === "undefined") {
        xsKeyData = createPlayListObj(Current_PlaylistSteps)
    }
    xsKey = 'Get' + xsKeyName.toString().charAt(0).toUpperCase() + xsKeyName.toString().substr(1).toLowerCase();   
    var xsData = JSON.stringify({songs:xsKeyData});                  //'{\"songs\":' + JSON.stringify(xsKeyData) + '}';   //'{\"songs\":' + xsKeyData + '}';

      
    var wsmessage = {Type:"stash", Command:"Store", Key:xsKey, Data:xsData, Reference:""};
    var cmdjson = JSON.stringify(wsmessage);
    console.log(cmdjson);
    ws.send(cmdjson);
}

function SetConnectionStatus(ostatus){
    conn_status = document.getElementById("Server_Status");
    conn_status.innerHTML = ostatus
    if (ostatus === "Connected!") {
        conn_status.style.color = "green";

    } else if (ostatus === "Connection closed!") {
        conn_status.style.color = "red";
        current_status = "Disconnected"; 
    } else if (ostatus === "Status: an error occured") {
        conn_status.style.color = "red"; 
    }
}


function addOption(el){
    var select = document.getElementById(el);
    select.options[select.options.length] = new Option('New Element', '0', false, false);

}

function removeAllOptions(el){
    var select = document.getElementById(el);
    select.options.length = 0;
}

function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]) );
    }

    return values;
}

function setShowData() {
    var xsKey = "show"
    var sn = "Jones Family Show"
    var yt = "https://youtu.be/pF12-3h8hpA"
    var st = "8:00PM - 10:00PM"
    var fb = "https://www.facebook.com/groups/628061113896314/"
    var site= "http://xlights.org"

    sdata = {name:sn,youtube:yt,time:st,facebook:fb,url:site}
    var kvp = {};
    kvp[xsKey] = [];
    kvp[xsKey].push(sdata); 
    var xsData = JSON.stringify(kvp);
    var wsMessage = {Type:"stash",Command:"Store",Key:"GetShow",Data:xsData,Reference:""}
    var cmdjson = JSON.stringify(wsMessage);
    ws.send(cmdjson);
}

function setLoadState(oResult, oName, oData ) {

    if (oName === "GetShow") {
        if (oResult === "Failed"){
            setShowData();
            //console.log("Show data file was not found");
        } else {
            if (typeof oData[0].name !== "undefined") {
                document.querySelector("#Show-Title").innerHTML = oData[0].name;
            }
            //load Facebook and Youtube link if defined
            if (typeof oData[0].facebook !== "undefined") {
                loadfbLink(oData[0].facebook, "#fburl");
            }
            if (typeof oData[0].youtube !== "undefined") {
                loadfbLink(oData[0].youtube, "#yturl");
            }
            
        }
       
    } else if (oName === 'Get' + current_playlist) {
        if (oResult === "Failed"){
            stashStore(current_playlist);
            console.log(`loading...  ${current_playlist}`);
        } else {
            //push data to clients
            if (typeof(oData) !== "undefined") {
                oData.forEach((song, index) => {
                    localsong = getLocalRow(song.title);
                    if(song.title === localsong.title) {
                        for (var i = 0; i < Object.values(song).length; i++) {
                            if (Object.values(song)[i] !== Object.values(localsong)[i] && Object.values(song)[i] !== "")  {
                                if (Object.keys(localsong)[i] !== "sid") {
                                    updateLocalSong(song, oData);
                                    break;
                                } 
                            }
                        }
                    }
                }); 
            }
        }
    }
}



function loadCachePlaylist(xsKey){
    var xsKeyData = JSON.parse(localStorage.getItem(xsKey.toLocaleLowerCase())); // localStorage.getItem(xsKey.toLocaleLowerCase());
    current_Data = xsKeyData;
}


function GetCurrentRow(oData, oStep) {
    for (i = 0; i < oData.length; i++) {
        if (oData[i].title.toLocaleLowerCase() === oStep.toLocaleLowerCase()) {
            current_row = oData[i];
            break;
        }
    }
}
//used by sync process
function getLocalRow(otitle){
    var oIndex
    var xsKeyData = JSON.parse(localStorage.getItem(current_playlist.toLocaleLowerCase())); 
        for (i = 0; i < xsKeyData .length; i++) {
            if (xsKeyData[i].title.toLocaleLowerCase() === otitle.toLocaleLowerCase()) {
                oIndex = i;
                break;
            }
        }
        return xsKeyData[oIndex];
}
//sync server data to client's local cache
function updateLocalSong (serverRow, serverData) {
    var songloc;
    const PlayList = JSON.parse(localStorage.getItem(current_playlist.toLocaleLowerCase())); 
   
    PlayList.forEach((song, index) => {
        if(song.title.toLocaleLowerCase() === serverRow.title.toLocaleLowerCase()) {
            songloc = index;
        }
    }); 

    var syncSid = serverRow.sid;
    var syncTitle = serverRow.title;
    var syncArtist = serverRow.artist;
    var syncAlbum = serverRow.album;
    var syncImgPath = serverRow.imgpath;

    if (typeof (serverRow.sid) === "undefined") {
        syncSid = ""
    }
    if (typeof (serverRow.title) === "undefined") {
        syncTitle = ""
    }
    if (typeof (serverRow.artist) === "undefined") {
        syncArtist = ""
    }
    if (typeof (serverRow.album) === "undefined") {
        syncAlbum = ""
    }
    if (typeof (serverRow.imgpath) === "undefined") {
        syncImgPath = ""
    }
    var updtRow = { title: syncTitle, artist: syncArtist, album: syncAlbum, imgpath: syncImgPath, sid: syncSid }
    PlayList.splice(songloc, 1, updtRow);
    localStorage.setItem(current_playlist.toLocaleLowerCase(), JSON.stringify(PlayList));

}


function createPlayListObj(steps) {
    var SongRow = {};
    SongRow =[]; 
    steps.forEach((song) => {
        SongRow.push({title:song.name, artist:"", album:"",imgpath:"", sid:UI.guid()});
    });
    return SongRow;
}


//for saving system images to local cache (not used)
function ProcessSysImage(img) {
    convertImgToBase64(img, function(base64Img){saveImgLocal(img,base64Img);})
   
}

function saveImgLocal(img,base64Img){
    setTimeout(() => {
        var imgName = "img" + img.substring(8, img.indexOf("."))
        var storedImg = localStorage.getItem(imgName);
        if (typeof(storedImg) === "undefined") {
            localStorage.setItem(imgName, base64Img);   
        }
    },2000);
}


function convertImgToBase64(url, callback, outputFormat){
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this,0,0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback(dataURL);
        canvas = null; 
    };
    img.src = url;
}

function setSessionItem(sItem, sValue){
    sessionStorage.setItem(sItem, sValue);
}
function getSessionItem(sItem){
    var rsItem = sessionStorage.getItem(sItem);
    return rsItem;
}