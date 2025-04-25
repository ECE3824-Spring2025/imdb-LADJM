"use strict";

/* SOME CONSTANTS */
let endpoint01 = "https://cl8tnekaej.execute-api.us-east-1.amazonaws.com/default/Website"; 
let html5QrcodeScanner;

/* SUPPORTING FUNCTIONS */
let onScanSuccess = (qrCodeMessage) => {
    $("#div-output").show();
    let itemcode = qrCodeMessage.substr(0, 11);
    let name = qrCodeMessage.substr(11);
    $("#scanname").html(name);
    $("#scanitemcode").val(itemcode);
    console.log(itemcode);
    console.log(name);
    $("html, body").animate({ scrollTop: "0px" });
};

let onScanError = (errorMessage) => {
    // Error handling for scanner
};

let startCamera = async () => {
    await html5QrcodeScanner.render(onScanSuccess, onScanError);
    await $("#reader").show();
};

let stopCamera = async () => {
    await html5QrcodeScanner.clear();
    await $("#reader").hide();
};

let checkOutButtonController = (x) => {
    $("#scanclientid").val(x);
    $(".content-wrapper").hide();
    $("#div-Scan").show();
    saveLastSection("#div-Scan");
    startCamera();
};

let scanController = () => {
    let userId = $("#scanuserid").val();
    let clientId = $("#scanclientid").val();
    let itemCode = $("#scanitemcode").val();
    if (userId === "" || clientId === "" || itemCode === "") {
        $('#message-scan').html('Be sure to fill in UserID, ClientID, and Item Code.');
        $('#message-scan').addClass("alert alert-danger text-center");
        return;
    }

    let the_serialized_data = $("#form-scan").serialize();
    console.log(the_serialized_data);

    $.ajax({
        url: endpoint01 + "/scancheck",
        method: "POST",
        data: the_serialized_data,
        success: (results) => {
            console.log(results);
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
        error: (data) => {
            console.log(data);
            $('#message-scan').html("Server error. Please try again.").addClass("alert alert-danger text-center");
        }
    });
    $("html, body").animate({ scrollTop: "0px" });
};

let moviesListController = () => {
    $('#movie-list').html(""); // Clear previous content
    
    $.ajax({
        url: endpoint01 + "/movies",
        method: "GET",
        success: (results) => {
            console.log(results);
            if (results.length === 0) {
                $('#movie-list').html("<p>No movies found.</p>");
            } else {
                results.forEach(movie => {
                    let movieCard = `
                    <div class="favorite-card" data-movie-id="${movie.movie_id}">
                        <div class="movie-details">
                            <h3>${movie.title} (${movie.year})</h3>
                            <!-- other details -->
                            <button class="btn btn-danger btn-remove-favorite" 
                                    data-movie-id="${movie.movie_id}">
                                Remove from Favorites
                            </button>
                        </div>
                    </div>`;
                    $('#movie-list').append(movieCard);
                });
            }
        },
        error: (error) => {
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
            console.log('API Response:', results); // Debugging line
            $('#movie-list').empty();
            
            if (!results || results.length === 0) {
                $('#movie-list').html('<div class="alert alert-info">No movies found.</div>');
                return;
            }
            
            results.forEach(movie => {
                // Safely handle potentially missing properties
                const title = movie.primaryTitle || movie.title || 'Unknown Title';
                const year = movie.startYear || movie.year || 'Unknown Year';
                const genres = movie.genres || 'Unknown Genre';
                const rating = movie.averageRating || movie.rating || 'N/A';
                const votes = movie.numVotes || movie.votes || 'N/A';
                const movieId = movie.movie_id || movie.id || '';
                
                $('#movie-list').append(`
                    <div class="movie-card">
                        <h2>${title}</h2>
                        <p><strong>Year:</strong> ${year}</p>
                        <p><strong>Genre:</strong> ${genres}</p>
                        <p><strong>Rating:</strong> ${rating} (${votes} votes)</p>
                        <button class="btn btn-primary btn-add-favorite" 
                                data-movie-id="${movieId}">
                            Add to Favorites
                        </button>
                    </div>
                `);
            });
        },
        error: (error) => {
            console.error('Error loading movies:', error);
            $('#movie-list').html('<div class="alert alert-danger">Error loading movies. Please try again.</div>');
        }
    });
}

let clientListController = () => {
    $('#table-clients').html("<tr> <th>Client Name</th>  <th>Options</th>  </tr>");
    $('#message-clientlist').html("");
    $('#message-clientlist').removeClass();

    $.ajax({
        url: endpoint01 + "/clients",
        method: "GET",
        success: (results) => {
            console.log(results);
            for(let i = 0; i < results.length; i++) {
                let clientname = results[i]['lastname'] + ", " + results[i]['firstname'];
                let clientid = results[i]['clientid'];
                let txttablerow = `<tr>
                    <td>${clientname}</td>
                    <td><input type="button" onclick="checkOutButtonController(${clientid})" class="btn btn-primary" value="Check Out"></td>
                </tr>`;
                $('#table-clients').append(txttablerow);
            }
        },
        error: (data) => {
            console.log(data);
            $('#message-scan').html("Scan failed. Try again.").addClass("alert alert-danger");
        }
    });
};

let loginController = () => {
    $('#login_message').html("");
    $('#login_message').removeClass();

    let username = $("#username").val();
    let password = $("#password").val();
    if (username == "" || password == "") {
        $('#login_message').html('The user name and password are both required.');
        $('#login_message').addClass("alert alert-danger text-center");
        return;
    }
  
    let the_serialized_data = $("#form-login").serialize();
    console.log(the_serialized_data);

    $.ajax({
        url: endpoint01 + "/auth",
        method: "POST",
        data: the_serialized_data,
        // In loginController()
        success: (results) => {
            console.log(results);
            if (results.length == 0) {
                localStorage.removeItem("username");
                $('#login_message').html("Login Failed. Try again.").addClass("alert alert-danger text-center");
            } else {
                localStorage.username = results[0]["username"]; // Store username
                localStorage.userid = results[0]["userid"]; // Keep userid if needed elsewhere
                $('#login_message').html('');
                $('#login_message').removeClass();
                $('.secured').removeClass('locked').addClass('unlocked');
                $('#div-login').hide();
                $('#div-clientlist').show();
                clientListController();
                $("#scanuserid").val(localStorage.userid);
            }
        },
        error: (data) => {
            console.log(data);
            $('#login_message').html("Server error. Please try again.").addClass("alert alert-danger text-center");
        }
    });
};

let signUpController = () => {
    $('#signup_message').html("");
    $('#signup_message').removeClass();
    
    let username = $("#signup-username").val();
    let email = $("#signup-email").val();
    let password = $("#signup-password").val();
    
    if (!username || !email || !password) {
        $('#signup_message').html('All fields are required.');
        $('#signup_message').addClass("alert alert-danger text-center");
        return;
    }
    
    let userData = {
        username: username,
        email: email,
        password: password
    };
    
    $.ajax({
        url: endpoint01 + "/signup",
        method: "POST",
        data: userData,
        success: (results) => {
            console.log(results);
            if (results.success) {
                $('#signup_message').html("Account created successfully! Please log in.");
                $('#signup_message').addClass("alert alert-success text-center");
                setTimeout(() => {
                    $("#div-signup").hide();
                    $("#div-login").show();
                }, 2000);
            } else {
                $('#signup_message').html(results.message || "Signup failed. Please try again.");
                $('#signup_message').addClass("alert alert-danger text-center");
            }
        },
        error: (error) => {
            console.log(error);
            $('#signup_message').html("Error connecting to server. Please try again.");
            $('#signup_message').addClass("alert alert-danger text-center");
        }
    });
};


let favoritesController = () => {
    $('#favorites-list').empty();
    $('#no-favorites').hide();
    $('#favorites-login').hide();

    if (!localStorage.username) {
        $('#favorites-login').show();
        return;
    }

    $.ajax({
        url: endpoint01 + "/getfavorites",
        method: "GET",
        data: { username: localStorage.username },
        success: (results) => {
            if (results.favorites && results.favorites.length === 0) {
                $('#no-favorites').show();
            } else if (results.favorites) {
                results.favorites.forEach(movie => {
                    let movieCard = `
                        <div class="favorite-card" data-movie-id="${movie.movie_id}">
                            <div class="movie-details">
                                <h3>${movie.title} (${movie.year})</h3>
                                <p><strong>Genre:</strong> ${movie.genres}</p>
                                <p><strong>Rating:</strong> ${movie.rating} (${movie.votes} votes)</p>
                                <p><strong>Added:</strong> ${new Date(movie.favorited_at).toLocaleDateString()}</p>
                                <button class="btn btn-danger btn-remove-favorite" 
                                        data-movie-id="${movie.movie_id}">
                                    Remove from Favorites
                                </button>
                            </div>
                        </div>`;
                    $('#favorites-list').append(movieCard);
                });
            }
        },
        error: (error) => {
            console.error("Error loading favorites:", error);
            $('#favorites-list').html(`
                <div class="alert alert-danger">
                    Error loading favorites. ${error.responseJSON?.message || ''}
                </div>
            `);
        }
    });
};

function restoreLastSection() {
    let sectionId = localStorage.getItem("lastSection");
    if (sectionId && $(sectionId).length) {
        $(".content-wrapper").hide();
        $(sectionId).show();

        if (sectionId === "#div-Scan") {
            startCamera();
        } else if (sectionId === "#div-clientlist") {
            clientListController();
        } else if (sectionId === "#div-movielist") {
            moviesListController();
        }

        $("#scanuserid").val(localStorage.userid);
        return true;
    }
    return false;
}

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
// Define this ABOVE your $(document).ready() function
function saveLastSection(sectionId) {
    localStorage.setItem("lastSection", sectionId);
}

function restoreLastSection() {
    const sectionId = localStorage.getItem("lastSection");
    if (sectionId) {
        $(".content-wrapper").hide();
        $(sectionId).show();
        return true;
    }
    return false;
}

/* Document Ready */
$(document).ready(() => {
    // [ADD THIS AT THE VERY BEGINNING]
    // Clear any existing user session on page load if you want to force logout
    // localStorage.removeItem("userid"); // Uncomment if you want to force logout on every page load
    loadMovies();

    let loc = window.location.href+'';
    if (loc.indexOf('http://')==0){
        window.location.href = loc.replace('http://','https://');
    }

    html5QrcodeScanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: {width: 150, height: 150},
        rememberLastUsedCamera: false,
    });

    // [MODIFY THIS SECTION TO BE MORE EXPLICIT]
    if (localStorage.userid) {
        $(".secured").removeClass("locked").addClass("unlocked");
        if (!restoreLastSection()) {
            $("#div-clientlist").show();
            saveLastSection("#div-clientlist");
            clientListController();
        }
    } else {
        // [ENHANCE THIS ELSE BLOCK]
        localStorage.removeItem("userid"); // Clear any residual data
        localStorage.removeItem("lastSection"); // Clear navigation history
        $(".content-wrapper").hide();
        $("#div-login").show();
        $(".secured").removeClass("unlocked").addClass("locked");
    }

    $('.nav-link').click(() => {
        $("html, body").animate({ scrollTop: "0px" });
        $(".navbar-collapse").collapse('hide');
    });

    $('#genre-select, #sort-select').change(() => {
        loadMovies(
            $('#genre-select').val(),
            $('#sort-select').val()
        );
    });

    $('#btnLogin').click(() => {
        loginController();
    });


    /* what happens if the logout link is clicked? */
    $('#link-logout').click(() => {
        // First ... remove userid from localstorage
        localStorage.removeItem("userid");
        // Hide all content wrappers and show login
        $(".content-wrapper").hide();
        $("#div-login").show();
        // Reset secured elements
        $(".secured").removeClass("unlocked");
        $(".secured").addClass("locked");
    });

    $('#btnLogout').click(() => {
        // First ... remove userid from localstorage
        localStorage.removeItem("userid");
        // Hide all content wrappers and show login
        $(".content-wrapper").hide();
        $("#div-login").show();
        // Reset secured elements
        $(".secured").removeClass("unlocked");
        $(".secured").addClass("locked");
    });

    $('#btnPlaceholder').click(() => {
        $(".content-wrapper").hide();  
        $("#div-Scan").show();
        saveLastSection("#div-Scan");
    });

    $('#btnNext').click(() => {
        scanController();
        $(".content-wrapper").hide();
        $("#div-confirm").show();
        saveLastSection("#div-confirm");
    });

    $('#btnHome, #btnHome2, #btnHome3').click(() => {
        $(".content-wrapper").hide();
        $("#div-clientlist").show();
        saveLastSection("#div-clientlist");
    });

    $('#link-movies').click(() => {
        $(".content-wrapper").hide();
        $("#div-movielist").show();
        saveLastSection("#div-movielist");
        moviesListController();
    });

    $('#link-home').click(() => {
        $(".content-wrapper").hide();  
        $("#div-favorites").show();
        favoritesController();
    });

    $('#btnChoose').click(() => {
        $("#btnChoose").hide();    
        stopCamera();
        $("#btnNext").show();
        $("html, body").animate({ scrollTop: "0px" });
    });

    $('#btnReset').click(() => resetController());

    $('#genre-select').change(filterByGenre);
    $('#sort-select').change(updateSorting);

    $('#btnShowSignUp').click(() => {
        $(".content-wrapper").hide();
        $("#div-signup").show();
    });

    $('#btnSignUp').click(() => {
        signUpController();
    });

    $('#link-back-to-login').click(() => {
        $(".content-wrapper").hide();
        $("#div-login").show();
    });

    $('#btnAddFavorites').click(() => {
        $(".content-wrapper").hide();  
        $("#div-movielist").show();
        moviesListController();
    });

    $(document).on("click", ".btn-add-favorite", function () {
        const movieId = $(this).data("movie-id");
        $.ajax({
            url: endpoint01 + "/addfavorite",
            method: "POST",
            data: {
                username: localStorage.username,
                movie_id: movieId
            },
            success: (res) => {
                console.log("Added to favorites:", res);
                alert("Movie added to favorites!");
                favoritesController(); // refresh favorite list if visible
            },
            error: (err) => {
                console.error("Add favorite failed", err);
                alert("Failed to add to favorites.");
            }
        });
    });
    
    $(document).on("click", ".btn-remove-favorite", function () {
        const movieId = $(this).data("movie-id");
        $.ajax({
            url: endpoint01 + "/removefavorite",
            method: "POST",
            data: {
                username: localStorage.username,
                movie_id: movieId
            },
            success: (res) => {
                console.log("Removed from favorites:", res);
                alert("Movie removed from favorites.");
                favoritesController(); // refresh favorite list
            },
            error: (err) => {
                console.error("Remove favorite failed", err);
                alert("Failed to remove from favorites.");
            }
        });
    });    
});
