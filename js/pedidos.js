document.addEventListener("DOMContentLoaded", function () {

    const menus = document.querySelectorAll(".side-menu");

    M.Sidenav.init(menus, { edge: "right" });

});

let contenidolista = "";

// Cargar platillos
db.collection("platillos").onSnapshot((snapshot) => {

    contenidolista = `
        <option value="" disabled selected>
            Seleccione un platillo
        </option>
    `;

    snapshot.forEach((doc) => {

        const platillo = doc.data();

        contenidolista += `
            <option value="${platillo.nombre}">
                ${platillo.nombre}
            </option>
        `;

    });

    document.getElementById("listaplatillos").innerHTML = contenidolista;

    const elems = document.querySelectorAll("select");

    M.FormSelect.init(elems);

});


// Guardar pedido

const formulario = document.getElementById("formPedido");

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    const pedido = {

        platillo: document.getElementById("listaplatillos").value,

        nombre: document.getElementById("nombre").value,

        direccion: document.getElementById("direccion").value,

        fecha: firebase.firestore.Timestamp.now()

    };

    db.collection("pedidos")

    .add(pedido)

    .then(function(){

        alert("Pedido guardado correctamente");

        formulario.reset();

        const elems = document.querySelectorAll("select");

        M.FormSelect.init(elems);

    })

    .catch(function(error){

        console.log(error);

        alert("Error al guardar el pedido");

    });

});


// Botón cancelar

formulario.addEventListener("reset", function(){

    setTimeout(function(){

        const elems = document.querySelectorAll("select");

        M.FormSelect.init(elems);

    },100);

 
});
  document.getElementById("btnUbicacion").addEventListener("click", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(exito, error);
    } else {
        alert("Tu dispositivo no soporta geolocalización.");
    }
});

function exito(posicion) {

    let latitud = posicion.coords.latitude;
    let longitud = posicion.coords.longitude;

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`, {
        headers: {
            "User-Agent": "UberEatsbaruch (barjadu02@gmail.com)"
        }
    })
    .then(respuesta => respuesta.json())
    .then(data => {

        // Dirección completa
        document.getElementById("direccion").value = data.display_name;

        // para campo de ubi un campo de ubicación
        if (document.getElementById("ubicacion")) {

            let ciudad =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.municipality ||
                data.address.county ||
                "";

            let estado = data.address.state || "";
            let pais = data.address.country || "";

            document.getElementById("ubicacion").value = `${ciudad}, ${estado}, ${pais}`;
        }

    })
    .catch(error => {
        console.log(error);
        alert("No se pudo obtener la dirección.");
    });

}

function error(err) {
    alert("No se pudo obtener la ubicación.\n\n" + err.message);

}
