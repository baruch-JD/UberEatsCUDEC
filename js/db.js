// ============================================
// VARIABLES DE LA CÁMARA
// ============================================

let streamCamara = null;

let imagenCapturada = null;


// ============================================
// MOSTRAR PLATILLOS EN TIEMPO REAL
// ============================================

db.collection("platillos").onSnapshot((snapshot) => {

    snapshot.docChanges().forEach((registro) => {


        // ====================================
        // PLATILLO AGREGADO
        // ====================================

        if (registro.type === "added") {

            mostrarPlatillo(
                registro.doc.data(),
                registro.doc.id
            );

        }


        // ====================================
        // PLATILLO MODIFICADO
        // ====================================

        if (registro.type === "modified") {

            actualizarPlatillo(
                registro.doc.data(),
                registro.doc.id
            );

        }


        // ====================================
        // PLATILLO ELIMINADO
        // ====================================

        if (registro.type === "removed") {

            const tarjeta =
                document.getElementById(
                    registro.doc.id
                );

            if (tarjeta) {

                tarjeta.remove();

            }

        }

    });

});


// ============================================
// FORMULARIO
// ============================================

const formularioAgregar =
    document.querySelector("form");


formularioAgregar.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();


        // ====================================
        // OBTENER DATOS
        // ====================================

        const nombre =
            document.getElementById("title").value;


        const ingredientes =
            document.getElementById(
                "Ingredientes"
            ).value;


        const precio =
            document.getElementById(
                "Precio"
            ).value;


        // ====================================
        // COMPROBAR FOTO
        // ====================================

        if (!imagenCapturada) {

            alert(
                "Primero debes tomar una foto del platillo"
            );

            return;

        }


        try {


            // =================================
            // GUARDAR EN FIRESTORE
            // =================================

            await db
                .collection("platillos")
                .add({

                    nombre: nombre,

                    ingredientes: ingredientes,

                    precio: precio,

                    imagen: imagenCapturada,

                    fecha:
                        firebase.firestore
                        .FieldValue
                        .serverTimestamp()

                });


            // =================================
            // LIMPIAR FORMULARIO
            // =================================

            document.getElementById(
                "title"
            ).value = "";


            document.getElementById(
                "Ingredientes"
            ).value = "";


            document.getElementById(
                "Precio"
            ).value = "";


            // =================================
            // LIMPIAR FOTO
            // =================================

            imagenCapturada = null;


            const foto =
                document.getElementById("foto");


            foto.src = "";

            foto.style.display = "none";


            // =================================
            // CERRAR CÁMARA
            // =================================

            cerrarCamara();


            // =================================
            // CERRAR FORMULARIO
            // =================================

            const sidenav =
                M.Sidenav.getInstance(
                    document.getElementById(
                        "side-form"
                    )
                );


            if (sidenav) {

                sidenav.close();

            }


            alert(
                "Platillo agregado correctamente"
            );


        } catch (error) {


            console.error(error);


            alert(
                "Error al guardar el platillo: " +
                error.message
            );

        }

    }
);


// ============================================
// MOSTRAR PLATILLO
// ============================================

function mostrarPlatillo(
    platillo,
    id
) {


    const tarjeta =
        document.createElement("div");


    tarjeta.className =
        "recipe-card";


    tarjeta.id = id;


    // ========================================
    // IMAGEN
    // ========================================

    let imagenHTML = "";


    if (platillo.imagen) {

        imagenHTML = `

            <div class="recipe-image">

                <img
                    src="${platillo.imagen}"
                    alt="${platillo.nombre}"
                    style="
                        width:100%;
                        max-height:250px;
                        object-fit:cover;
                        border-radius:10px;
                    "
                >

            </div>

        `;

    }


    // ========================================
    // CONTENIDO
    // ========================================

    tarjeta.innerHTML = `

        ${imagenHTML}


        <div class="recipe-details">

            <div class="recipe-title">

                ${platillo.nombre}

            </div>


            <div class="recipe-ingredients">

                ${platillo.ingredientes}

            </div>


            <div class="recipe-price">

                $${platillo.precio}

            </div>

        </div>


        <div class="recipe-delete">

            <i
                class="material-icons"
                data-id="${id}">

                delete_outline

            </i>

        </div>

    `;


    document
        .querySelector(".recipes")
        .appendChild(tarjeta);

}


// ============================================
// ACTUALIZAR PLATILLO
// ============================================

function actualizarPlatillo(
    platillo,
    id
) {


    const tarjeta =
        document.getElementById(id);


    if (!tarjeta) {

        return;

    }


    // Nombre
    const titulo =
        tarjeta.querySelector(
            ".recipe-title"
        );


    if (titulo) {

        titulo.innerHTML =
            platillo.nombre;

    }


    // Ingredientes
    const ingredientes =
        tarjeta.querySelector(
            ".recipe-ingredients"
        );


    if (ingredientes) {

        ingredientes.innerHTML =
            platillo.ingredientes;

    }


    // Precio
    const precio =
        tarjeta.querySelector(
            ".recipe-price"
        );


    if (precio) {

        precio.innerHTML =
            "$" + platillo.precio;

    }


    // ========================================
    // ACTUALIZAR IMAGEN
    // ========================================

    let imagen =
        tarjeta.querySelector(
            ".recipe-image img"
        );


    if (platillo.imagen) {


        if (!imagen) {


            const contenedor =
                document.createElement("div");


            contenedor.className =
                "recipe-image";


            contenedor.innerHTML = `

                <img
                    src="${platillo.imagen}"
                    alt="${platillo.nombre}"
                    style="
                        width:100%;
                        max-height:250px;
                        object-fit:cover;
                        border-radius:10px;
                    "
                >

            `;


            tarjeta.prepend(
                contenedor
            );


        } else {

            imagen.src =
                platillo.imagen;

        }

    }

}


// ============================================
// ELIMINAR PLATILLO
// ============================================

document
    .querySelector(".recipes")
    .addEventListener(
        "click",
        function (e) {


            if (
                e.target.classList.contains(
                    "material-icons"
                )
            ) {


                const id =
                    e.target.getAttribute(
                        "data-id"
                    );


                db.collection("platillos")
                    .doc(id)
                    .delete()


                    .then(function () {

                        alert(
                            "Platillo eliminado"
                        );

                    })


                    .catch(function (error) {

                        console.log(error);

                        alert(
                            "Error al eliminar"
                        );

                    });

            }

        }
    );


// ============================================
// BOTÓN TOMAR FOTO
// ============================================

document
    .getElementById("btnFoto")
    .addEventListener(
        "click",
        abrirCamara
    );


// ============================================
// ABRIR CÁMARA
// ============================================

async function abrirCamara() {


    try {


        streamCamara =
            await navigator
                .mediaDevices
                .getUserMedia({

                    video: {
                        facingMode: "environment"
                    },

                    audio: false

                });


        const video =
            document.getElementById(
                "video"
            );


        video.srcObject =
            streamCamara;


        document.getElementById(
            "camara"
        ).style.display = "block";


    } catch (error) {


        console.error(error);


        alert(
            "No se pudo abrir la cámara. " +
            "Debes permitir el acceso a la cámara."
        );

    }

}


// ============================================
// BOTÓN CAPTURAR
// ============================================

document
    .getElementById("btnCapturar")
    .addEventListener(
        "click",
        capturarFoto
    );


// ============================================
// CAPTURAR FOTO
// ============================================

function capturarFoto() {


    const video =
        document.getElementById(
            "video"
        );


    const canvas =
        document.getElementById(
            "canvas"
        );


    const foto =
        document.getElementById(
            "foto"
        );


    // ========================================
    // TAMAÑO PEQUEÑO PARA NO OCUPAR
    // DEMASIADO ESPACIO EN FIRESTORE
    // ========================================

    const anchoMaximo = 800;


    let ancho =
        video.videoWidth;


    let alto =
        video.videoHeight;


    if (ancho > anchoMaximo) {

        alto =
            alto *
            (anchoMaximo / ancho);

        ancho =
            anchoMaximo;

    }


    canvas.width =
        ancho;


    canvas.height =
        alto;


    // ========================================
    // DIBUJAR IMAGEN
    // ========================================

    const contexto =
        canvas.getContext("2d");


    contexto.drawImage(

        video,

        0,

        0,

        ancho,

        alto

    );


    // ========================================
    // CONVERTIR A BASE64
    // ========================================

    imagenCapturada =
        canvas.toDataURL(
            "image/jpeg",
            0.6
        );


    // ========================================
    // MOSTRAR VISTA PREVIA
    // ========================================

    foto.src =
        imagenCapturada;


    foto.style.display =
        "block";


    // ========================================
    // CERRAR CÁMARA
    // ========================================

    cerrarCamara();


    alert(
        "Foto capturada correctamente"
    );

}


// ============================================
// BOTÓN CERRAR CÁMARA
// ============================================

document
    .getElementById(
        "btnCerrarCamara"
    )
    .addEventListener(
        "click",
        cerrarCamara
    );


// ============================================
// CERRAR CÁMARA
// ============================================

function cerrarCamara() {


    if (streamCamara) {


        streamCamara
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );


        streamCamara = null;

    }


    const video =
        document.getElementById(
            "video"
        );


    if (video) {

        video.srcObject = null;

    }


    document.getElementById(
        "camara"
    ).style.display = "none";

}   