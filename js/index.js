let contenido = "";

document.addEventListener("DOMContentLoaded", function () {

    const menus = document.querySelectorAll(".side-menu");
    M.Sidenav.init(menus, { edge: "right" });

    const forms = document.querySelectorAll(".side-form");
    M.Sidenav.init(forms, { edge: "left" });

});

function mostrarPlatillo(platillo, id) {

    contenido += `

<div class="card-panel recipe white row" id="${id}">

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
        <i class="material-icons" data-id="${id}">
            delete_outline
        </i>
    </div>

</div>

`;

    document.querySelector(".recipes").innerHTML = contenido;

}

function actualizarPlatillo(platillo, id) {

    const tarjeta = document.getElementById(id);

    if (!tarjeta) return;

    tarjeta.querySelector(".recipe-title").innerHTML = platillo.nombre;

    tarjeta.querySelector(".recipe-ingredients").innerHTML = platillo.ingredientes;

    tarjeta.querySelector(".recipe-price").innerHTML = "$" + platillo.precio;

}