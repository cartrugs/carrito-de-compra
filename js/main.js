/**
 * Se ejecuta cuando el contenido del DOM ha sido cargado.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ===== VARIABLES =====

  /**
   * Obtener las categorías.
   */
  /**
   * Filtro de selección por categoría.
   * @type {HTMLSelectElement}
   */
  const opcionesCategoria = document.querySelector('#opcionesCategoria');

  /**
   * La URL base para la API de productos.
   * @type {string}
   */
  const urlBase = 'https://dummyjson.com/products';

  // ===== EVENTOS =====

  /**
   * Maneja el evento de cambio en el select de categorías.
   */
  opcionesCategoria.addEventListener('change', async () => {
    // Obtener la categoría seleccionada
    let categoriaSeleccionada = opcionesCategoria.value;
    console.log(categoriaSeleccionada);

    if (categoriaSeleccionada) {
        // Obtener y mostrar productos de la categoría seleccionada
        const productos = await categoriaSelect(`?categories=${categoriaSeleccionada}`);

    }
  })

  // ===== FUNCIONES =====

  /**
   * Función asíncrona para obtener las categorías desde la API en el select.
   */
  const cargarCategorias = async () => {
    try {
        /**
         * Obtener las categorías. Retorna promesa. Se utiliza <await> para que continúe ejecutándose el programa. Se utiliza <fetch> para obtener obtener recursos de forma asíncrona desde la API.
         */
        const res = await fetch(`${urlBase}/categories`);

        /**
         * Se verifica si la respuesta <res> es ok. Si lo es , se convierten los datos a JSON usando <await res.json()>
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
         * En el bloque <catch> se captura cualquier error que ocurra en el proceso y se imprime utilizando <console.log(error)>.
         */
    } catch (error) {
        console.log(error)
    }
    
  }

  /**
   * Realiza una solicitud a la API para obtener productos de una categoría.
   * @param {string} url - La URL de la API para obtener productos.
   * @returns {Promise} - Una promesa que se resuelve con los datos de los productos.
   */
  const categoriaSelect = async (url) => {
    try {
      /**
       * Retorna promesa. Se utiliza <await> para que continúe ejecutándose el programa. Se utiliza <fetch> para obtener recursos de forma asíncrona desde la API
       */
      const res = await fetch(`${urlBase}/${url}`);

      if (res.ok) {
        const data = await res.json();
        return data;
      } else {
        throw 'Ha ocurrido un error';
      }
    } catch (error) {
      console.log(error);
      // return null;
    }
  };

  // ===== INVOCACIÓN DE FUNCIONES =====

  cargarCategorias();




}); // ***** LOAD *****
