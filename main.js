
let productos;
obtenerJsonProductos()
let contDeProductos = document.getElementById("losproductos");
let miCarrito = document.getElementById("carrito-contenedor");
let btnFinalizar = document.getElementById("finalizar");
let btnVaciar = document.getElementById("vaciar");

const carrito = [];


//Formulario de login  

 function checkData(){
    let usuario = document.getElementById("username").value;
    let pasword = document.getElementById("pass").value;

//local storage formulario
        localStorage.setItem("userName",usuario);
        localStorage.setItem("userPass",pasword);
    }
     
//Creando las cards       
function brindarProductos(productos){
    for (const prod of productos){
        contDeProductos.innerHTML +=`
     <div class="border-black card col-sm-2 col-8 col-sm-3 text-center shadow-lg p-3 mb-5 bg-body rounded ">
        <img src= ${prod.imagen} alt="card img cap" class="img-fluid ">
        <div class="card-body">
            <h4 class="card-title ">${prod.nombre}</h4>
            <p class="card-text">$ ${prod.precio} <br> ${prod.descripcion}</p>
            <button id=${prod.id} class="btn btn-success container text-center  compra">Agregar al Carrito</button>
        </div>
     </div> 
        `;
    }
//eventos
    let botones = document.getElementsByClassName("compra");
    for (const boton of botones) {
        boton.onclick = () =>{
            const producACarro = productos.find((producto) => producto.id == boton.id);
            console.log(producACarro);
            
           agregarAcarrito(producACarro);
        }    
    }
}

//carrito de compras
    function agregarAcarrito (producto) {
        let alCarro = carrito.reduce((acumulador, producto)=> acumulador + producto.precio, 0);
        carrito.push(producto);
        Swal.fire({
            title: 'Fantastico !',
            text: `Agregaste ${producto.nombre} al carrito !🛒`,
            imageUrl: producto.imagen,
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: producto.nombre,
          });
//Tabla del carrito         
        tablaCarrito.innerHTML += `     
            <table class="table">
                <tbody>
                    <td>${producto.nombre}</td>
                    <td>${producto.precio}</td>
                    <td>${producto.id}</td>
                    <td><button class"btn btn-light" onclick="eliminar(event)">⛔</button></td>
                </tbody>
            </table>`; 
        
    precioTotal+=producto.precio;
            totalActual();
            saveLocal();
};

    let precioTotal=0;
    function totalActual(){
        const todoElTotal = document.getElementById("total");
        todoElTotal.innerHTML = "El precio total es: $" + precioTotal;
};
//local storage para el carrito
    const saveLocal = () =>{
       localStorage.setItem("carrito", JSON.stringify(carrito)); 
    }

//funcion eliminar elementos del carrito
    function eliminar(dlt){ 
        let fila = dlt.target.parentElement.parentElement;
        let id = fila.children[0].innerText
        let indice = carrito.findIndex(producto => producto.id == id);
        
//remueve el producto del carro
    carrito.splice(indice,1);
    
//remueve la fila de la tabla
    fila.remove();
    
//recalcular el total
    let preciosAcumulados = carrito.reduce((acumulador,producto)=>acumulador+producto.precio,0);
    total.innerText="Total a pagar $: "+preciosAcumulados; 

//storage
    localStorage.setItem("carro",JSON.stringify(carrito));

}
    
//JSON
 async function  obtenerJsonProductos(){
    const rutaJson = "/productos.json";
    const respuesta = await fetch(rutaJson);
    const data =await respuesta.json();
    productos = data;
    brindarProductos(productos);
 }

//Dolar API
 function dolar(){
    const urlDolar = "https://api.bluelytics.com.ar/v2/latest";
    fetch(urlDolar)
    .then(resultado => resultado.json())
    .then(datos=>{
        const cotizaBlue = datos.blue;
        document.getElementById("cotizacion").innerText = `Compra:💵 ${cotizaBlue.value_buy}
         Venta:💵 ${cotizaBlue.value_sell}`;
    })

}
dolar();

//Finalizar compra
btnFinalizar.onclick=()=>{
    alCarro=[];
    document.getElementById("tablaCarrito").innerHTML="";
    document.getElementById("total").innerText="Total a pagar $:";
    Swal.fire(
        "Gracias por tu compra",
        "Pronto la recibiras",
         "success"
    )
    
    localStorage.removeItem("carrito");
}
//Vaciar carrito
btnVaciar.onclick=()=>{
    alCarro=[];
    document.getElementById("tablaCarrito").innerHTML="";
    document.getElementById("total").innerText="Total a pagar $:";
    swal.fire(
    "El carrito esta vacio", 
    "puedes volver a comenzar",
     "success"
     ) 

    localStorage.removeItem("carrito");
}