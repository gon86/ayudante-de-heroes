export const GestorRecursos = iniciarRecursos();

/**
 * Inicia los recursos de imágenes y sonidos
 * @returns {Object} Objeto literal con sus métodos
 */
function iniciarRecursos(){
    const imagenes = ["escenario.png", "espada.png", "moneda-giratoria.png", "moneda.png", "personajes.png"];
    const imagenesCargadas = [];
    let cantidadImagenesCargadas = 0;

    return {
        /**
         * Carga todos los recursos
         * @param {Function} callback La función a ejecutar cuando finalice la carga
         */
        cargar: function(callback){
            for(let i=0; i<imagenes.length; i++){
                const imagen = new Image();
                imagen.src = "imagenes/" + imagenes[i];
                imagenesCargadas.push(imagen);
        
                imagenesCargadas[i].addEventListener("load", function(e){
                    cantidadImagenesCargadas++;
                    if(cantidadImagenesCargadas === imagenes.length){
                        callback();
                    }
                });
            }
        }
    }
}
