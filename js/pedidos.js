```javascript
document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // MENÚ LATERAL
    // ==========================

    const menus = document.querySelectorAll(".side-menu");

    if (menus.length > 0) {
        M.Sidenav.init(menus, {
            edge: "right"
        });
    }


    // ==========================
    // INICIALIZAR MAPA
    // ==========================

    mapa = L.map("mapa").setView(
        [19.4326, -99.1332],
        13
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap"
        }
    ).addTo(mapa);

    marcador = L.marker(
        [19.4326, -99.1332]
    ).addTo(mapa);


    // ==========================
    // CARGAR PLATILLOS
    // ==========================

    db.collection("platillos").onSnapshot(
        function (snapshot) {

            const lista =
                document.getElementById("platillo");

            if (!lista) {
                console.error(
                    "No existe el elemento con id platillo"
                );
                return;
            }

            lista.innerHTML = "";

            const opcionInicial =
                document.createElement("option");

            opcionInicial.value = "";
            opcionInicial.disabled = true;
            opcionInicial.selected = true;
            opcionInicial.textContent =
                "Seleccione un platillo";

            lista.appendChild(opcionInicial);


            snapshot.forEach(function (doc) {

                const datos = doc.data();

                if (datos.nombre) {

                    const opcion =
                        document.createElement("option");

                    opcion.value = datos.nombre;

                    opcion.textContent =
                        datos.nombre;

                    lista.appendChild(opcion);
                }

            });


            // Inicializar Materialize

            M.FormSelect.init(
                document.querySelectorAll("select")
            );

        },
        function (error) {

            console.error(
                "Error al cargar los platillos:",
                error
            );

        }
    );


    // ==========================
    // BOTÓN GUARDAR
    // ==========================

    const botonGuardar =
        document.getElementById("guardarPedido");

    if (botonGuardar) {

        botonGuardar.addEventListener(
            "click",
            function () {

                const platillo =
                    document.getElementById(
                        "platillo"
                    ).value;

                const nombre =
                    document.getElementById(
                        "nombreCliente"
                    ).value;

                const direccion =
                    document.getElementById(
                        "direccion"
                    ).value;


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
                            "Pedido guardado correctamente"
                        );


                        document.getElementById(
                            "nombreCliente"
                        ).value = "";


                        document.getElementById(
                            "direccion"
                        ).value = "";


                        const select =
                            document.getElementById(
                                "platillo"
                            );


                        select.selectedIndex = 0;


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


    // ==========================
    // BOTÓN CANCELAR
    // ==========================

    const botonCancelar =
        document.getElementById(
            "cancelarPedido"
        );

    if (botonCancelar) {

        botonCancelar.addEventListener(
            "click",
            function () {

                document.getElementById(
                    "nombreCliente"
                ).value = "";


                document.getElementById(
                    "direccion"
                ).value = "";


                const select =
                    document.getElementById(
                        "platillo"
                    );


                select.selectedIndex = 0;


                M.FormSelect.init(
                    document.querySelectorAll(
                        "select"
                    )
                );


                M.updateTextFields();

            }
        );

    }


    // ==========================
    // BOTÓN OBTENER UBICACIÓN
    // ==========================

    const btnUbicacion =
        document.getElementById(
            "btnUbicacion"
        );


    if (btnUbicacion) {

        btnUbicacion.addEventListener(
            "click",
            function () {

                if (
                    navigator.geolocation
                ) {

                    navigator.geolocation.getCurrentPosition(
                        exito,
                        error
                    );

                } else {

                    alert(
                        "Tu dispositivo no soporta geolocalización."
                    );

                }

            }
        );

    }

});


// ==========================
// VARIABLES DEL MAPA
// ==========================

let mapa;

let marcador;


// ==========================
// UBICACIÓN EXITOSA
// ==========================

function exito(posicion) {

    const latitud =
        posicion.coords.latitude;

    const longitud =
        posicion.coords.longitude;


    // Mover mapa

    mapa.setView(
        [latitud, longitud],
        17
    );


    // Mover marcador

    marcador.setLatLng(
        [latitud, longitud]
    );


    // Obtener dirección

    const url =
        "https://nominatim.openstreetmap.org/reverse" +
        "?lat=" + latitud +
        "&lon=" + longitud +
        "&format=json";


    fetch(url)

        .then(function (respuesta) {

            return respuesta.json();

        })

        .then(function (data) {

            const direccion =
                document.getElementById(
                    "direccion"
                );


            if (direccion) {

                direccion.value =
                    data.display_name || "";

                M.updateTextFields();

            }


            marcador
                .bindPopup(
                    data.display_name ||
                    "Ubicación actual"
                )
                .openPopup();

        })

        .catch(function (error) {

            console.error(error);

            alert(
                "No se pudo obtener la dirección."
            );

        });

}


// ==========================
// ERROR DE UBICACIÓN
// ==========================

function error(err) {

    alert(
        "No se pudo obtener la ubicación.\n\n" +
        err.message
    );

}
```
