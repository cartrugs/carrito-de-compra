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
  })

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
    
  }

  const pintarCategorias = async (url) => {
    try {
      const res =  await fetch(`${urlBase}/${url}`);

      if (res.ok) {
        const data = await res.json();

        // Limpiar el contenido contenedor
        contenedorProductos.innerHTML = ''
        data.products.forEach( (element) => {
          const figure = document.createElement('FIGURE');
          figure.classList.add('flexContainer')
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
          precio.textContent = `${element.price}`;

          figure.append(imagen);
          figure.append(titulo);
          figure.append(valoracion);
          figure.append(precio);

          contenedorProductos.append(figure);

        })

        // Crear elementos para cada producto y agregarlos al contenedor
      } else {
        throw 'No se puede mostrar el resultado de la catregoría seleccionada'
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ===== INVOCACIÓN DE FUNCIONES =====

  cargarCategorias();



}); // ***** LOAD *****
