```javascript
let mapa = null;
let marcador = null;


document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // MENÚ LATERAL
    // =====================================

    const menu = document.querySelectorAll(".sidenav");

    if (menu.length > 0) {

        M.Sidenav.init(menu, {
            edge: "right"
        });

    }


    // =====================================
    // SELECTOR DE PLATILLOS
    // =====================================

    const selector =
        document.getElementById("platillo");


    if (selector && typeof db !== "undefined") {

        db.collection("platillos").onSnapshot(

            function (snapshot) {

                selector.innerHTML = "";

                const inicial =
                    document.createElement("option");

                inicial.value = "";
                inicial.disabled = true;
                inicial.selected = true;
                inicial.textContent =
                    "Seleccione un platillo";

                selector.appendChild(inicial);


                snapshot.forEach(function (doc) {

                    const datos = doc.data();


                    if (datos.nombre) {

                        const opcion =
                            document.createElement("option");

                        opcion.value =
                            datos.nombre;

                        opcion.textContent =
                            datos.nombre;

                        selector.appendChild(opcion);

                    }

                });


                M.FormSelect.init(
                    document.querySelectorAll("select")
                );

            },

            function (error) {

                console.error(
                    "Error cargando platillos:",
                    error
                );

            }

        );

    }


    // =====================================
    // MAPA
    // =====================================

    const elementoMapa =
        document.getElementById("mapa");


    if (
        elementoMapa &&
        typeof L !== "undefined"
    ) {

        mapa = L.map("mapa").setView(
            [19.4326, -99.1332],
            13
        );


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap contributors",
                maxZoom: 19
            }
        ).addTo(mapa);


        marcador = L.marker(
            [19.4326, -99.1332]
        ).addTo(mapa);


        // IMPORTANTE:
        // Le decimos a Leaflet que vuelva
        // a calcular el tamaño del mapa.

        setTimeout(function () {

            mapa.invalidateSize();

        }, 300);

    }


    // =====================================
    // OBTENER UBICACIÓN
    // =====================================

    const botonUbicacion =
        document.getElementById(
            "btnUbicacion"
        );


    if (botonUbicacion) {

        botonUbicacion.addEventListener(
            "click",
            function () {

                if (!navigator.geolocation) {

                    alert(
                        "Tu dispositivo no soporta geolocalización."
                    );

                    return;

                }


                navigator.geolocation.getCurrentPosition(
                    ubicacionCorrecta,
                    ubicacionError
                );

            }
        );

    }


    // =====================================
    // GUARDAR PEDIDO
    // =====================================

    const guardar =
        document.getElementById(
            "guardarPedido"
        );


    if (guardar) {

        guardar.addEventListener(
            "click",
            function () {

                const platillo =
                    document.getElementById(
                        "platillo"
                    ).value;


                const nombre =
                    document.getElementById(
                        "nombreCliente"
                    ).value.trim();


                const direccion =
                    document.getElementById(
                        "direccion"
                    ).value.trim();


                if (!platillo) {

                    alert(
                        "Seleccione un platillo."
                    );

                    return;

                }


                if (!nombre) {

                    alert(
                        "Escriba el nombre del cliente."
                    );

                    return;

                }


                if (!direccion) {

                    alert(
                        "Escriba la dirección."
                    );

                    return;

                }


                const pedido = {

                    platillo: platillo,

                    nombre: nombre,

                    direccion: direccion,

                    fecha:
                        firebase.firestore.Timestamp.now()

                };


                db.collection("pedidos")
                    .add(pedido)

                    .then(function () {

                        alert(
                            "Pedido guardado correctamente."
                        );


                        document.getElementById(
                            "nombreCliente"
                        ).value = "";


                        document.getElementById(
                            "direccion"
                        ).value = "";


                        document.getElementById(
                            "platillo"
                        ).selectedIndex = 0;


                        M.FormSelect.init(
                            document.querySelectorAll(
                                "select"
                            )
                        );


                        M.updateTextFields();

                    })

                    .catch(function (error) {

                        console.error(error);

                        alert(
                            "Error al guardar el pedido."
                        );

                    });

            }
        );

    }


    // =====================================
    // CANCELAR
    // =====================================

    const cancelar =
        document.getElementById(
            "cancelarPedido"
        );


    if (cancelar) {

        cancelar.addEventListener(
            "click",
            function () {

                document.getElementById(
                    "nombreCliente"
                ).value = "";


                document.getElementById(
                    "direccion"
                ).value = "";


                document.getElementById(
                    "platillo"
                ).selectedIndex = 0;


                M.FormSelect.init(
                    document.querySelectorAll(
                        "select"
                    )
                );


                M.updateTextFields();

            }
        );

    }

});


// =====================================
// UBICACIÓN CORRECTA
// =====================================

function ubicacionCorrecta(posicion) {

    const latitud =
        posicion.coords.latitude;


    const longitud =
        posicion.coords.longitude;


    if (mapa) {

        mapa.setView(
            [latitud, longitud],
            17
        );

    }


    if (marcador) {

        marcador.setLatLng(
            [latitud, longitud]
        );

    }


    const url =
        "https://nominatim.openstreetmap.org/reverse" +
        "?lat=" + latitud +
        "&lon=" + longitud +
        "&format=json";


    fetch(url)

        .then(function (respuesta) {

            return respuesta.json();

        })

        .then(function (datos) {

            const campo =
                document.getElementById(
                    "direccion"
                );


            if (campo) {

                campo.value =
                    datos.display_name || "";

                M.updateTextFields();

            }


            if (marcador) {

                marcador
                    .bindPopup(
                        datos.display_name ||
                        "Ubicación actual"
                    )
                    .openPopup();

            }

        })

        .catch(function (error) {

            console.error(error);

            alert(
                "No se pudo obtener la dirección."
            );

        });

}


// =====================================
// ERROR DE UBICACIÓN
// =====================================

function ubicacionError(error) {

    console.error(error);

    alert(
        "No se pudo obtener la ubicación.\n\n" +
        error.message
    );

}
```
