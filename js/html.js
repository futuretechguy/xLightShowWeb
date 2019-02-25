export const pgPlaylist = `
<div>
    <form id="song-form">
        <div align="Center" class="mcontainer" id="Main-Container">
            <div class="modsel">
                Please select playlist:
                <select id=Sel_Plist class="plistselect">
                    <option>Click to Select</option>
                </select>
            </div>
            <div class="alertdiv" id="Msg-Alert"></div>
            <div class="pgtitle" id="Pg-Title">
                <div align="Right" class="timage"><img id=StepImg src="../img/playlist.png" alt=""></div>
                <div align="Right" class="tlable"><text class="ttext">Playlist:</text></div>
                <div align="Left" class="plval"><text id="playlist" class="ttext"></text></div>
            </div>
            <div class="songlbl">Song:</div>
            <div class="songval">
                <input class="dinput" type="text" id="title">
            </div>
            <div class="songimglbl">Image name:</div>
            <div class="songimgval">
                <input class="dinput" type="text" id="albumimg">
            </div>
            <div class="artistlbl">Artist:</div>
            <div class="artistval">
                <input class="dinput" type="text" id="artist">
            </div>
            <div class="albumlbl">Album:</div>
            <div class="albumval">
                <input class="dinput" type="text" id="album">
            </div>
            <div class="songbtn"><button class="btn" type="submit" id="Btn_cont">Save</button><button class="btn"
                    type="button" id="Btn-Upload">upload</button></div>
            <div class="pgfooter" id=parent-list>
                <div id="Sel-Colval" class="selcolval">
                    <table class="table" id="tbl-Play-List">
                        <thead class="tbl-header">
                            <tr>
                                <th><img src="../img/gesture-tap.png" alt=""></th>
                                <th>Title</th>
                                <th>Artist</th>
                                <th>Album</th>
                                <th>Image</th>
                                <th><img src="../img/trash-can.png" alt=""></th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>
    </form>
    <input type="file" id="fileinput" style="display: none;">
</div>`;

export const divdeny = `
<div align="Center" class="mcontainer" id="Main-Container">
    <div class="pgtitle accessfrm" id="Pg-Title">
        <div align="Right" class="timage"><img id=StepImg src="../img/playlist.png" alt=""></div>
        <div align="Right" class="tlable"><text class="ttext">Access___</text></div>
        <div align="Left" class="plval"><text id="playlist" class="ttext">denied!</text></div>
    </div>
</div>`;