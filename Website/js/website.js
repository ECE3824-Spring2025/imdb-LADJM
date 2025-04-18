"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://cl8tnekaej.execute-api.us-east-1.amazonaws.com/default/Website"; 

let html5QrcodeScanner;
//let endpoint02 = "";

/* SUPPORTING FUNCTIONS */

let onScanSuccess = (qrCodeMessage) => {
    //html5QrcodeScanner.stop(); //stop scanning now
    // handle on success condition with the decoded message
    $("#div-output").show();
    let itemcode = qrCodeMessage.substr(0,11);
    let name = qrCodeMessage.substr(11);
    $("#scanname").html(name);
    $("#scanitemcode").val(itemcode);
    console.log(itemcode);
    console.log(name);
    //$("#reader").hide();
    //stopCamera();
    //scroll to top of page
    $("html, body").animate({ scrollTop: "0px" });
}

let onScanError = (errorMessage) => {
    // this will handle on error condition with the decoded message
    // ** I am not really doing anything here.  
    // ** the scanner will generate a LOT of error messages
    // ** If you really need to see them you can write them to the console log
    // console.log(errorMessage);
}

let startCamera = async () => {
    await html5QrcodeScanner.render(onScanSuccess,onScanError);
    await $("#reader").show();
}

let stopCamera = async () => {
    await html5QrcodeScanner.clear();  
    await $("#reader").hide();
}


let checkOutButtonController = (x)=>{
    //alert(x);
    $("#scanclientid").val(x);
    $(".content-wrapper").hide();
    $("#div-Scan").show();
    startCamera();
}

let scanController = () => {

    let userId = $("#scanuserid").val();
    let clientId = $("#scanclientid").val();
    let itemCode = $("#scanitemcode").val();
    if (userId == "" || clientId == "" || itemCode == ""){
        $('#message-scan').html('Be sure to fill in UserID, ClientID, and Item Code.');
        $('#message-scan').addClass("alert alert-danger text-center");
        return; //quit the function now!  

    }

    let the_serialized_data = $("#form-scan").serialize();
    console.log(the_serialized_data); // best practice

    $.ajax({
        "url": endpoint01 + "/scancheck",
        "method": "POST",
        "data": the_serialized_data,
        "success": (results)=>{
            console.log(results)
            if (results.length == 0) {
                $('#message-scan').html("Failed. Try again.");
                $('#message-scan').addClass("alert alert-danger text-center");
            } else {
                $('#message-scan').html('');
                $('#message-scan').removeClass();
                $('#div-scan').hide(); //hide the login page
                $('#div-confirm').show();   //show the default page
            }          
        },
        "error" : (data)=>{
            console.log(data)
        }
    });
    $("html, body").animate({ scrollTop: "0px" });
};

    let moviesListController = () => {
        $('#movie-list').html(""); // Clear previous content
    
        $.ajax({
            "url": endpoint01 + "/movies",
            "method": "GET",
            "success": (results) => {
                console.log(results);
                if (results.length === 0) {
                    $('#movie-list').html("<p>No movies found.</p>");
                } else {
                    results.forEach(movie => {
                        let movieCard = `
                            <div class="movie-card">
                                <div class="movie-details">
                                    <h2>${movie.primaryTitle}</h2>
                                    <p><strong>Year:</strong> ${movie.startYear}</p>
                                    <p><strong>Genre:</strong> ${movie.genres}</p>
                                    <p><strong>Rating:</strong> ${movie.averageRating} (${movie.numVotes} votes)</p>
                                </div>
                            </div>`;
                        $('#movie-list').append(movieCard);
                    });
                }
            },
            "error": (error) => {
                console.error(error);
                $('#movie-list').html("<p class='alert alert-danger'>Error loading movies.</p>");
            }
        });
    };

let clientListController = () => {
    //clear any previous table data
    $('#table-clients').html("<tr> <th>Client Name</th>  <th>Options</th>  </tr>");
    //clear any previous messages
    $('#message-clientlist').html("");
    $('#message-clientlist').removeClass();

    // there is no data to error trap here. Step not needed.

    // there is no data to serialize here. Step not needed.

    // next thing to do is to write an ajax call
    $.ajax({
        "url": endpoint01 + "/clients",
        "method": "GET",
        "success": (results) => {
            console.log(results);  // best practice for students
            for(let i=0; i< results.length;i++){
                let clientname = results[i]['lastname'] + ", " + results[i]['firstname'];
                let clientid = results[i]['clientid'];
                let txttablerow = `<tr>
                    <td> ${clientname} </td>  
                    <td> <input type="button" onclick="checkOutButtonController(${clientid})" class="btn btn-primary" value="Check Out"> </td>
                    </tr>`
                $('#table-clients').append(txttablerow);                
            }
        },
        "error": (data) => {
            console.log(data);
            $('#message-scan').html("Scan failed. Try again.");
            $('#message-scan').addClass("alert alert-danger");
        }
    })
}

let loginController = () => {
    //clear any previous messages
    $('#login_message').html("");
    $('#login_message').removeClass();

    //first, let's do some client-side
    //error trapping.
    let username = $("#username").val();
    let password = $("#password").val();
    if (username == "" || password == ""){
        $('#login_message').html('The user name and password are both required.');
        $('#login_message').addClass("alert alert-danger text-center");
        return; //quit the function now!  
    }
   
    //whew!  We didn't quit the function because of an obvious error
    //now we go on to see if the login and password are good
    //this should be an ajax call
    //but here in the template its a simple conditional statement
    let the_serialized_data = $("#form-login").serialize();
    console.log(the_serialized_data); //best practice

    $.ajax({
        "url": endpoint01 + "/auth",
        "method": "POST",
        "data": the_serialized_data,
        "success": (results)=>{
            console.log(results)
            if (results.length == 0) {
                // login failed.  Remove userid
                localStorage.removeItem("userid");
                $('#login_message').html("Login Failed. Try again.");
                $('#login_message').addClass("alert alert-danger text-center");
            } else {
                //login succeeded.  Set userid.
                //localStorage.userid = 1; // adam has a userid of 1
                localStorage.userid = results[0]["userid"];
       
                //manage the appearence of things...
                $('#login_message').html('');
                $('#login_message').removeClass();
                $('.secured').removeClass('locked');
                $('.secured').addClass('unlocked');
                $('#div-login').hide(); //hide the login page
                $('#div-clientlist').show();   //show the default page
                clientListController();
                $("#scanuserid").val(localStorage.userid);
            }
        },
        "error": (data)=>{
            console.log(data)
        }
    });

    //scroll to top of page
    $("html, body").animate({ scrollTop: "0px" });
}; //Login Controller ends here


//document ready section
$(document).ready( () => {


    //create the QR code reader
    let loc = window.location.href+'';
    if (loc.indexOf('http://')==0){
        window.location.href = loc.replace('http://','https://');
    }

    html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        {
        fps: 10,
        qrbox: {width: 150, height: 150},
                rememberLastUsedCamera: false,
        });

    /* ----------------- start up navigation -----------------*/    
    /* controls what gets revealed when the page is ready     */

    /* this reveals the default page */
    if (localStorage.userid){
        $("#div-clientlist").show() //this is "home"
        clientListController();
        $(".secured").removeClass("locked");        
        $(".secured").addClass("unlocked");
        $("#scanuserid").val(localStorage.userid);
    }
    else {
        $("#div-login").show();
        $(".secured").removeClass("unlocked");
        $(".secured").addClass("locked");
    }

    /* ------------------  basic navigation -----------------*/
    /* this controls navigation - show / hide pages as needed */

    /* what happens if any of the navigation links are clicked? */
    $('.nav-link').click( () => {
        $("html, body").animate({ scrollTop: "0px" }); /* scroll to top of page */
        $(".navbar-collapse").collapse('hide'); /* explicitly collapse the navigation menu */
    });

    /* what happens if the login button is clicked? */
    $('#btnLogin').click( () => {
        loginController();
    });

    /* what happens if the logout link is clicked? */
    $('#link-logout').click( () => {
        // First ... remove userid from localstorage
        localStorage.removeItem("userid");
        // Now force the page to refresh
        window.location = "./index.html";
    });

    $('#btnLogout').click( () => {
        // First ... remove userid from localstorage
        localStorage.removeItem("userid");
        // Now force the page to refresh
        window.location = "./index.html";
    });

    $('#btnPlaceholder').click( () => {
        $(".content-wrapper").hide();  
        $("#div-Scan").show();
    });

    $('#btnNext').click(() => {
        scanController();
        $(".content-wrapper").hide();
        $("#div-confirm").show();
    });

    $('#btnHome2').click(() => {
        $('.content-wrapper').hide();
        $('#div-clientlist').show();
    })

    $('#btnHome').click(() => {
        $('.content-wrapper').hide();
        $('#div-clientlist').show();
    })

    $('#btnHome3').click(() => {
        $('.content-wrapper').hide();
        $('#div-clientlist').show();
    })

    $('#btnScanAnother').click( () => {
        $(".content-wrapper").hide();  
        $("#div-Scan").show();
    });

    $('#link-movies').click( () => {
        $(".content-wrapper").hide();  
        $("#div-movielist").show();
        moviesListController();
    });

    $('#link-home').click( () => {
        $(".content-wrapper").hide();  
        $("#div-clientlist").show();
    });

    $('#btnChoose').click( () => {
        $("#btnChoose").hide();    
        stopCamera();
        $("#btnNext").show();
        $("html, body").animate({ scrollTop: "0px" });
    });

    $('#btnReset').click( () => {
        resetController();
    });

    function filterByGenre() {
        const genre = $('#genre-select').val();
        $('.movie-card').each(function() {
            const cardGenres = $(this).find('p:contains("Genre:")').text().split(': ')[1];
            if (!genre || cardGenres.includes(genre)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
    
    function updateSorting() {
        const sortBy = $('#sort-select').val(); // Gets 'rating' or 'votes'
        const $container = $('#movie-list');
        const $items = $('.movie-card').get();
        
        $items.sort((a, b) => {
            // Extract either rating or votes value
            const aValue = sortBy === 'rating' ? 
                parseFloat($(a).find('p:contains("Rating:")').text().split(' ')[1]) :
                parseInt($(a).find('p:contains("votes")').text().match(/\d+/)[0]);
                
            const bValue = sortBy === 'rating' ? 
                parseFloat($(b).find('p:contains("Rating:")').text().split(' ')[1]) :
                parseInt($(b).find('p:contains("votes")').text().match(/\d+/)[0]);
            
            return bValue - aValue; // Descending order (highest first)
        });
        
        $.each($items, (i, item) => {
            $container.append(item); // Re-insert sorted items
        });
    }
    
    
    // Add event listeners
    $('#genre-select').change(filterByGenre);
    $('#sort-select').change(updateSorting);

}); /* end the document ready event*/