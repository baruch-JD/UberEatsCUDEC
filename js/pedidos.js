let contenidolista ='';

function agregaralista(platillo,id){
contenidolista = `<option value=''>
${mostrarPlatillo.nombre}
</option>`;
document.getElementById('listaplatillos').innerHTML =
contenidolista;


}