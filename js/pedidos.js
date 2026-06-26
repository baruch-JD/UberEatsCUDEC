document.addEventListener('DOMContentLoaded', function() {
// nav menu
const menus = document.querySelectorAll('.side-menu');
M.Sidenav.init(menus, {edge: 'right'});
});

let contenidolista ='';

db.collection("platillos").onSnapshot((datos) => {
    datos.docChanges().forEach((registro) => {
        if (registro.type === "added") {
            agregaralista(registro.doc.data(), registro.doc.id);
        }
    });

    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
});
 function agregaralista(platillo,id){
    contenidolista += <Option value='${id}'>   
    ${platillo.nombre}
    </Option>
 }



