var usrHash = "40287259b3a706dbc2a2082e227c67bc"; 
var usdName = "ShowAdmin";
var attempt = 3; // Variable to count number of attempts.

window.onload = function () {

    document.querySelector("#submit").onclick = function (e) {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        if (username == usdName && pwdValid(password) === true) {
            alert("Login successfully");
            sessionStorage.setItem("isloginValid", true);
            window.location = "./pages/playlist.html"; // Redirecting to edit page.
        }
        else {
            attempt--;// Decrementing by one.
            alert("You have left " + attempt + " attempt;");
            // Disabling fields after 3 attempts.
            if (attempt == 0) {
                document.getElementById("username").disabled = true;
                document.getElementById("password").disabled = true;
                document.getElementById("submit").disabled = true;
            
            }
        }
    }

}

function pwdValid(pwd) {
    var oData = md5(pwd);
    if (usrHash === oData) {
        return true
    } else {
        return false;
    }

} //xShowButtons