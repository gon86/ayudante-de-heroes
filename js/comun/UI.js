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
        
        mostrarVictoria(){
            this.victoria.style.display = "block";
        },

        ocultarVictoria(){
            this.victoria.style.display = "none";
        },

        mostrarDerrota(){
            this.derrota.style.display = "block";
        },

        ocultarDerrota(){
            this.derrota.style.display = "none";
        },

        mostrarIntro(){
            $intro.style.display = "block";
        },

        ocultarIntro(){
            $intro.style.display = "none";
        },

        mostrarPantalla: function(id){
            for(let i=0; i<$pantallas.length; i++){
                if($pantallas[i].classList.contains("pantalla-activa")){
                    $pantallas[i].classList.remove("pantalla-activa");
                    break;
                }
            }

            document.getElementById(id).classList.add("pantalla-activa");
        },
        
        habilitada(){
            return habilitada;
        },

        habilitar(){
            habilitada = true;
        },

        deshabilitar(){
            habilitada = false;
        },

        obtenerHeroeActivo: function(){
            return document.querySelector("#heroes button.activo");
        },

        obtenerSpanHeroeActivo: function(){
            return document.querySelector("#heroes button span.activo");
        },

        obtenerCelda: function(pFila, pColumna){
            for(let i=0; i<celdas.length; i++){
                if(parseFloat(celdas[i].dataset.f) === pFila && parseFloat(celdas[i].dataset.c) === pColumna){
                    return celdas[i];
                }
            }
            
            return null;
        },

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