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
}

let onScanError = (errorMessage) => {
    // console.log(errorMessage);
}

let startCamera = async () => {
    await html5QrcodeScanner.render(onScanSuccess, onScanError);
    await $("#reader").show();
}

let stopCamera = async () => {
    await html5QrcodeScanner.clear();
    await $("#reader").hide();
}

let checkOutButtonController = (x) => {
    $("#scanclientid").val(x);
    $(".content-wrapper").hide();
    $("#div-Scan").show();
    saveLastSection("#div-Scan");
    startCamera();
}

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
                saveLastSection("#div-confirm");
            }
        },
        error: (data) => {
            console.log(data);
        }
    });
    $("html, body").animate({ scrollTop: "0px" });
};

let moviesListController = () => {
    $('#movie-list').html("");
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
    $('#message-clientlist').html("").removeClass();

    $.ajax({
        url: endpoint01 + "/clients",
        method: "GET",
        success: (results) => {
            console.log(results);
            results.forEach(client => {
                let clientname = `${client.lastname}, ${client.firstname}`;
                let clientid = client.clientid;
                let txttablerow = `<tr>
                    <td>${clientname}</td>
                    <td><input type="button" onclick="checkOutButtonController(${clientid})" class="btn btn-primary" value="Check Out"></td>
                </tr>`;
                $('#table-clients').append(txttablerow);
            });
        },
        error: (data) => {
            console.log(data);
            $('#message-scan').html("Scan failed. Try again.").addClass("alert alert-danger");
        }
    });
}

let loginController = () => {
    $('#login_message').html("").removeClass();
    let username = $("#username").val();
    let password = $("#password").val();
    if (username === "" || password === "") {
        $('#login_message').html('The user name and password are both required.').addClass("alert alert-danger text-center");
        return;
    }

    let the_serialized_data = $("#form-login").serialize();
    console.log(the_serialized_data);

    $.ajax({
        url: endpoint01 + "/auth",
        method: "POST",
        data: the_serialized_data,
        success: (results) => {
            console.log(results);
            if (results.length == 0) {
                localStorage.removeItem("userid");
                $('#login_message').html("Login Failed. Try again.").addClass("alert alert-danger text-center");
            } else {
                localStorage.userid = results[0]["userid"];
                $('#login_message').html("").removeClass();
                $('.secured').removeClass('locked').addClass('unlocked');
                $('#div-login').hide();
                $('#div-clientlist').show();
                saveLastSection("#div-clientlist");
                clientListController();
                $("#scanuserid").val(localStorage.userid);
            }
        },
        error: (data) => {
            console.log(data);
        }
    });
    $("html, body").animate({ scrollTop: "0px" });
};

/* LocalStorage Caching Functions */
function saveLastSection(sectionId) {
    localStorage.setItem("lastSection", sectionId);
}

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

/* Document Ready */
$(document).ready(() => {
    loadMovies();

    if (window.location.href.indexOf('http://') === 0) {
        window.location.href = window.location.href.replace('http://', 'https://');
    }

    html5QrcodeScanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 150, height: 150 },
        rememberLastUsedCamera: false,
    });

    if (localStorage.userid) {
        $(".secured").removeClass("locked").addClass("unlocked");
        if (!restoreLastSection()) {
            $("#div-clientlist").show();
            saveLastSection("#div-clientlist");
            clientListController();
        }
    } else {
        $("#div-login").show();
        $(".secured").removeClass("unlocked").addClass("locked");
        localStorage.removeItem("lastSection");
    }

    $('.nav-link').click(() => {
        $("html, body").animate({ scrollTop: "0px" });
        $(".navbar-collapse").collapse('hide');
    });

    $('#genre-select, #sort-select').change(() => {
        loadMovies($('#genre-select').val(), $('#sort-select').val());
    });

    $('#btnLogin').click(() => loginController());

    $('#link-logout, #btnLogout').click(() => {
        localStorage.removeItem("userid");
        window.location = "./index.html";
    });

    $('#btnPlaceholder, #btnScanAnother').click(() => {
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

    $('#btnHome, #btnHome2, #btnHome3, #link-home').click(() => {
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

    $('#btnChoose').click(() => {
        $("#btnChoose").hide();
        stopCamera();
        $("#btnNext").show();
        $("html, body").animate({ scrollTop: "0px" });
    });

    $('#btnReset').click(() => resetController());

    $('#genre-select').change(() => filterByGenre());
    $('#sort-select').change(() => updateSorting());

    function filterByGenre() {
        const genre = $('#genre-select').val();
        $('.movie-card').each(function () {
            const cardGenres = $(this).find('p:contains("Genre:")').text().split(': ')[1];
            $(this).toggle(!genre || cardGenres.includes(genre));
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
});

