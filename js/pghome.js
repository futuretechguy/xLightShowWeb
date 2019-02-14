
function ProcessMessage(oMsgvalue) {
    obj = JSON && JSON.parse(oMsgvalue) || $.parseJSON(oMsgvalue);
    var currstep = document.querySelector("#Curr_Step");
    var currsteplbl = document.querySelector("#Curr_Step_Lbl");
    var currstatustext = document.querySelector("#Curr_Status_Txt");
    var curralbum = document.querySelector("#Curr_Album");
    var currartist = document.querySelector("#Curr_Artist");
    var selstep = document.querySelector("#Sel_Step");
    var stepimg = document.querySelector("#StepImg");
    var currnextstep = document.querySelector("#Next-Song");


    if (typeof obj.step !== "undefined") { 
        if (obj.step !== current_step) {
            current_step = obj.step;
            currstep.innerHTML = obj.step;
             ProcessStateChange();
        }
    }

    //listen for next step and update the elements
    if (typeof obj.nextstep !== "undefined") {
        if (obj.nextstep !== current_nextstep) {
            current_nextstep = obj.nextstep;
            currnextstep.innerHTML = current_nextstep;
           
        } else if (obj.nextstep == "") {
            currnextstep.innerHTML = "Last song in playlist";
        }
    }

    //Process status first and subsiquent status changes 
    if (typeof obj.status !== "undefined") {
        if (obj.status !== current_status) {
            current_status = obj.status;
            if (obj.status === "playing") {
               
                currsteplbl.innerHTML = "Song";
                currnextstep.innerHTML = current_nextstep;
                currstep.innerHTML= current_step;
               
                //request playlist from server
                 var message;
                message = { Type: "query", Query: "GetPlayListSteps", Parameters: obj.playlist, Reference: "xScheduleQuery" };
                var cmdjson = JSON.stringify(message);
                ws.send(cmdjson);

                ProcessStateChange();
                selstep.options[0].text = "Select Song";


            } else if (obj.status === "idle") {
                curralbum.innerHTML = "N/A";
                currartist.innerHTML = "N/A";
                currstatustext.innerHTML = "idle";
                currnextstep.innerHTML = "";
                currstep.innerHTML = "idle";
                currsteplbl.innerHTML = "Status";
                selstep.options.length = 1;
                selstep.options[0].text = "idle";
                stepimg.src = "img/ShowStopped.png";
                
            } else if (obj.status === "paused") {
 
                stepimg.src = "img/ShowPaused.png";
            }
        }
    }


    //listen for and process the current step
    if (typeof obj.steps !== "undefined") {
        var select = document.getElementById("Sel_Step");
        obj.steps.forEach(function (element) {
            select.options[select.options.length] = new Option(element.name, '0', false, false);
        });
        //cache the playlist steps (songs) locally if browser supports storage
        if (Store.canStoreData() === true) {
            if (select.options.length > 1) {
                for (i = 1; i < select.options.length; i++) {
                    if (UI.titleExist(select.options[i].text, current_playlist) === false) {
                        const playlist = current_playlist.toLocaleLowerCase();
                        const title = select.options[i].text;
                        const artist = "";
                        const album = "";
                        const imgpath = "";
                        var sid = UI.guid();
                        const song = new Song(title, artist, album, imgpath, sid);
                        Store.addSong(song, playlist)
                    }
                }
            }
          //use this local data 
          getPlaylistData(current_playlist);

        } else {
            //creat a new data object if local storage is not supported
            createPlayListObj(obj.steps);
        }
    }

    //populate the current_playlist variable
    if (typeof obj.playlist !== "undefined") {
        if (obj.playlist !== current_playlist) {
            current_playlist =  obj.playlist;
        }
    }

    //Process Get[PlayList].dat data response
    if (typeof obj.songs !== "undefined") {
        if (obj.songs.length > 0) {   
            setLoadState("Success", current_Loading, obj.songs)
            console.log(`Loading.. ${current_Loading}`);
        }
    }

    //process GetShow.dat data response
    if (typeof obj.show !== "undefined") {
        if (obj.show.length > 0) {
            setLoadState("Success", current_Loading, obj.show)
            console.log(`Loading.. ${current_Loading}`);
        }
    }

    //shows when stash comand but did not find a requested file
    if (typeof obj.stash !== "undifined" && typeof obj.result !== "undifined") {
        if (obj.stash === "Retrieve" && obj.result === "failed") {
            setLoadState("Failed", current_Loading, "")
            console.log(`${current_Loading}  file not found`)
        } 
    }

    //shows when stash command fails
    if (typeof obj.message !== "undifined" && typeof obj.result !== "undifined"){
        if (obj.message === "JSON message not well formed." && obj.result === "failed") {
            console.log(`${current_Loading} ${obj.message}`)
        }
    }
}


function getShowConfig() {
    setTimeout(() => {
        stashRetrieve("Show");
    }, 2000);
}

async function getPlaylistData(oPlaylist){
    //load local data cache file
    await loadCachePlaylist(oPlaylist.toLocaleLowerCase())

    return new Promise((resolve, reject) => {
        setTimeout(() => {    
            // load server file, if one does not exist it will be created from the local cache
            stashRetrieve(oPlaylist);
            const error = false;
            if (!error) {
                resolve("Sucess!")
            } else {
                reject("Error: Something went wrong!");
            }
        }, 2000);
    });
}

function ProcessStateChange() {
    var curralbum = document.querySelector("#Curr_Album");
    var currartist = document.querySelector("#Curr_Artist");
    var stepimg = document.querySelector("#StepImg");

    //if data file is not found
    if (typeof (current_Data) === "undefined") {
        
        //remove white spaces from image file
        var im = current_step.toString().replace(/\s+/g, '')
        if (im === "") {

            if (current_status === "pause") {
                stepimg.src = "img/ShowPause.png";
            } else {
                stepimg.src = "img/ShowPlaying.png";
            }

        } else {

            if (current_status === "pause") {
                stepimg.src = "img/ShowPause.png";

            } else {

                checkImageExists("img/" + im + ".jpg", function (existsImage) {
                    //console.log("no data--- img/" + im + ".jpg");

                    if (existsImage == true) {
                        stepimg.src = "img/" + im + ".jpg";
                    }
                    else {
                        stepimg.src = "img/ShowPlaying.png";
                    }
                });
            }
        }
        currartist.innerHTML = "";
        curralbum.innerHTML = "";

      //data file is found load it
    } else {
        //load current data row for current step
        GetCurrentRow(current_Data, current_step)  //file not created get current row

        if (current_row.imgpath.length === 0) {
            var im = current_step.toString().replace(/\s+/g, '')
            checkImageExists("img/" + im + ".jpg", function (existsImage) {
                if (existsImage == true) {
                    stepimg.src = "img/" + im + ".jpg";
                }
                else {
                    stepimg.src = "img/ShowPlaying.png";
                }
            });


        } else {

            //check if the file exist
            stepimg.src = "img/" + current_row.imgpath;
            checkImageExists("img/" + current_row.imgpath, function (existsImage) {
                if (existsImage == true) {
                    stepimg.src = "img/" + current_row.imgpath;
                } else {
                    var im = current_step.toString().replace(/\s+/g, '')
                    checkImageExists("img/" + im + ".jpg", function (existsImage) {
                        if (existsImage == true) {
                            stepimg.src = "img/" + im + ".jpg";
                        }
                        else {
                            stepimg.src = "img/ShowPlaying.png";
                        }
                    });
                }
            });
        }
        currartist.innerHTML = current_row.artist;
        curralbum.innerHTML = current_row.album;
    }
}

window.onload = function () {
    //dropdown list of steps in playlist (populated onload)
    document.querySelector("#mainselection").onchange = function (evt) {
        var stepsel = document.querySelector("#Sel_Step");
        if (stepsel.selectedIndex > 0) {
            var message;
            var jstep = stepsel.options[stepsel.selectedIndex].text;
            message = { Type: "command", Command: "Jump to specified step in current playlist", Parameters: jstep.toString() };
            var cmdjson = JSON.stringify(message);
            ws.send(cmdjson);
        }
        stepsel.selectedIndex = 0;
    };

    //send socket cmd to skip to next song (Next button)
    document.querySelector("#Btn_Next").onclick = function (evt) {
        var message;
        message = { Type: "command", Command: "Next step in current playlist", Parameters: "", Data: "", Reference: "" };
        var cmdjson = JSON.stringify(message);
        ws.send(cmdjson);
    };

    //chick action for show title, may be used for promotional site like patreon etc. 
    document.querySelector("#Show-Title").onclick = function (evt) {
        var showObj = JSON.parse(show_data)
        document.querySelector("#Show-Title").innerHTML = showObj.name;
        window.open(showObj.url);
    }

    //send socket cmd to jumo back to previous song (Back Button)
    document.querySelector("#Btn_Back").onclick = function (evt) {
        var message;
        message = { Type: "command", Command: "Prior step in current playlist", Parameters: "", Data: "", Reference: "" };
        var cmdjson = JSON.stringify(message);
        ws.send(cmdjson);
    };

    //get show data create GetSgow.dat if it does not exist
    getShowConfig();
   
}


