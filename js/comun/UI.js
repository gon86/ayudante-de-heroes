export const UI = iniciarUI();

/**
 * Inicia la interfaz de usuario permitiendo acceder a los elementos HTML
 * @returns {Object} Objeto literal con sus propiedades y métodos
 */
function iniciarUI(){
    const celdas = document.querySelectorAll("#escenario .fila .columna");
    let habilitada = false;

    return {
        filas: document.querySelectorAll("#escenario .fila"),
        heroes: document.getElementById("heroes"),
        escenario: document.getElementById("escenario"),
        oro: document.querySelector("#oro .contenido span"),
        
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
            return document.querySelector("#heroes button.activo")
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