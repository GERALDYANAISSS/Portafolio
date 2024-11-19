const CLIENT_ID = '904002286226-f2qap016fmf3hpqn9vvbc428d814es4p.apps.googleusercontent.com';
const API_KEY = 'TU_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let authorizeButton = document.getElementById("authorize_button");
let signoutButton = document.getElementById("signout_button");

function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
    }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        authInstance.isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(authInstance.isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = "none";
        signoutButton.style.display = "block";
        listUpcomingEvents();
    } else {
        authorizeButton.style.display = "block";
        signoutButton.style.display = "none";
        document.getElementById("calendar_events").innerHTML = "";
    }
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime"
    }).then(response => {
        const events = response.result.items;
        const eventsDiv = document.getElementById("calendar_events");
        eventsDiv.innerHTML = "<h2>Próximas citas:</h2>";

        if (events.length > 0) {
            events.forEach(event => {
                const start = event.start.dateTime || event.start.date;
                eventsDiv.innerHTML += `<p><strong>${event.summary}</strong> - ${start}</p>`;
            });
        } else {
            eventsDiv.innerHTML = "<p>No hay citas próximas.</p>";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".menu-list a[href='/home']");

    if (logoutButton) {
        logoutButton.addEventListener("click", async (event) => {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace

            try {
                // Solicitar cierre de sesión al servidor
                const response = await fetch('/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (result.success) {
                    // Eliminar los datos del usuario del localStorage
                    localStorage.removeItem('user');

                    // Redirigir al home después del cierre de sesión
                    window.location.href = "/home";
                } else {
                    console.error("Error al cerrar sesión:", result.message);
                    alert("Hubo un problema al cerrar sesión. Inténtelo nuevamente.");
                }
            } catch (err) {
                console.error("Error inesperado:", err);
                alert("Hubo un error inesperado. Inténtelo nuevamente.");
            }
        });
    }
});    

handleClientLoad();
