let contenido = "";


// ============================================
// INICIAR MATERIALIZE
// ============================================

document.addEventListener("DOMContentLoaded", function () {


    // Menú lateral
    const menus =
        document.querySelectorAll(".side-menu");

    M.Sidenav.init(
        menus,
        {
            edge: "right"
        }
    );


    // Formulario lateral
    const forms =
        document.querySelectorAll(".side-form");

    M.Sidenav.init(
        forms,
        {
            edge: "left"
        }
    );

});