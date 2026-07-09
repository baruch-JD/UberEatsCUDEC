db.collection("platillos").onSnapshot((snapshot)=>{

    snapshot.docChanges().forEach((registro)=>{

        if(registro.type==="added"){

            mostrarPlatillo(registro.doc.data(),registro.doc.id);

        }

        if(registro.type==="modified"){

            actualizarPlatillo(registro.doc.data(),registro.doc.id);

        }

        if(registro.type==="removed"){

            let tarjeta = document.getElementById(registro.doc.id);

            if(tarjeta){

                tarjeta.remove();

            }

        }

    });

});

const formularioAgregar = document.querySelector("form");

formularioAgregar.addEventListener("submit", (e) => {

    e.preventDefault();

    const platilloNuevo = {

        nombre: document.getElementById("title").value,
        ingredientes: document.getElementById("Ingredientes").value,
        precio: document.getElementById("Precio").value

    };

    db.collection("platillos")
        .add(platilloNuevo)
        .then(() => {

            document.getElementById("title").value = "";
            document.getElementById("Ingredientes").value = "";
            document.getElementById("Precio").value = "";

            M.Sidenav.getInstance(document.getElementById("side-form")).close();

            alert("Platillo agregado");

        })
        .catch((error) => {

            console.log(error);
            alert("Error al agregar el platillo");

        });

});