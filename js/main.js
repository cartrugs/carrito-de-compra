/**
 * Se ejecuta cuando el contenido del DOM ha sido cargado.
 */
document.addEventListener('DOMContentLoaded', () => {


  // ======================================== VARIABLES ========================================

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
   * Captura del botón para mostrar la compra.
   */
  const btnMostrarCompra = document.querySelector('#btnMostrarCompra');

  /**
   * Captura para el contenedor donde se mostrarán los productos añadidos al carrito.
   */
  const contenedorProductosComprados = document.querySelector('#contenedorProductosComprados');

  /**
   * Captura del botón con el que se eliminan los productos.
   */
  const btnEliminarCompra = document.querySelector('#btnEliminarCompra');

  /**
   * Captura del botón con el que se actualiza el carrito.
   */
  // const btnActualizarCompra = document.querySelector('#btnActualizarCompra');

  /**
   * Captura del botón con el que se finaliza la compra.
   */
  const btnFinalizarCompra = document.querySelector('#btnFinalizarCompra');

  /**
   * fragment no afecta el DOM principal y ayuda a reducir la carga en el rendimiento al realizar muchas manipulaciones en el DOM. Luego, al final del bucle se agrega todo el fragmento en una sola operación.
   */
  const fragment = document.createDocumentFragment();

  /**
   * Objeto vacío para almacenar los productos comprados
   */
  const productosComprados = {}; // Cambiado de array a objeto(primero use un array)

  /**
   * La URL base para la API de productos.
   * @type {string}
   */
  const urlBase = 'https://dummyjson.com/products';

  /** 
   * Variable para recuperar localStorage. Tras el operador OR se proporciona un valor predeterminado en caso de que el localStorage sea NULL.
   * Dado que recuperarLocal se ejecuta una vez cuando se carga la página y asigna los datos almacenados en el `localStorage` a `productosComprados`, los cambios que se hagan en `productosComprados` dentro del código se reflejarán automáticamente en el `localStorage` cada vez que invoque a la función `almacenarEnLocalStorage`.
  */
  const recuperarLocal = JSON.parse(localStorage.getItem('productosComprados')) || {};

  // ======================================== EVENTOS =============================================

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
      await pintarCategorias(`/category/${categoriaSeleccionada}`);
    }
  });

  /**
   * Maneja el evento `click` en el botón de añadir. Cuando el evento `click` se dispara en el `button` del producto, se ejecuta la función de escucha.
   */
  document.addEventListener('click', ({ target }) => {
    if (target.classList.contains('btnAnadir')) {
      const productoId = target.dataset.id;
      agregarAlCarrito(productoId);
      // console.log(productoId);
    }
  });

  /**
   * Maneja el evento `click` en el botón de eliminar. Cuando el evento `click` se dispara en el `button` del producto, se ejecuta la función de escucha.
   */
  document.addEventListener('click', ({ target }) => {
    if (target.classList.contains('btnEliminar')) {
      const productoId = target.dataset.id;
      eliminarDelCarrito(productoId);
    }
  });

  /**
   * Maneja el evento click del botón  `Mostrar compra`. Cuando el evento `click` se dispara en el `button` del carrito, se ejecuta la función de escucha.
   */
  btnMostrarCompra.addEventListener('click', () => {
    mostrarCompraEnCarrito();
    // btnMostrarCompra.style.display = 'none'; // Ocultar el botón 'Mostrar Compra'
    btnEliminarCompra.style.display = 'inline-block'; // Mostrar el botón 'Eliminar compra'
    btnFinalizarCompra.style.display = 'inline-block'; // Mostrar el botón 'Finalizar compra'
  });

  // document.addEventListener('click', ({ target }) => {
  //   if (target.classList.contains('btnMostrarCompra')) {
  //     mostrarCompraEnCarrito();
  //   }
  // });

  /**
   * Maneja el evento click del botón  `Eliminar compra`. Cuando el evento `click` se dispara en el `button` del carrito, se ejecuta la función de escucha.
   */
  document.addEventListener('click', ({ target }) => {
    if (target.classList.contains('btnEliminarCompra')) {
      eliminarCompraCompleta();
      btnFinalizarCompra.style.display = 'none'; // Ocultar el botón 'Finalizar compra'
    }
  });

  // document.addEventListener('click', ({ target }) => {
  //   if (target.classList.contains('btnActualizarCompra')) {

  //   }
  // });

  /**
   * Maneja el evento click del botón  `Finalizar compra`. Cuando el evento `click` se dispara en el `button` del carrito, se ejecuta la función de escucha.
   */
  btnFinalizarCompra.addEventListener('click', () => {
    finalizarCompra();
  });

  // ======================================== FUNCIONES =============================================

  /**
   * Función para almacenar los productos en localStorage.
   * Almacenar en el `localStorage`. `localStorage`: Es un objeto que permite a las aplicaciones web  almacenar datos en la memoria local del usuario. Los datos almacenados en `localStorage` persisten incluso después de que el usuario cierre la ventana o el navegador.
   * .setItem('productosComprados', JSON.stringify(productosComprados)): .setItem es una función del objeto localStorage que permite almacenar un valor bajo una clave dada. En este caso, 'productosComprados' es la clave que se utilizará para acceder a los productos comprados almacenados. JSON.stringify(productosComprados) convierte el objeto productosComprados en una cadena JSON, que es un formato de texto que representa una estructura de datos en JavaScript.
   */
  const almacenarEnLocalStorage = (productos) => {
  localStorage.setItem('productosComprados', JSON.stringify(productos));
  };

  /**
   * Función asíncrona para obtener las categorías desde la API en el select.
   */
  const cargarCategorias = async () => {
    try {
      /**
       * Obtener las categorías. Retorna promesa. Se utiliza `await` para que continúe ejecutándose el programa. Se utiliza `fetch` para obtener recursos de forma asíncrona desde la API.
       */
      const res = await fetch(`${urlBase}/categories`);

      /**
       * Se verifica si la respuesta `res` es ok. Si lo es , se convierten los datos a JSON usando `await res.json()`
       */
      if (res.ok) {
        const categorias = await res.json();

        // Crear opciones para cada categoría y agregarlas al select
        categorias.forEach((categoria) => {
          const option = document.createElement('OPTION');
          option.value = categoria;
          option.textContent = categoria;
          opcionesCategoria.append(option);
        });
      } else {
        throw 'No se pudieron cargar las categorías';
      }
      /**
       * En el bloque `catch` se captura cualquier error que ocurra en el proceso y se imprime utilizando `console.log(error)`.
       */
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Función asíncrona para pintar las categorías desde la API.
   */
  const pintarCategorias = async (url) => {
    try {
      /**
       * Pintar las categorías. Retorna promesa. Se utiliza `await` para que continúe ejecutándose el programa. Se utiliza `fetch` para obtener recursos de forma asíncrona desde la API.
       */
      const res = await fetch(`${urlBase}/${url}`);

      /**
       * Se verifica si la respuesta `res` es ok. Si lo es , se convierten los datos a JSON usando `await res.json()`
       */
      if (res.ok) {
        /**
         * En la variable `data`, después de convertir la respuesta a formato JSON, los productos se encuentran en la propiedad `products` dentro del objeto `data`
         */
        const data = await res.json();

        // Limpiar el contenido del contenedor
        contenedorProductos.innerHTML = '';
        /**
        * Itera a través de los productos y realiza operaciones para cada producto.
        *
        * @param {Object} element - Objeto que representa un producto.
        */
        data.products.forEach((element) => {
          // Crear elementos para mostrar productos
          const figure = document.createElement('FIGURE');
          figure.classList.add('flexContainer');

          const imagen = document.createElement('IMG');
          imagen.src = element.images[0];
          imagen.alt = element.title;
          imagen.classList.add('bRad2');

          const titulo = document.createElement('H2');
          titulo.classList.add('textCenter');
          titulo.textContent = `${element.title}`;

          const valoracion = document.createElement('P');
          valoracion.classList.add('textCenter');
          valoracion.textContent = `${element.rating}`;

          const precio = document.createElement('H3');
          precio.classList.add('textCenter');
          precio.textContent = `${element.price}€`;

          const anadirAlCarritoButton = document.createElement('BUTTON');
          anadirAlCarritoButton.dataset.id = element.id;
          anadirAlCarritoButton.type = 'button';
          anadirAlCarritoButton.innerHTML = 'Añadir';
          anadirAlCarritoButton.classList.add(
            'btnAnadir',
            'bRad',
            'letterSpacing'
          );

          /**
          * Agrega los elementos de un producto al contenedor de productos.
          *
          * @param {HTMLElement} figure - Elemento <figure> que contiene la representación del producto.
          * @param {HTMLElement} imagen - Elemento <img> que muestra la imagen del producto.
          * @param {HTMLElement} titulo - Elemento <h2> que muestra el título del producto.
          * @param {HTMLElement} valoracion - Elemento <p> que muestra la valoración del producto.
          * @param {HTMLElement} precio - Elemento <h3> que muestra el precio del producto.
          * @param {HTMLElement} anadirAlCarritoButton - Elemento <button> para añadir el producto al carrito.
          */
          figure.append(imagen);
          figure.append(titulo);
          figure.append(valoracion);
          figure.append(precio);
          figure.append(anadirAlCarritoButton);

          /**
           * fragment no afecta el DOM principal y ayuda a reducir la carga en el rendimiento al realizar muchas manipulaciones en el DOM. Luego, al final del bucle se agrega todo el fragmento en una sola operación.
           */
          fragment.append(figure);
        });
        // Crear elementos para cada producto y agregarlos al contenedor
        contenedorProductos.append(fragment);
      } else {
        throw 'No se puede mostrar el resultado de la catregoría seleccionada';
      }
      /**
       * En el bloque `catch` se captura cualquier error que ocurra en el proceso y se imprime utilizando `console.log(error)`.
       */
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Agrega un producto al carrito de compras.
   *
   * @param {string} productoId - El ID del producto que se va a agregar al carrito.
   * @throws {Error} Si ocurre un error al realizar la operación.
   */
  const agregarAlCarrito = async (productoId) => {
    try {
      /**  
       * Realizar una solicitud para obtener los detalles del producto desde la API. Después de obtener la respuesta de la solicitud (resProducto), se convierte la respuesta en un objeto JSON utilizando await resProducto.json(). Esto te da acceso a los detalles del producto.
       * 
       */
      const resProducto = await fetch(`${urlBase}/${productoId}`);
      const producto = await resProducto.json();

      // Verificar si el producto ya está en el carrito
      if (!productosComprados[productoId]) {
        /**
         * Si el producto no está en el carrito (lo cual significa que productosComprados[productoId] es falsy, es decir, no existe), se agrega con una cantidad inicial de 1 con el operador de propagación spread (`...`) para copiar todas las propiedades del objeto `producto` en un nuevo objeto dentro del carrito (`productosComprados[productoId]`). Si el producto ya está en el carrito (lo cual significa que `productosComprados[productoId]` es truthy, es decir, existe), se incremneta la propiedad `cantidad` del producto en el carrito. 
         */
        productosComprados[productoId] = {
          ...producto,
          cantidad: 1,
        };

        /** 
         * Almacenar en el `localStorage`.
         */
        almacenarEnLocalStorage(productosComprados);


      } else {
        // Si el producto ya está en el carrito, se incrementa la cantidad
        productosComprados[productoId].cantidad++;
      }

      /**
       * /**
       * JSON.stringify(producto, null, 2): Convierte el objeto 'producto' en una cadena JSON legible.
       *
       * @param {object} producto - El objeto del producto que se agregó al carrito.
       * @param {null} null - Función de reemplazo opcional.
       * @param {number} 2 - Número de espacios de sangría para formatear la cadena JSON.
       * JSON.stringify(productoAgregado, null, 2): Aquí es donde se formatea y se muestra el objeto productoAgregado como una cadena JSON legible. Los argumentos de esta función son:
       * productoAgregado: Es el objeto que se va a convertir en una cadena JSON.
       * null: Es una función de reemplazo opcional. Si no se especifica o se establece en null, no hay reemplazo y todos los valores se incluirán en la cadena JSON.
       * 2: Es el número de espacios de sangría que se utilizan para formatear la cadena JSON. Esto hace que la cadena sea más legible al agregar sangría y espacios en blanco. Un valor de 2 es comúnmente utilizado para una mejor visualización.
       */
      console.log(
        'Producto añadido al carrito:',
        JSON.stringify(producto, null, 2)
      );
      /**
       * En el bloque `catch` se captura cualquier error que ocurra en el proceso y se imprime utilizando `console.log(error)`.
       */
    } catch (error) {
      console.log('Error al agregar el producto al carrito:', error);
    }
  };

  /**
   * Función para mostrar los productos añadidos al carrito.
   */
  const mostrarCompraEnCarrito = () => {
    try {
      /**
       * Muestra de los productos. Retorna promesa. Se utiliza `await` para que continúe ejecutándose el programa. Se utiliza `fetch` para obtener recursos de forma asíncrona desde la API.
       */

      // Limpia el contenedor
      contenedorProductosComprados.innerHTML = '';

      /**
       * Bucle for in para recorrer cada producto en el objeto de productos comprados.
       */
      for (const productoId in productosComprados) {
        // Obtiene los detalles del producto actual
        const producto = productosComprados[productoId];

        const figure = document.createElement('FIGURE');
        figure.classList.add('flexContainer');

        const imagen = document.createElement('IMG');
        imagen.src = producto.images[0];
        imagen.alt = producto.title;
        imagen.classList.add('bRad2');

        const titulo = document.createElement('H2');
        titulo.classList.add('textCenter');
        titulo.textContent = producto.title;

        const valoracion = document.createElement('P');
        valoracion.classList.add('textCenter');
        valoracion.textContent = producto.rating;

        const precio = document.createElement('H3');
        precio.classList.add('textCenter');
        precio.textContent = `${producto.price}€`;

        // Botón de eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.dataset.id = producto.id;
        btnEliminar.type = 'button';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('btnEliminar', 'bRad', 'letterSpacing');

        // Contador de cantidad (+ y -)
        const contador = document.createElement('DIV');
        contador.classList.add('contador');
        const btnIncrementar = document.createElement('BUTTON');
        btnIncrementar.classList.add('bgDark', 'bRad', 'incDec');
        btnIncrementar.textContent = '+';
        const btnDecrementar = document.createElement('BUTTON');
        btnDecrementar.classList.add('bgDark', 'bRad', 'incDec');
        btnDecrementar.textContent = '-';
        const cantidad = document.createElement('SPAN');
        cantidad.classList.add('cntd');
        cantidad.textContent = producto.cantidad.toString(); // Mostrar la cantidad del producto

        // Agregar elementos al contenedor 'figure'
        figure.append(imagen);
        figure.append(titulo);
        figure.append(valoracion);
        figure.append(precio);
        figure.append(btnEliminar);
        contador.append(btnDecrementar);
        contador.append(cantidad);
        contador.append(btnIncrementar);
        figure.append(contador);

        /**
        * fragment no afecta el DOM principal y ayuda a reducir la carga en el rendimiento al realizar muchas manipulaciones en el DOM. Luego, al final del bucle se agrega todo el fragmento en una sola operación.
        */
        fragment.append(figure);

        // Agregar el 'figure' al fragmento y así al contenedor de productos comprados
        contenedorProductosComprados.append(fragment);
      };
      /**
       * En el bloque `catch` se captura cualquier error que ocurra en el proceso y se imprime utilizando `console.log(error)`.
       */
    } catch (error) {
      console.log(error);
    }
  };

  /**
  * Eliminación de los productos. Retorna promesa. Se utiliza `await` para que continúe ejecutándose el programa. Se utiliza `fetch` para obtener recursos de forma asíncrona desde la API.
  */
  const eliminarDelCarrito = async (productoId) => {
    try {
      // Realizar la solicitud DELETE al endpoint correspondiente
      const res = await fetch(`${urlBase}/${productoId}`, {
        method: 'DELETE',
      });

      // Se utiliza delete productosComprados[productoId] para eliminar la propiedad del objeto `productosComprados` correspondiente al producto que se desea eliminar.

      if (res.ok) {
        const productoEliminado = await res.json();
        if (productoEliminado.isDeleted) {
          // Eliminar el producto del objeto productosComprados
          if (productosComprados[productoId]) {
            delete productosComprados[productoId];

            /** 
            * Almacenar en el `localStorage`.
            */
            almacenarEnLocalStorage(productosComprados);
            mostrarCompraEnCarrito(); // Actualizar la vista después de eliminar
          }
        } else {
          throw 'No se pudo eliminar el producto';
        }
      };
      /**
       * En el bloque `catch` se captura cualquier error que ocurra en el proceso y se imprime utilizando `console.log(error)`.
       */
    } catch (error) {
      console.log('Error al eliminar el producto:', error);
    }
  };

  /**
  * Eliminación de la compra. Retorna promesa. Se utiliza `await` para que continúe ejecutándose el programa. Se utiliza `fetch` para obtener recursos de forma asíncrona desde la API.
  */
  const eliminarCompraCompleta = async () => {
    try {

      for (const productoId in productosComprados) {
        await eliminarDelCarrito(productoId);
      }

      /**
       * Una vez eliminados los productos, se limpia el objeto. Bucle for in para recorrer cada producto en el objeto de productos comprados.
      */
      for (const productoId in productosComprados) {
      delete productosComprados[productoId];
      }

      /** 
       * Almacenar en el `localStorage`.
       */
      almacenarEnLocalStorage(productosComprados);
      mostrarCompraEnCarrito(); // Actualizar la vista después de eliminar

      // Mostrar solo el botón 'Mostrar Compra' y ocultar 'Eliminar Compra'
      btnMostrarCompra.style.display = 'inline-block';
      btnEliminarCompra.style.display = 'none';
      /**
      * En el bloque `catch` se captura cualquier error que ocurra en el proceso y se imprime utilizando`console.log(error)`.
      */
    } catch (error) {
      console.log('Error al eliminar la compra completa', error);
    }
  };

  /**
  * Finalizar la compra. Retorna promesa. Se utiliza `await` para que continúe ejecutándose el programa. Se utiliza `fetch` para obtener recursos de forma asíncrona desde la API.
  */
  const finalizarCompra = async () => {
    try {
      // Enviar los productos comprados al servidor para procesar la compra
      const productosCompradosArray = Object.values(productosComprados);
      
      // Realizar una solicitud POST al servidor con los productos comprados
      const response = await fetch('URL_DEL_SERVIDOR/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productosCompradosArray),
      });
  
      if (response.ok) {
        /**
        * Si la compra se procesó exitosamente, realiza las acciones necesarias como limpiar el carrito y mostrar un mensaje de éxito. 
        */
      
        /** Limpiar el carrito después de la compra. Bucle for in para recorrer cada producto en el objeto de productos comprados.
        */
        for (const productoId in productosComprados) {
          delete productosComprados[productoId];
        }
        
        // Actualizar la vista del carrito
        mostrarCompraEnCarrito();
        
        // Mostrar un mensaje de éxito
        alert('¡Compra realizada con éxito!');
      } else {
        // Si hay un problema con la compra, muestra un mensaje de error
        alert('Hubo un problema al procesar la compra. Inténtalo nuevamente.');
      }
      /**
       * En el bloque `catch` se captura cualquier error que ocurra en el proceso y se imprime utilizando `console.log(error)`.
       */
    } catch (error) {
      console.log('Error al finalizar la compra', error);
    }
  };
  

  // ======================================== INVOCACIÓN DE FUNCIONES ========================================

  cargarCategorias();


}); // ***** LOAD *****