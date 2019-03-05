import {pgPlaylist, divdeny} from "./html.js";

var Curr_Playlist
window.onload = function () {
    //load form elements only if user is authenticated otherwise redirect to login page
    var logonState = sessionStorage.getItem("isloginValid");
    if (logonState === "true") {
        var frmplist = document.getElementById("frmDiv");
        frmplist.innerHTML = pgPlaylist ;
    } else {
        var frmplist = document.getElementById("frmDiv");
        frmplist.innerHTML = divdeny;
        window.location = "../login.html"; // Redirecting to login page.
    }

    var pselect = document.getElementById("Sel_Plist");
    if (localStorage.length > 1) {
        for (var i = 0, len = localStorage.length; i < len; ++i) {
            pselect.options[pselect.options.length] = new Option(localStorage.key(i), '0', false, false);
        }
        UI.showAlert('Select a playlist from the drop down list', 'success');
    } else {
        loadPlayList(localStorage.key(0))
    }

    // Event: Remove a song
    document.querySelector("#tbl-Play-List").onclick = function (e) {
        var elClasses = e.target.className.toString();
        const selrow = e.target.parentElement.parentElement;


        if (elClasses.includes('delete')) {

            // Remove song from store
            Store.removeSong(selrow.cells[1].innerHTML, Curr_Playlist);

            // Remove song from UI
            selrow.remove();

            // Show success message
            UI.showAlert('Song Removed', 'success');
        }
        if (elClasses.includes('select')) {

            if (selrow.cells[0].childNodes[0].checked === true) {
                document.getElementById("title").value = selrow.cells[1].innerHTML;
                document.getElementById("artist").value = selrow.cells[2].innerHTML;
                document.getElementById("album").value = selrow.cells[3].innerHTML;
                document.getElementById("albumimg").value = selrow.cells[4].innerHTML;
                //clear other checkbox when a new one is selected
                UI.clearOthersel(UI.selectedIndex())

            }
            if (selrow.cells[0].childNodes[0].checked === false) {
                UI.clearFields();
            }
        }
    }
    //process playlist select option
    document.querySelector("#Sel_Plist").onchange = function (evt) {
        const playlisttbl = document.querySelector('#tbl-Play-List')
        if (playlisttbl.rows.length > 0) {
            UI.clearTableRows();
        }
        var e = document.getElementById("Sel_Plist");
        loadPlayList(e.options[e.selectedIndex].text)
    }

    // Event: Add a song
    document.querySelector("#song-form").onsubmit = function (e) {

        // Prevent actual submit
        e.preventDefault();

        // Get form values
        const playlist = Curr_Playlist;
        const title = document.querySelector('#title').value;
        const artist = document.querySelector('#artist').value;
        const album = document.querySelector('#album').value;
        const imgpath = document.querySelector('#albumimg').value;
        var sid = UI.guid();


        // Validate
        if (title === '') {
            UI.showAlert('Please enter a title in the step field', 'danger');

        } else {
            // Instatiate song
            const song = new Song(title, artist, album, imgpath, sid);

            var actiontext;
            if (UI.titleExist(title, playlist) === true) {

                // update play list in store
                Store.editSong(song, playlist)

                //remove check marks
                UI.uncheckRows();

                //add action text "updated"
                actiontext = 'updated';

            } else {


                // Add play list to store
                Store.addSong(song, playlist);

                //add action text "added"
                actiontext = 'added';
            }
            // Show action message
            UI.showAlert('Song ' + actiontext, "success");

            // Clear fields
            UI.clearFields();
            UI.clearTableRows();
            loadPlayList(playlist)
        }
    }
    //manually upload file with local file system
    document.querySelector("#Btn-Upload").onclick = function (e) {

        var plistsel = document.querySelector("#Sel_Plist");
        var xsKeyName;
        if (plistsel.selectedIndex > 0) {
            xsKeyName = plistsel.options[plistsel.selectedIndex].text.toString();
        } else {
            xsKeyName = localStorage.key(0);
        }
        var pListData = JSON.parse(localStorage.getItem(xsKeyName));
        var xsData = JSON.stringify({songs:pListData});  
        
        download("Get" + xsKeyName + ".dat", xsData); 
    }
}

//load play list from localstore
function loadPlayList(playlist) {
    UI.displaySongs(playlist);
    Curr_Playlist = playlist;
    document.getElementById("playlist").innerHTML = playlist.toString().charAt(0).toUpperCase() + playlist.toString().substr(1).toLowerCase();


}
 //used to upload *.dat files to server   
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
