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
                    <div class="movie-card">
                        <div class="movie-details">
                            <h2>${movie.primaryTitle}</h2>
                            <p><strong>Year:</strong> ${movie.startYear}</p>
                            <p><strong>Genre:</strong> ${movie.genres}</p>
                            <p><strong>Rating:</strong> ${movie.averageRating} (${movie.numVotes} votes)</p>
                            <button class="btn btn-success add-favorite" 
                                    data-item-id="${movie.tconst}"> <!-- Changed to tconst -->
                                Add to Favorites
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

let addFavorite = async (res, body) => {
    const { username, item_id } = body;

    // Validation
    if (!username || !item_id) {
        return formatres(res, { message: "username and item_id are required" }, 400);
    }

    try {
        // Check if user exists
        const [user] = await connection.execute(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );
        
        if (user.length === 0) {
            return formatres(res, { message: "User not found" }, 404);
        }

        // Check if movie exists
        const [movie] = await connection.execute(
            'SELECT * FROM movies WHERE tconst = ?',
            [item_id]
        );
        
        if (movie.length === 0) {
            return formatres(res, { message: "Movie not found" }, 404);
        }

        // Add to favorites
        await connection.execute(
            'INSERT INTO favorites (username, item_id) VALUES (?, ?)',
            [username, item_id]
        );

        return formatres(res, { 
            message: "Favorite added successfully",
            favorite: { username, item_id }
        }, 201);

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return formatres(res, { message: "Movie is already in favorites" }, 409);
        }
        console.error("Database error:", error);
        return formatres(res, { message: "Database error" }, 500);
    }
};

let removeFromFavorites = (movieId) => {
    $.ajax({
        url: endpoint01 + "/deletefavorite",
        method: "DELETE",
        data: {
            username: localStorage.username,
            item_id: movieId
        },
        success: (result) => {
            if (result.message.includes("successfully")) {
                favoritesController(); // Refresh favorites list
            } else {
                alert(result.message);
            }
        },
        error: (error) => {
            console.error(error);
            alert("Error removing from favorites");
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
                results.favorites.forEach(item => {
                    let itemCard = `
                        <div class="favorite-card" data-item-id="${item.item_id}">
                            <div class="item-details">
                                <h3>${item.name}</h3>
                                <p>${item.description}</p>
                                <p>Value: $${item.estimatedvalue}</p>
                                <button class="btn btn-danger btn-remove-favorite" 
                                        data-item-id="${item.item_id}">
                                    Remove
                                </button>
                            </div>
                        </div>`;
                    $('#favorites-list').append(itemCard);
                });
            }
        },
        error: (error) => {
            console.error(error);
            $('#favorites-list').html("<p class='alert alert-danger'>Error loading favorites.</p>");
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

    $(document).on('click', '.btn-remove-favorite', function() {
        let itemId = $(this).data('item-id');
        removeFromFavorites(itemId);
    });

    $(document).on('click', '.add-favorite', function() {
        let itemId = $(this).data('item-id');
        addToFavorites(itemId);
    });

    $('#btnFavoritesLogin').click(() => {
        $(".content-wrapper").hide();
        $("#div-login").show();
    });
});
