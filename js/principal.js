import { UI } from "./comun/UI.js";
import { GestorRecursos } from "./comun/GestorRecursos.js";
import { Heroe } from "./clases/Heroe.js";
import { Enemigo } from "./clases/Enemigo.js";
import { Combate } from "./clases/Combate.js";
import { Moneda } from "./clases/Moneda.js";

/**
 * Una vez cargado el DOM, se cargan los recursos
 */
window.addEventListener("DOMContentLoaded", function(e){ GestorRecursos.cargar(iniciar) });

/**
 * Inicia la aplicación
 */
function iniciar(){
    const precios = { elfo: 10, caballero: 30, mago: 40 };
    let escenario;
    let celdasEnemigos;
    let oro;
    let tiempoEnemigo;
    let cantidadEnemigos;
    let enemigosDerrotados;
    let indiceEnemigoActual;
    let heroeActivo ;    
    let idIntervalo;

    UI.mostrarPantalla("menu");

    UI.botonPartida.addEventListener("click", function(e){
        UI.mostrarPantalla("juego");
        setTimeout(function(){
            nuevaPartida();
            UI.habilitar();
            UI.ocultarIntro();
        }, 3000);
    });

    UI.botonAyuda.addEventListener("click", function(e){
        
    });

    UI.botonAudio.addEventListener("click", function(e){
        
    });

    UI.botonContinuar.addEventListener("click", function(e){
        
    });

    UI.heroes.addEventListener("click", function(e){
        if(UI.habilitada()){
            if(e.target.localName === "button"){
                quitarUltimoActivo();
                e.target.classList.add("activo");
                e.target.children[1].classList.add("activo");
                heroeActivo = e.target.dataset.tipo;
            } else if (e.target.localName === "img" || e.target.localName === "span"){
                quitarUltimoActivo();
                e.target.parentElement.classList.add("activo");
                e.target.parentElement.children[1].classList.add("activo");
                heroeActivo = e.target.parentElement.dataset.tipo;
            }
        }
    });

    UI.escenario.addEventListener("click", function(e){        
        const precio = precios[heroeActivo];

        if(UI.habilitada() && heroeActivo !== null){
            if(e.target.classList.contains("columna")){
                const heroe = new Heroe(heroeActivo),
                      celda = e.target,
                      fila = parseInt(celda.dataset.f),
                      columna = parseInt(celda.dataset.c);

                if(fila !== 0 && comprarHeroe(precio)){
                    celda.appendChild(heroe.obtenerImagen());
                    escenario[fila][columna] = heroe;  
                }
            } 
            else if(e.target.localName === "img"){
                const heroe = new Heroe(heroeActivo),
                      img = e.target,
                      contenedor = img.parentElement,
                      celda = contenedor.parentElement,
                      fila = parseInt(celda.dataset.f),
                      columna = parseInt(celda.dataset.c);

                if(escenario[fila][columna].constructor.name === "Heroe" && comprarHeroe(precio)){
                    celda.removeChild(contenedor);
                    celda.appendChild(heroe.obtenerImagen());
                    escenario[fila][columna] = heroe;
                }
                else if(escenario[fila][columna].constructor.name === "Moneda"){
                    celda.removeChild(contenedor);
                    escenario[fila][columna] = null;
                    oro += 25;
                    UI.oro.textContent = oro;
                }
            }
        }
    });

    function nuevaPartida(){
        celdasEnemigos = [];
        oro = 100;
        tiempoEnemigo = 5000;
        cantidadEnemigos = 6;
        enemigosDerrotados = 0;
        indiceEnemigoActual = 0;
        heroeActivo = null;    
        UI.oro.textContent = oro;

        iniciarEscenario();
        crearCeldasEnemigos();
        loop();
    }

    function quitarUltimoActivo(){
        if(UI.obtenerHeroeActivo() !== null){
            UI.obtenerHeroeActivo().classList.remove("activo");
            UI.obtenerSpanHeroeActivo().classList.remove("activo");
        }
    }

    function comprarHeroe(precio){
        if(oro >= precio){
            oro -= precio; 
            UI.oro.textContent = oro;
            return true;
        }

        return false;
    }
    
    function iniciarEscenario(){
        escenario = [];

        for(let i=0; i<UI.filas.length; i++){
            const fila = [];
            for(let j=0; j<UI.filas[i].children.length; j++){
                UI.filas[i].children[j].dataset.f = i;
                UI.filas[i].children[j].dataset.c = j;
                fila.push(null);
            }   
            escenario.push(fila);
        }
    }

    function loop(){
        const duracionFrame = 200;
        let tiempoActual = 0;

        generarEnemigo();

        idIntervalo = setInterval(function(){
            for(let i=0; i<escenario.length; i++){
                for(let j=0; j<escenario[i].length; j++){
                    const objeto = escenario[i][j];

                    if(objeto !== null){
                        if(objeto.constructor.name === "Heroe" || objeto.constructor.name === "Moneda"){
                            objeto.siguienteFrame();
                        } else if(objeto.constructor.name === "Enemigo"){
                            objeto.siguienteFrame();
                            if(objeto.puedeAvanzar(duracionFrame, tiempoActual, tiempoEnemigo, escenario.length)){
                                moverEnemigo(objeto);
                            }
                        } else if(objeto.constructor.name === "Combate"){
                            const ganador = objeto.siguienteTurno();
                            if(ganador !== null){
                                escenario[i][j] = ganador;
                                const celdaGanador = UI.obtenerCelda(i, j);
                                celdaGanador.removeChild(celdaGanador.children[0]);
                                celdaGanador.appendChild(ganador.obtenerImagen());
                                if(ganador.constructor.name === "Enemigo"){
                                    ganador.combatiendo(false);
                                    verificarFin(ganador, true);
                                } 
                                else {
                                    enemigosDerrotados++;
                                    verificarFin(ganador, false);
                                }
                            }
                        }
                    }
                }   
            }

            tiempoActual += duracionFrame;

            if(tiempoActual >= tiempoEnemigo){
                generarEnemigo();
                tiempoActual = 0;
            }
        }, duracionFrame);
    }

    function generarMoneda(){
        const celdasLibres = obtenerCeldasLibres();
        const indice = obtenerAleatorio(celdasLibres.length);
        const celda = celdasLibres[indice];
        const moneda = new Moneda();

        escenario[celda.fila][celda.columna] = moneda;
        UI.obtenerCelda(celda.fila, celda.columna).appendChild(moneda.obtenerImagen());
    }

    function obtenerCeldasLibres(){
        const celdasLibres = [];

        for(let i=0; i<escenario.length; i++){
            for(let j=0; j<escenario[i].length; j++){
                if(escenario[i][j] === null){
                    celdasLibres.push({
                        fila: i,
                        columna: j
                    });
                }
            }   
        }

        return celdasLibres;
    }

    function moverEnemigo(enemigo){
        const posicion = enemigo.obtenerPosicion();
        const celdaEnemigo = UI.obtenerCelda(posicion.fila, posicion.columna);
        const elementoEnemigo = celdaEnemigo.children[0];
        const siguienteFilaEscenario = escenario[posicion.fila+1][posicion.columna];
  
        elementoEnemigo.classList.add("mover-enemigo");

        setTimeout(function(){
            escenario[posicion.fila][posicion.columna] = null;
            enemigo.establecerPosicion(posicion.fila+1, posicion.columna);
            elementoEnemigo.classList.remove("mover-enemigo");
            
            const siguienteCelda = UI.obtenerSiguienteCelda(posicion.fila, posicion.columna);
            const elementoEscenario = escenario[enemigo.obtenerPosicion().fila][posicion.columna];
            
            if(elementoEscenario === null ){
                escenario[enemigo.obtenerPosicion().fila][posicion.columna] = enemigo;
                siguienteCelda.appendChild(elementoEnemigo);
            } else if(elementoEscenario.constructor.name === "Heroe"){
                const combate = new Combate(elementoEscenario, enemigo);
                escenario[enemigo.obtenerPosicion().fila][posicion.columna] = combate;
                enemigo.combatiendo(true);
                celdaEnemigo.removeChild(elementoEnemigo);
                siguienteCelda.removeChild(siguienteCelda.children[0]);
                siguienteCelda.appendChild(combate.obtenerImagen());         
            } else if(elementoEscenario.constructor.name === "Moneda"){
                escenario[enemigo.obtenerPosicion().fila][posicion.columna] = enemigo;
                siguienteCelda.removeChild(siguienteCelda.children[0]);
                siguienteCelda.appendChild(elementoEnemigo);
            }

            verificarFin(enemigo, true);
        }, 900);
    }

    function verificarFin(personaje, esEnemigo){
        if(esEnemigo){
            if(!personaje.haLlegado() && !personaje.estaCombatiendo() && personaje.obtenerPosicion().fila >= (escenario.length - 1)){
                clearInterval(idIntervalo);
                UI.deshabilitar();
                personaje.establecerHaLlegado(true);
                console.log("Perdiste...");
            }
        }
        else {
            if(enemigosDerrotados === cantidadEnemigos){
                clearInterval(idIntervalo);
                UI.deshabilitar();
                console.log("¡Ganaste!");
            } else {
                generarMoneda();
            }
        }
    }

    function generarEnemigo(){
        if(indiceEnemigoActual < cantidadEnemigos){
            const fila = 0,
                columna = celdasEnemigos[indiceEnemigoActual],
                celda = UI.filas[fila].children[columna];

            if(escenario[fila][columna] !== null && escenario[fila][columna].constructor.name === "Moneda"){
                escenario[fila][columna] = null;
                celda.removeChild(celda.children[0]);
            }

            if(escenario[fila][columna] === null){
                const posiblesEnemigos = ["zombie", "ogro", "demonio"],
                    indiceEnemigo = obtenerAleatorio(posiblesEnemigos.length),
                    enemigo = new Enemigo(posiblesEnemigos[indiceEnemigo]);

                enemigo.establecerPosicion(fila, columna);
                celda.appendChild(enemigo.obtenerImagen());
                escenario[fila][columna] = enemigo;
                indiceEnemigoActual++;
            }
        }
    }

    function crearCeldasEnemigos(){
        const cantidadColumnas = escenario[0].length;

        for(let i=0; i<cantidadEnemigos; i++){
            const indiceColumna = obtenerAleatorio(cantidadColumnas);
            celdasEnemigos.push(indiceColumna);
        }
    }

    function obtenerAleatorio(limite){
        return Math.floor(Math.random() * limite);
    }
}
