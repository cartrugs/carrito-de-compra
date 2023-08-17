/**
 * Se ejecuta cuando el contenido del DOM ha sido cargado.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ===== VARIABLES =====

  /**
   * Obtener las categorías.
   */
  /**
   * Captura `select` para el filtro de selección por categoría.
   * @type {HTMLSelectElement}
   */
  const opcionesCategoria = document.querySelector('#opcionesCategoria');

  /**
   * Captura para el contenedor donde se mostrarán los productos.
   */
  const contenedorProductos = document.querySelector('#contenedorProductos');

   /**
   * Captura del botón con el que se añadirán los productos.
   */
  const btnAnadir = document.querySelector('.btnAnadir') ;

  /**
   * Captura del botón para mostrar la compra
   */
  const btnMostrarCompra = document.querySelector('#btnMostrarCompra');

  /**
   * fragment no afecta el DOM principal y ayuda a reducir la carga en el rendimiento al realizar muchas manipulaciones en el DOM. Luego, al final del bucle se agrega todo el fragmento en una sola operación.
   */
  const fragment = document.createDocumentFragment();

  /**
   * Array vacio para guardar los productos añadidos al carrito
   */
  contenedorProductosComprados = [];

  /**
   * La URL base para la API de productos.
   * @type {string}
   */
  const urlBase = 'https://dummyjson.com/products';


  // ===== EVENTOS =====

  /**
   * Maneja el evento de cambio en el select de categorías. Cuando el evento `change` se dispara en el elemento `select` de categorías `opcionesCategoria`, se ejecuta la función de escucha.
   */
  opcionesCategoria.addEventListener('change', async () => {
    // Obtener el valor seleccionado del elemento `<select>` de categorías y lo almacena en la variable.
    let categoriaSeleccionada = opcionesCategoria.value;
 
    // Se verifica si la categoría seleccionada es diferente de `'seleccionaCategoria'`. Esto se hace para asegurarse de que no se realizan acciones si el usuario selcciona la opción por defecto en el `<select>`
    if (categoriaSeleccionada !== 'seleccionaCategoria') {
      
      /**
       *  Obtener y mostrar productos de la categoría seleccionada si la categoría seleccionada no es la opción por defecto y se invoca la función pasando el valor de `categoriaSeleccionada` como parte de la url para obtener productos de la categoría correspondiente.
       */ 
      await pintarCategorias(`/category/${categoriaSeleccionada}`)

    }
  });

  /**
   * Maneja el evento `click` en el botón de añadir. Cuando el evento `click` se dispara en el `button` del producto, se ejecuta la función de escucha.
   */
  document.addEventListener('click', ({target}) => {

    if (target.classList.contains('btnAnadir')) {
      const productoId = target.dataset.id;
      agregarAlCarrito(productoId);
      console.log(productoId)
    }
  });
  
  /**
   * Maneja el evento click del botón  `Mostrar Compra`. Cuando el evento `click` se dispara en el `button` del carrito, se ejecuta la función de escucha.
   */
  btnMostrarCompra.addEventListener('click', () => {
    mostrarCompraEnCarrito();
  });


  // ===== FUNCIONES =====

  /**
   * Función asíncrona para obtener las categorías desde la API en el select.
   */
  const cargarCategorias = async () => {
    try {
        /**
         * Obtener las categorías. Retorna promesa. Se utiliza `await` para que continúe ejecutándose el programa. Se utiliza `fetch` para obtener obtener recursos de forma asíncrona desde la API.
         */
        const res = await fetch(`${urlBase}/categories`);

        /**
         * Se verifica si la respuesta `res` es ok. Si lo es , se convierten los datos a JSON usando `await res.json()`
         */
        if (res.ok) {
            const categorias = await res.json();

            // Crear opciones para cada categoría y agregarlas al select
            categorias.forEach((categoria) => {
                const option = document.createElement('option');
                option.value = categoria;
                option.textContent = categoria;
                opcionesCategoria.append(option);
            });
        } else {
            throw 'No se pudieron cargar las categorías'
        }
        /**
         * En el bloque `catch` se captura cualquier error que ocurra en el proceso y se imprime utilizando `console.log(error)`.
         */
    } catch (error) {
        console.log(error)
    }
    
  };

  const pintarCategorias = async (url) => {
    try {
      const res =  await fetch(`${urlBase}/${url}`);

      if (res.ok) {
        const data = await res.json();

        // Limpiar el contenido contenedor
        contenedorProductos.innerHTML = ''
        data.products.forEach((element) => {
          const figure = document.createElement('FIGURE');
          figure.classList.add('flexContainer');
          
          const imagen = document.createElement('IMG');
          imagen.src = element.images[0];
          imagen.alt = element.title;
          imagen.classList.add('bRad2')

          const titulo = document.createElement('H2');
          titulo.classList.add('textCenter')
          titulo.textContent = `${element.title}`

          const valoracion = document.createElement('P');
          valoracion.classList.add('textCenter')
          valoracion.textContent = `${element.rating}`;

          const precio = document.createElement('H3');
          precio.classList.add('textCenter')
          precio.textContent = `${element.price}€`;

          const anadirAlCarritoButton = document.createElement('BUTTON');
          anadirAlCarritoButton.dataset.id = element.id;
          anadirAlCarritoButton.type = 'button'
          anadirAlCarritoButton.innerHTML= 'Añadir';
          anadirAlCarritoButton.classList.add('btnAnadir', 'bRad', 'letterSpacing');
          
          figure.append(imagen);
          figure.append(titulo);
          figure.append(valoracion);
          figure.append(precio);
          figure.append(anadirAlCarritoButton);

          fragment.append(figure)

        });

        contenedorProductos.append(fragment);

        // Crear elementos para cada producto y agregarlos al contenedor
      } else {
        throw 'No se puede mostrar el resultado de la catregoría seleccionada'
      }
    } catch (error) {
      console.log(error);
    }
  };

  const agregarAlCarrito = async (productoId) => {
    try{
      const resProducto = await fetch(`${urlBase}/${productoId}`);
      console.log(resProducto)
      const producto = await resProducto.json();

      const res = await fetch(`${urlBase}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
      });

      if (res.ok) {
        const productoAgregado = await res.json();

        contenedorProductosComprados.push(productoAgregado);

        /**
         * JSON.stringify(productoAgregado, null, 2): Aquí es donde se formatea y se muestra el objeto productoAgregado como una cadena JSON legible. Los argumentos de esta función son:
         * productoAgregado: Es el objeto que se va a convertir en una cadena JSON.
         * null: Es una función de reemplazo opcional. Si no se especifica o se establece en null, no hay reemplazo y todos los valores se incluirán en la cadena JSON.
         * 2: Es el número de espacios de sangría que se utilizan para formatear la cadena JSON. Esto hace que la cadena sea más legible al agregar sangría y espacios en blanco. Un valor de 2 es comúnmente utilizado para una mejor visualización.
         */
        console.log('Producto añadido al carrito:', JSON.stringify(productoAgregado, null, 2));

      } else {
        throw 'No se pudo agregar el producto al carrito';
      }

    } catch (error) {
      console.log('Error al agregar el producto al carrito:', error);
    }
  };
  

  // ===== INVOCACIÓN DE FUNCIONES =====

  cargarCategorias();



}); // ***** LOAD *****
