"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://cl8tnekaej.execute-api.us-east-1.amazonaws.com/default/Website"; 

let html5QrcodeScanner;

/* SUPPORTING FUNCTIONS */
let onScanSuccess = (qrCodeMessage) => {
    $("#div-output").show();
    let itemcode = qrCodeMessage.substr(0,11);
    let name = qrCodeMessage.substr(11);
    $("#scanname").html(name);
    $("#scanitemcode").val(itemcode);
    console.log(itemcode);
    console.log(name);
    $("html, body").animate({ scrollTop: "0px" });
}

let onScanError = (errorMessage) => {
    // Error handling for scanner
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
        return;
    }

    let the_serialized_data = $("#form-scan").serialize();
    console.log(the_serialized_data);

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
                $('#div-scan').hide();
                $('#div-confirm').show();
            }          
        },
        "error" : (data)=>{
            console.log(data)
        }
    });
    $("html, body").animate({ scrollTop: "0px" });
};

let moviesListController = () => {
    $('#movie-list').html("");

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

function loadMovies(genre = '', sort = 'rating') {
    $.ajax({
        url: `${endpoint01}/movies?genre=${encodeURIComponent(genre)}&sort=${sort}`,
        method: "GET",
        success: (results) => {
            $('#movie-list').empty();
            results.forEach(movie => {
                $('#movie-list').append(`
                    <div class="movie-card">
                        <h2>${movie.primaryTitle}</h2>
                        <p><strong>Year:</strong> ${movie.startYear}</p>
                        <p><strong>Genre:</strong> ${movie.genres}</p>
                        <p><strong>Rating:</strong> ${movie.averageRating} (${movie.numVotes} votes)</p>
                    </div>
                `);
            });
        }
    });
}

let clientListController = () => {
    $('#table-clients').html("<tr> <th>Client Name</th>  <th>Options</th>  </tr>");
    $('#message-clientlist').html("");
    $('#message-clientlist').removeClass();

    $.ajax({
        "url": endpoint01 + "/clients",
        "method": "GET",
        "success": (results) => {
            console.log(results);
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
    $('#login_message').html("");
    $('#login_message').removeClass();

    let username = $("#username").val();
    let password = $("#password").val();
    if (username == "" || password == ""){
        $('#login_message').html('The user name and password are both required.');
        $('#login_message').addClass("alert alert-danger text-center");
        return;
    }
   
    let the_serialized_data = $("#form-login").serialize();
    console.log(the_serialized_data);

    $.ajax({
        "url": endpoint01 + "/auth",
        "method": "POST",
        "data": the_serialized_data,
        "success": (results)=>{
            console.log(results)
            if (results.length == 0) {
                localStorage.removeItem("userid");
                $('#login_message').html("Login Failed. Try again.");
                $('#login_message').addClass("alert alert-danger text-center");
            } else {
                localStorage.userid = results[0]["userid"];
       
                $('#login_message').html('');
                $('#login_message').removeClass();
                $('.secured').removeClass('locked');
                $('.secured').addClass('unlocked');
                $('#div-login').hide();
                $('#div-clientlist').show();
                clientListController();
                $("#scanuserid").val(localStorage.userid);
            }
        },
        "error": (data)=>{
            console.log(data)
        }
    });

    $("html, body").animate({ scrollTop: "0px" });
};

let signupController = () => {
    $('#signup_message').html("");
    $('#signup_message').removeClass();

    let email = $("#signup-email").val();
    let password = $("#signup-password").val();
    let firstname = $("#signup-firstname").val();
    let lastname = $("#signup-lastname").val();

    if (!email || !password || !firstname || !lastname) {
        $('#signup_message').html('All fields are required.');
        $('#signup_message').addClass("alert alert-danger text-center");
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        $('#signup_message').html('Please enter a valid email address.');
        $('#signup_message').addClass("alert alert-danger text-center");
        return;
    }

    let userData = {
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname
    };

    $.ajax({
        "url": endpoint01 + "/signup",
        "method": "POST",
        "data": userData,
        "success": (results) => {
            console.log(results);
            if (results.success) {
                $('#signup_message').html("Account created successfully! Please log in.");
                $('#signup_message').addClass("alert alert-success text-center");
                
                $("#signup-email").val("");
                $("#signup-password").val("");
                $("#signup-firstname").val("");
                $("#signup-lastname").val("");
                
                setTimeout(() => {
                    $("#div-signup").hide();
                    $("#div-login").show();
                }, 2000);
            } else {
                $('#signup_message').html(results.message || "Signup failed. Please try again.");
                $('#signup_message').addClass("alert alert-danger text-center");
            }
        },
        "error": (error) => {
            console.log(error);
            $('#signup_message').html("Error connecting to server. Please try again.");
            $('#signup_message').addClass("alert alert-danger text-center");
        }
    });
};

//document ready section
$(document).ready( () => {
    loadMovies();

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
    if (localStorage.userid){
        $("#div-clientlist").show()
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
    $('.nav-link').click( () => {
        $("html, body").animate({ scrollTop: "0px" });
        $(".navbar-collapse").collapse('hide');
    });

    $('#genre-select, #sort-select').change(() => {
        loadMovies(
            $('#genre-select').val(),
            $('#signup-select').val()
        );
    });

    $('#btnLogin').click( () => {
        loginController();
    });

    $('#link-logout').click( () => {
        localStorage.removeItem("userid");
        window.location = "./index.html";
    });

    $('#btnLogout').click( () => {
        localStorage.removeItem("userid");
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

    // Show signup form when link is clicked
    $('#link-signup').click(() => {
        $("#div-login").hide();
        $("#div-signup").show();
    });

    // Show login form when link is clicked
    $('#link-back-to-login').click(() => {
        $("#div-signup").hide();
        $("#div-login").show();
    });

    // Handle create account button click
    $('#btnCreateAccount').click(() => {
        signupController();
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
        const sortBy = $('#sort-select').val();
        const $container = $('#movie-list');
        const $items = $('.movie-card').get();
        
        $items.sort((a, b) => {
            const aValue = sortBy === 'rating' ? 
                parseFloat($(a).find('p:contains("Rating:")').text().split(' ')[1]) :
                parseInt($(a).find('p:contains("votes")').text().match(/\d+/)[0]);
                
            const bValue = sortBy === 'rating' ? 
                parseFloat($(b).find('p:contains("Rating:")').text().split(' ')[1]) :
                parseInt($(b).find('p:contains("votes")').text().match(/\d+/)[0]);
            
            return bValue - aValue;
        });
        
        $.each($items, (i, item) => {
            $container.append(item);
        });
    }
    
    $('#genre-select').change(filterByGenre);
    $('#sort-select').change(updateSorting);
});