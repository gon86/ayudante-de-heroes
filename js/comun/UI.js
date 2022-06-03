export const UI = iniciarUI();

/**
 * Inicia la interfaz de usuario permitiendo acceder a los elementos HTML
 * @returns {Object} Objeto literal con sus propiedades y métodos
 */
function iniciarUI(){
    const $pantallas = document.getElementsByClassName("pantalla");
    const $intro = document.getElementById("intro");
    const celdas = document.querySelectorAll("#escenario .fila .columna");
    let habilitada = false;

    return {
        filas: document.querySelectorAll("#escenario .fila"),
        heroes: document.getElementById("heroes"),
        botonesHeroes: document.querySelectorAll("#heroes button"),
        escenario: document.getElementById("escenario"),
        oro: document.querySelector("#monedas span"),
        botonPartida: document.getElementById("b-partida"),
        botonAyuda: document.getElementById("b-ayuda"),
        botonVolver: document.getElementById("b-volver"),
        botonAudio: document.getElementById("b-audio"),
        botonContinuar: document.getElementById("b-continuar"),
        juego: document.getElementById("juego"),
        victoria: document.getElementById("victoria"),
        derrota: document.getElementById("derrota"),
        nivel: document.getElementById("numero-nivel"),
        ayuda: {
            elfo: {
                imagen: document.querySelector("#elfo .imagen"),
                caracteristicas: document.querySelector("#elfo .caracteristicas")
            },
            caballero: {
                imagen: document.querySelector("#caballero .imagen"),
                caracteristicas: document.querySelector("#caballero .caracteristicas")
            },
            mago: {
                imagen: document.querySelector("#mago .imagen"),
                caracteristicas: document.querySelector("#mago .caracteristicas")
            },
            zombie: {
                imagen: document.querySelector("#zombie .imagen"),
                caracteristicas: document.querySelector("#zombie .caracteristicas")
            },
            ogro: {
                imagen: document.querySelector("#ogro .imagen"),
                caracteristicas: document.querySelector("#ogro .caracteristicas")
            },
            demonio: {
                imagen: document.querySelector("#demonio .imagen"),
                caracteristicas: document.querySelector("#demonio .caracteristicas")
            }
        },
        
        /**
         * Muestra el popup victoria
         */
        mostrarVictoria(){
            this.victoria.style.display = "block";
        },

        /**
         * Oculta el popup victoria
         */
        ocultarVictoria(){
            this.victoria.style.display = "none";
        },

        /**
         * Muestra el popup derrota
         */
        mostrarDerrota(){
            this.derrota.style.display = "block";
        },

        /**
         * Oculta el popup derrota
         */
        ocultarDerrota(){
            this.derrota.style.display = "none";
        },

        /**
         * Muestra la cuenta de la intro
         */
        mostrarIntro(){
            $intro.style.display = "block";
        },

        /**
         * Oculta la cuenta de la intro
         */
        ocultarIntro(){
            $intro.style.display = "none";
        },

        /**
         * Muestra una pantalla específica
         * @param {String} id El id del elemento HTML
         */
        mostrarPantalla: function(id){
            for(let i=0; i<$pantallas.length; i++){
                if($pantallas[i].classList.contains("pantalla-activa")){
                    $pantallas[i].classList.remove("pantalla-activa");
                    break;
                }
            }

            document.getElementById(id).classList.add("pantalla-activa");
        },
        
        /**
         * Obtiene el estado de la interfaz
         * @returns {Boolean} Indica si la interfaz está habilitada
         */
        habilitada(){
            return habilitada;
        },

        /**
         * Habilita la interfaz
         */
        habilitar(){
            habilitada = true;
        },

        /**
         * Deshabilita la interfaz
         */
        deshabilitar(){
            habilitada = false;
        },

        /**
         * Obtiene el botón del héroe activo
         * @returns {Object} Elemento HTML
         */
        obtenerHeroeActivo: function(){
            return document.querySelector("#heroes button.activo");
        },

        /**
         * Obtiene el span del héroe activo
         * @returns {Object} Elemento HTML
         */
        obtenerSpanHeroeActivo: function(){
            return document.querySelector("#heroes button span.activo");
        },

        /**
         * Obtiene una celda específica
         * @param {Number} pFila La fila
         * @param {Number} pColumna La columna
         * @returns {Object} La celda
         */
        obtenerCelda: function(pFila, pColumna){
            for(let i=0; i<celdas.length; i++){
                if(parseFloat(celdas[i].dataset.f) === pFila && parseFloat(celdas[i].dataset.c) === pColumna){
                    return celdas[i];
                }
            }
            
            return null;
        },

        /**
         * Obtiene la celda de la siguiente fila
         * @param {Number} pFila La fila
         * @param {Number} pColumna La columna
         * @returns {Object} La celda
         */
        obtenerSiguienteCelda: function(pFila, pColumna){
            for(let i=0; i<celdas.length; i++){
                if(parseFloat(celdas[i].dataset.f) === (pFila+1) && parseFloat(celdas[i].dataset.c) === pColumna){
                    return celdas[i];
                }
            }
            
            return null;
        }
    }
}