import { Audio } from "../clases/Audio.js";
export const GestorRecursos = iniciarRecursos();

/**
 * Inicia los recursos de imágenes y sonidos
 * @returns {Object} Objeto literal con sus métodos
 */
function iniciarRecursos(){
    const imagenes = [
        "boton.png", 
        "caballero.png", 
        "cargando.png", 
        "elfo.png", 
        "escenario.png", 
        "espada.png", 
        "logo.png", 
        "mago.png", 
        "moneda.png", 
        "sprites.png"
    ];
    const sonidos = [
        "click.mp3", 
        "derrota.mp3", 
        "moneda.mp3", 
        "musica.mp3", 
        "nueva-partida.mp3", 
        "victoria.mp3"
    ];
    const imagenesCargadas = [];
    const sonidosCargados = [];
    let cantidadImagenesCargadas = 0;
    let cantidadSonidosCargados = 0;

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
                        cargarSonidos();
                    }
                });
            }

            /**
             * Carga todos los sonidos
             */
            function cargarSonidos(){
                for(let i=0; i<sonidos.length; i++){
                    const audio = new Audio(sonidos[i]);

                    sonidosCargados.push({
                        audio: audio,
                        nombre: audio.obtenerNombre()
                    });
            
                    sonidosCargados[i].audio.obtenerSonido().addEventListener("canplaythrough", function(e){
                        cantidadSonidosCargados++;
                        if(cantidadSonidosCargados === sonidos.length){
                            callback();
                        }
                    });
                }
            }
        },

        /**
         * Obtiene un audio específico
         * @param {String} nombre El nombre del audio con su extensión
         * @returns {Audio} El objeto correspondiente al nombre
         */
        obtenerAudio: function(nombre){
            for(let i=0; i<sonidosCargados.length; i++){
                if(sonidosCargados[i].nombre === nombre){
                    return sonidosCargados[i].audio;
                }
            }
            return null;
        }
    }
}
