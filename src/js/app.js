// Accedemos a api.json
// DOMContentLoader ejecuta fetch luego de que se ha cargado todo el codigo html
document.addEventListener("DOMContentLoaded", () =>{
  fetchData()
})

const fetchData = async () => {
  try {
      const res = await fetch('../js/api.json')
      const data = await res.json()
      // mostrarGardados()
      // console.log(data)  //agregamos las funciones que van a 
      pintarProductos(data) //acceder a la (data)
      detectarBotones(data)
      mostrarGardados(productosGuardados)
  }catch (error) {
    console.log(error)
  }
}
// Accedemos a api.json
const guardarCompra = () => {
  localStorage.setItem( 'guardados', JSON.stringify(carrito) );
}

 ///////   variables    /////

let carrito = {}
const productosGuardados = JSON.parse(localStorage.getItem('guardados'))

/*  ---------> En esta funcion primero se obtiene el contenido de donde se 
mostraran los productos (contenedorProductos). Luego se obtiene la data que 
viene desde api.json
se captura el template del html utilizando .content
para capturar solo el contenido y se crea el fragment.
se recorre la data con forEach, cada 'producto' llamandolos con querySelector
directamente con las etiquetas utilizando el template hecho en html.
para poder utilizar varios templates se debe clonarlos creando una constante llamada
clone. Clonamos el template y le agregamos el cloneNode(true)
Con cada template.querySelector estamos modificando una parte del templateProducto
luego le decimos que cada vez que modificamos el template lo agregue al fragment
( fragment.appendChild(clone) ). Una vez que se sale del forEach utilizamos nuestro
contenedorProducto id donde iran nuestros pruductos con el appendChild y le agregamos
el fragment que es donde esta nuestra informacion. 
agregamos el dataset (linea 46) para que todos los botones tengan un id unico
ya que si se agregara una id al boton en html el id se repetiria. <----------- */

const contenedorProductos  = document.querySelector('#contenedor-productos')
const pintarProductos = (data) => {
    const template = document.querySelector('#template-productos').content
    const fragment = document.createDocumentFragment()
    // console.log(template);
    data.forEach(producto => {
      // console.log(producto)
      template.querySelector('img').setAttribute('src', producto.url)
      template.querySelector('h5').textContent = producto.title
      template.querySelector('p span').textContent = producto.price
      template.querySelector('button').dataset.id = producto.id

      const clone = template.cloneNode(true)
      fragment.appendChild(clone)
    })
    contenedorProductos.appendChild(fragment)
}
// --------->    <-----------

/* --------->  Agregamos el llamado a la funcion en fetchData() porque detectarBotones
necesita acceder a la informacion de la (data) para comparar con la base de datos
para detectar los botones, lo guardamos en una const (botones) y con querySelector buscamos los 
botones. creamos el objeto carrito = {}
recorremos nuestros botones y agregamos el addEventListener capturando el evento click
buscamos en la data el id con find (data.find). Usamos el parseInt porque al usar el signo de
=== estamos comparando un string y un numero. 
con el if consultamos si en carrito existe la propiedad usando hasOwnProperty y si existe
no sumamos. iniciamos producto.cantidad = 1 y le decimos que cada vez que se apriete el boton
y el producto exista le sume 1 a la cantidad ( producto.cantidad = carrito[producto.id].cantidad + 1 )
en caso que no existe empujamos el producto al carrito y hacemos una copia del objeto con
{ ...producto } y llamamos a la siguiente funcion<----------- */


const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button')
    // console.log(botones)

    botones.forEach(btn => {
      btn.addEventListener('click', () => {
        // console.log(btn.dataset.id)

      const producto = data.find(item => item.id === parseInt(btn.dataset.id))
      producto.cantidad = 1
      if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
      }
      carrito[producto.id] = { ...producto }
      // console.log(carrito)
      pintarCarrito()
    })
  })

}
// --------->    <-----------

/* --------->  capturamos los items desde el html. 
cada vez que se presiona un boton se debe limpiar el html con items.inneHTML
Luego debemos recorrer el objeto y para poder hacerlo usamos Object.values
el objeto que recorremos es 'carrito', recorremos cada 'producto' de nuestro 
objeto 'carrito'. 
no olvidamos crear nuestro template sin olvidar el .content
para acceder al contenido y nuestro fragment. 
cuando vamos a seleccionar los elementos por ejemplo en el 'td' se usa [0] y [1]
para diferenciar uno de otro y saber cual se esta tomando.
por ultimo en span multiplicamos el precio del producto por la cantidad de productos
luego clonamos y repetimos la misma accion que en la funcion anterior.
 <----------- */
const items = document.querySelector('#items')

const pintarCarrito = () => {

    items.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    Object.values(carrito).forEach(producto => {
      // console.log('producto', producto)
      template.querySelector('th').textContent = producto.id
      template.querySelectorAll('td')[0].textContent = producto.title
      template.querySelectorAll('td')[1].textContent = producto.cantidad
      template.querySelector('span').textContent = producto.price * producto.cantidad
      
      //botones
      template.querySelector('.btn-info').dataset.id = producto.id
      template.querySelector('.btn-danger').dataset.id = producto.id

      const clone = template.cloneNode(true)
      fragment.appendChild(clone)
      
    })
    items.appendChild(fragment)
    pintarFooter()
    accionBotones()
    guardarCompra()
  }

// --------->    <-----------

/* --------->  obtenemos la informacion desde el template que vamos a modificar   <-----------
en este caso es el id template-footer. Comenzamos creando el template y el fragment.
utilizamos object.values para poder recorrer nuestro objeto y con reduce, tenemos el acumulador y accedemos 
a nuestro array de objectos Object.values(carrito) y le decimos que 
al acc (al acumulador ) le sume cantidad { cantidad } y que nos devuelva un numero
reduce((acc, { cantidad }) => acc + cantidad, 0).
para sumar totales, solo tenemos el precio de los productos asique lo que cambia es la cantidad de productos.
usamos nuevamente object.values y reduce, tenemos un ACC y esta vez necesitamos acceder a { cantida, precio}
y esto va a ser igual a el ACC + cantidad * precio y nos devuelve un numero:
reduce((acc, {cantidad, price}) => acc + cantidad * price ,0) 
    template.querySelectorAll('td')[0].textContent = nCantidad.... aqui mostramos la cantidad de productos
    template.querySelector('span').textContent = nPrecio mostramos el total del precio
luego con el id vaciar-carrito, lo que acemos con boton es borrar toda la informacio del carrito
usando addEventListener sobre boton hacemos que carrito{} quede vacio y llamamos a la funcion pintarCarrito()
El if que chequea la cantida de carritousamos object.keys para que solo nos devuelva los indices
si dentro del carrito no encuentra ningun indice, o sea esta vacio, inserta con innerHTML el mensaje
'carrito vacio' y se agrega el return para que no siga con la misma linea de codigo. 
*/
const footer = document.querySelector('#footer-carrito')

const pintarFooter = () => {

    footer.innerHTML = ''

    if(Object.keys(carrito).length === 0) {
      footer.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío</th>
      `
      return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, price}) => acc + cantidad * price ,0)

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
      carrito = {}
      pintarCarrito()
    })
}
// --------->    <-----------

// --------->    <-----------

const accionBotones = () => {
  const botonesAgregar = document.querySelectorAll('#items .btn-info')
  const botonesEliminar = document.querySelectorAll('#items .btn-danger')

  botonesAgregar.forEach(btn => {
    btn.addEventListener('click', () => {
        const producto = carrito[btn.dataset.id]
        producto.cantidad ++
        carrito[btn.dataset.id] = { ...producto }
        pintarCarrito()
    })
})

  botonesEliminar.forEach(btn => {
      btn.addEventListener('click', () => {
          const producto = carrito[btn.dataset.id]
          producto.cantidad --
          if (producto.cantidad === 0) {
              delete carrito[btn.dataset.id]
          } else {
              carrito[btn.dataset.id] = { ...producto }
          }
          pintarCarrito()
      })
  })

}
// --------->    <-----------

// --------->  para el guardado /// falta mejorar banda  <-----------
const mostrarGardados = () => {

  const template = document.querySelector('#template-carrito').content
  const fragment = document.createDocumentFragment()
    if (productosGuardados == null) {
      return
    }
    else {
      Object.values(productosGuardados).forEach(item => {
        template.querySelector('th').textContent = item.id
        template.querySelectorAll('td')[0].textContent = item.title
        template.querySelectorAll('td')[1].textContent = item.cantidad
        template.querySelector('span').textContent = item.price * item.cantidad
  
  
        //botones
        template.querySelector('.btn-info').dataset.id = item.id
        template.querySelector('.btn-danger').dataset.id = item.id
  
        const clone = template.cloneNode(true)
        fragment.appendChild(clone)
        })
    }
    items.appendChild(fragment)
    mostrarFooter()
    botonesAcciones()
}

const item = document.querySelector('#items')

const mostrarCarrito = () => {

    item.innerHTML = ''

    const template = document.querySelector('#template-carrito').content
    const fragment = document.createDocumentFragment()

    Object.values(productosGuardados).forEach(producto => {
      // console.log('producto', producto)
      template.querySelector('th').textContent = producto.id
      template.querySelectorAll('td')[0].textContent = producto.title
      template.querySelectorAll('td')[1].textContent = producto.cantidad
      template.querySelector('span').textContent = producto.price * producto.cantidad
      
      //botones
      template.querySelector('.btn-info').dataset.id = producto.id
      template.querySelector('.btn-danger').dataset.id = producto.id

      const clone = template.cloneNode(true)
      fragment.appendChild(clone)
      
    })
    items.appendChild(fragment)
    mostrarFooter()
    botonesAcciones()
    // guardarCompra()
  }

const footer2 = document.querySelector('#footer-carrito')
console.log(productosGuardados)
const mostrarFooter = () => {

    footer2.innerHTML = ''

    if(Object.keys(productosGuardados).length === 0) {
      footer2.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío</th>
      `
      return
    }

    const template = document.querySelector('#template-footer').content
    const fragment = document.createDocumentFragment()

    // sumar cantidad y sumar totales
    const nCantidad = Object.values(productosGuardados).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(productosGuardados).reduce((acc, {cantidad, price}) => acc + cantidad * price ,0)

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nPrecio

    const clone = template.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
      carrito = {}
      pintarCarrito()
    })
}

const botonesAcciones = () => {
  const botonesAgregar = document.querySelectorAll('#items .btn-info')
  const botonesEliminar = document.querySelectorAll('#items .btn-danger')
  console.log(productosGuardados)
  botonesAgregar.forEach(btn => {
    btn.addEventListener('click', () => {
        const producto = productosGuardados[btn.dataset.id]
        producto.cantidad ++
        console.log(productosGuardados)
        carrito[btn.dataset.id] = { ...producto }
        mostrarCarrito()
    })
})

  botonesEliminar.forEach(btn => {
      btn.addEventListener('click', () => {
          const producto = productosGuardados[btn.dataset.id]
          producto.cantidad --
          if (producto.cantidad === 0) {
              delete carrito[btn.dataset.id]
          } else {
              carrito[btn.dataset.id] = { ...producto }
          }
          mostrarCarrito()
      })
  })

}
