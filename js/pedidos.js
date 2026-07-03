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
        alert("Tu dispositivo no tiene capacidad para obtener la ubi.");
    }
});

function exito(posicion) {
   let latitud = posicion.coords.latitude;
   let longitud = posicion.coords.longitude;
   fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`),{
   headers:{
    'user-agent'; 'UberEatsbaruch (baruchdduarte@gmail.com)'
   }
})

   .then(respuesta => respuesta.json())
   .then(data => alert(data.display_name))
   .catch(error => console.error(error));
}
