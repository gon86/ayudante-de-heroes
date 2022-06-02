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
    const audioClick = GestorRecursos.obtenerAudio("click.mp3"),
          audioDerrota = GestorRecursos.obtenerAudio("derrota.mp3"),
          audioMoneda = GestorRecursos.obtenerAudio("moneda.mp3"),
          audioMusica = GestorRecursos.obtenerAudio("musica.mp3"),
          audioNuevaPartida = GestorRecursos.obtenerAudio("nueva-partida.mp3"),
          audioVictoria = GestorRecursos.obtenerAudio("victoria.mp3"),
          precios = { elfo: 10, caballero: 30, mago: 40 };

    let audioActivado = true,
        reproduciendoMusica = false,
        tiempoEnemigo,
        cantidadEnemigos,
        nivel,
        oro,
        oroAnterior,
        escenario,
        celdasEnemigos,
        enemigosDerrotados,
        indiceEnemigoActual,
        heroeActivo,
        idIntervalo;

    audioMusica.loop();
    UI.mostrarPantalla("menu");

    /**
     * Al perder el foco la ventana, se desactiva el audio
     */
    window.addEventListener("blur", function(e){
        if(reproduciendoMusica){
            detenerAudio(audioMusica);
        }
    });

    /**
     * Al tomar foco la ventana, se activa el audio
     */
    window.addEventListener("focus", function(e){
        if(reproduciendoMusica){
            reproducirAudio(audioMusica);
        }
    });

    UI.botonPartida.addEventListener("click", function(e){
        tiempoEnemigo = 5200
        cantidadEnemigos = 3
        nivel = 0;
        oro = 100;
        nuevaPartida(false);
    });

    UI.juego.addEventListener("click", function(e){
        if(e.target.classList.contains("b-menu")){
            UI.botonContinuar.removeAttribute("disabled");
            UI.botonContinuar.style.display = "block";
            UI.mostrarPantalla("menu");
            reproducirAudio(audioClick);
        }
        else if(e.target.classList.contains("b-siguiente")){
            if(UI.victoria.style.display === "block"){
                oro += 100;
                nuevaPartida(false);
            }
            else if(UI.derrota.style.display === "block"){
                oro = oroAnterior;
                nuevaPartida(true);
            }
        }
    });

    UI.botonAyuda.addEventListener("click", function(e){
        reproducirAudio(audioClick);
    });

    UI.botonAudio.addEventListener("click", function(e){
        reproducirAudio(audioClick);
        if(audioActivado){
            UI.botonAudio.textContent = "Audio OFF";
            audioActivado = false;
        } else {
            UI.botonAudio.textContent = "Audio ON";
            audioActivado = true;
        }
    });

    UI.botonContinuar.addEventListener("click", function(e){
        UI.mostrarPantalla("juego");
        reproducirAudio(audioClick);
    });

    UI.heroes.addEventListener("click", function(e){
        if(UI.habilitada()){
            if(e.target.localName === "button"){
                quitarUltimoActivo();
                e.target.classList.add("activo");
                e.target.children[1].classList.add("activo");
                heroeActivo = e.target.dataset.tipo;
                reproducirAudio(audioClick);
            } else if (e.target.localName === "img" || e.target.localName === "span"){
                quitarUltimoActivo();
                e.target.parentElement.classList.add("activo");
                e.target.parentElement.children[1].classList.add("activo");
                heroeActivo = e.target.parentElement.dataset.tipo;
                reproducirAudio(audioClick);
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
                    reproducirAudio(audioClick);
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
                    reproducirAudio(audioClick);
                }
                else if(escenario[fila][columna].constructor.name === "Moneda"){
                    celda.removeChild(contenedor);
                    escenario[fila][columna] = null;
                    oro += 25;
                    UI.oro.textContent = oro;
                    reproducirAudio(audioMoneda);
                }
            }
        }
    });

    function reproducirAudio(audio){
        if(audioActivado){
            audio.play();
        }
    }

    function detenerAudio(audio){
        if(audioActivado){
            audio.stop();
        }
    }

    function nuevaPartida(reintentar){
        reproducirAudio(audioNuevaPartida);
        UI.mostrarPantalla("juego");
        UI.ocultarVictoria();
        UI.ocultarDerrota();
        UI.mostrarIntro();
        UI.oro.textContent = oro;
        oroAnterior = oro;
        heroeActivo = null;    
        iniciarEscenario();

        for(let i=0; i<UI.botonesHeroes.length; i++){
            if(UI.botonesHeroes[i].classList.contains("activo")){
                UI.botonesHeroes[i].classList.remove("activo");
                UI.botonesHeroes[i].children[1].classList.remove("activo");
            }
        }

        actualizarNivel(reintentar);
        setTimeout(function(){
            comenzarJuego();
            UI.habilitar();
            UI.ocultarIntro();
        }, 3000);
    }

    function comenzarJuego(){
        reproducirAudio(audioMusica);
        reproduciendoMusica = true;
        celdasEnemigos = [];
        enemigosDerrotados = 0;
        indiceEnemigoActual = 0;
        crearCeldasEnemigos();
        loop();
    }

    function actualizarNivel(reintentar){
        if(!reintentar){
            nivel++;

            if(tiempoEnemigo > 2000){
                tiempoEnemigo -= 200;
            }
            if(cantidadEnemigos < 10){
                cantidadEnemigos++;
            }
        }

        UI.nivel.textContent = nivel;
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
                const celda =  UI.filas[i].children[j];
                if(celda.children.length > 0){
                    celda.removeChild(celda.children[0]);
                }
                celda.dataset.f = i;
                celda.dataset.c = j;
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
  
        if(siguienteFilaEscenario === null || 
          (siguienteFilaEscenario !== null && 
          (siguienteFilaEscenario.constructor.name === "Heroe" || 
           siguienteFilaEscenario.constructor.name === "Moneda"))){

           elementoEnemigo.classList.add("mover-enemigo");
           escenario[posicion.fila][posicion.columna] = null;
    
            setTimeout(function(){
                enemigo.establecerPosicion(posicion.fila+1, posicion.columna);
                elementoEnemigo.classList.remove("mover-enemigo");
                
                const siguienteCelda = UI.obtenerSiguienteCelda(posicion.fila, posicion.columna);
                const elementoEscenario = escenario[enemigo.obtenerPosicion().fila][posicion.columna];
    
                if(elementoEscenario === null){
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

    }

    function verificarFin(personaje, esEnemigo){
        if(esEnemigo){
            if(!personaje.haLlegado() && !personaje.estaCombatiendo() && personaje.obtenerPosicion().fila >= (escenario.length - 1)){
                clearInterval(idIntervalo);
                UI.deshabilitar();
                personaje.establecerHaLlegado(true);
                UI.mostrarDerrota();
                detenerAudio(audioMusica);
                reproduciendoMusica = false;
                reproducirAudio(audioDerrota);
            }
        }
        else {
            if(enemigosDerrotados === cantidadEnemigos){
                clearInterval(idIntervalo);
                UI.deshabilitar();
                UI.mostrarVictoria();
                reproduciendoMusica = false;
                detenerAudio(audioMusica);
                reproducirAudio(audioVictoria);
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
