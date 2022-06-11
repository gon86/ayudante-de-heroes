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

    crearPersonajesAyuda();
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

    /**
     * Nueva partida
     */
    UI.botonPartida.addEventListener("click", function(e){
        tiempoEnemigo = 4250;
        cantidadEnemigos = 5;
        nivel = 0;
        oro = 150;
        nuevaPartida(false);
    });

    /**
     * Eventos del contenedor juego
     */
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

    /**
     * Botón ayuda
     */
    UI.botonAyuda.addEventListener("click", function(e){
        reproducirAudio(audioClick);
        UI.mostrarPantalla("ayuda");
    });

    /**
     * Botón volver ayuda
     */
    UI.botonVolver.addEventListener("click", function(e){
        reproducirAudio(audioClick);
        UI.mostrarPantalla("menu");
    });

    /**
     * Activar o desactivar audio
     */
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

    /**
     * Continuar partida actual
     */
    UI.botonContinuar.addEventListener("click", function(e){
        UI.mostrarPantalla("juego");
        reproducirAudio(audioClick);
    });

    /**
     * Eventos botones heroes
     */
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

    /**
     * Eventos de los casilleros
     */
    UI.escenario.addEventListener("click", function(e){        
        const precio = precios[heroeActivo];

        if(UI.habilitada() && heroeActivo !== null){
            if(e.target.classList.contains("columna") && e.target.children.length === 0){     // Celda vacía
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
            else if(e.target.localName === "img"){          // Celda ocupada
                const heroe = new Heroe(heroeActivo),
                      img = e.target,
                      contenedor = img.parentElement,
                      celda = contenedor.parentElement,
                      fila = parseInt(celda.dataset.f),
                      columna = parseInt(celda.dataset.c);

                if(escenario[fila][columna] !== null){
                    if(escenario[fila][columna].constructor.name === "Heroe" && comprarHeroe(precio)){
                        limpiarCelda(celda);
                        celda.appendChild(heroe.obtenerImagen());
                        escenario[fila][columna] = heroe;
                        reproducirAudio(audioClick);
                    }
                    else if(escenario[fila][columna].constructor.name === "Moneda"){
                        limpiarCelda(celda);
                        escenario[fila][columna] = null;
                        oro += 30;
                        UI.oro.textContent = oro;
                        reproducirAudio(audioMoneda);
                    }
                }
            }
        }
    });

    /**
     * Crea los personajes de la ayuda
     */
    function crearPersonajesAyuda(){
        const elfo = new Heroe("elfo");
        UI.ayuda.elfo.imagen.appendChild(elfo.obtenerImagen());
        UI.ayuda.elfo.caracteristicas.innerHTML = `
            Salud: ${elfo.salud} <br>  
            Ataque: ${elfo.ataque} <br>
            Precio: $${precios.elfo}  
        `;

        const caballero = new Heroe("caballero");
        UI.ayuda.caballero.imagen.appendChild(caballero.obtenerImagen());
        UI.ayuda.caballero.caracteristicas.innerHTML = `
            Salud: ${caballero.salud} <br>  
            Ataque: ${caballero.ataque} <br>
            Precio: $${precios.caballero}  
        `;

        const mago = new Heroe("mago");
        UI.ayuda.mago.imagen.appendChild(mago.obtenerImagen());
        UI.ayuda.mago.caracteristicas.innerHTML = `
            Salud: ${mago.salud} <br>  
            Ataque: ${mago.ataque} <br>
            Precio: $${precios.mago}  
        `;

        const zombie = new Enemigo("zombie");
        UI.ayuda.zombie.imagen.appendChild(zombie.obtenerImagen());
        UI.ayuda.zombie.caracteristicas.innerHTML = `
            Salud: ${zombie.salud} <br>  
            Ataque: ${zombie.ataque} 
        `;

        const ogro = new Enemigo("ogro");
        UI.ayuda.ogro.imagen.appendChild(ogro.obtenerImagen());
        UI.ayuda.ogro.caracteristicas.innerHTML = `
            Salud: ${ogro.salud} <br>  
            Ataque: ${ogro.ataque} 
        `;

        const demonio = new Enemigo("demonio");
        UI.ayuda.demonio.imagen.appendChild(demonio.obtenerImagen());
        UI.ayuda.demonio.caracteristicas.innerHTML = `
            Salud: ${demonio.salud} <br>  
            Ataque: ${demonio.ataque} 
        `;
    }

    /**
     * Reproduce el audio cuando está activado
     * @param {Audio} audio el audio a reproducir
     */
    function reproducirAudio(audio){
        if(audioActivado){
            audio.stop();
            audio.play();
        }
    }

    /**
     * Detiene la reproducción del audio cuando está activado
     * @param {Audio} audio el audio a detener
     */
    function detenerAudio(audio){
        if(audioActivado){
            audio.stop();
        }
    }

    /**
     * Crea una nueva partida
     * @param {Boolean} reintentar Indica si se vuelve a jugar la partida
     */
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

    /**
     * Establece los valores iniciales para comenzar el juego
     */
    function comenzarJuego(){
        reproducirAudio(audioMusica);
        reproduciendoMusica = true;
        celdasEnemigos = [];
        enemigosDerrotados = 0;
        indiceEnemigoActual = 0;
        crearCeldasEnemigos();
        loop();
    }

    /**
     * Actualiza los valores del nivel
     * @param {Boolean} reintentar Indica si se vuelve a jugar la partida
     */
    function actualizarNivel(reintentar){
        if(!reintentar){
            nivel++;

            if(tiempoEnemigo > 1500){
                tiempoEnemigo -= 250;
            }
            if(cantidadEnemigos < 16){
                cantidadEnemigos++;
            }
        }

        UI.nivel.textContent = nivel;
    }

    /**
     * Desactiva el botón de héroe
     */
    function quitarUltimoActivo(){
        if(UI.obtenerHeroeActivo() !== null){
            UI.obtenerHeroeActivo().classList.remove("activo");
            UI.obtenerSpanHeroeActivo().classList.remove("activo");
        }
    }

    /**
     * Permite comprar un héroe
     * @param {Number} precio El precio
     * @returns {Boolean} Si la compra del héroe es exitosa
     */
    function comprarHeroe(precio){
        if(oro >= precio){
            oro -= precio; 
            UI.oro.textContent = oro;
            return true;
        }

        return false;
    }
    
    /**
     * Inicia el array escenario
     */
    function iniciarEscenario(){
        escenario = [];

        for(let i=0; i<UI.filas.length; i++){
            const fila = [];
            for(let j=0; j<UI.filas[i].children.length; j++){
                const celda =  UI.filas[i].children[j];
                if(celda.children.length > 0){
                    limpiarCelda(celda);
                }
                celda.dataset.f = i;
                celda.dataset.c = j;
                fila.push(null);
            }   
            escenario.push(fila);
        }
    }

    /**
     * Define el loop del juego
     */
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
                                limpiarCelda(celdaGanador);
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

    /**
     * Genera una nueva moneda
     */
    function generarMoneda(){
        const celdasLibres = obtenerCeldasLibres();

        if(celdasLibres.length > 0){
            const indice = obtenerAleatorio(celdasLibres.length);
            const celda = celdasLibres[indice];
            const moneda = new Moneda();    
            escenario[celda.fila][celda.columna] = moneda;
            UI.obtenerCelda(celda.fila, celda.columna).appendChild(moneda.obtenerImagen());
        }
    }

    /**
     * Obtiene las celdas disponibles
     * @returns {Array} Las celdas libres
     */
    function obtenerCeldasLibres(){
        const celdasLibres = [];

        for(let i=0; i<escenario.length; i++){
            for(let j=0; j<escenario[i].length; j++){
                if(escenario[i][j] === null && UI.obtenerCelda(i, j).children.length === 0){
                    celdasLibres.push({
                        fila: i,
                        columna: j
                    });
                }
            }   
        }

        return celdasLibres;
    }

    /**
     * Desplaza un enemigo hacia otro casillero
     * @param {Enemigo} enemigo El enemigo
     */
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
                    limpiarCelda(celdaEnemigo);
                    limpiarCelda(siguienteCelda);
                    siguienteCelda.appendChild(combate.obtenerImagen());         
                } else if(elementoEscenario.constructor.name === "Moneda"){
                    escenario[enemigo.obtenerPosicion().fila][posicion.columna] = enemigo;
                    limpiarCelda(siguienteCelda);
                    siguienteCelda.appendChild(elementoEnemigo);
                }

                verificarFin(enemigo, true);
            }, 900);
        }

    }

    /**
     * Elimina el contenido de una celda
     * @param {Object} celda El elemento que representa la celda
     */
    function limpiarCelda(celda){
        for(let i=0; i<celda.children.length; i++){
            celda.removeChild(celda.children[i]);
        }
    }

    /**
     * Verifica si es el fin del juego
     * @param {Personaje} personaje El personaje
     * @param {Boolean} esEnemigo Indica si es un enemigo
     */
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

    /**
     * Crea un nuevo enemigo
     */
    function generarEnemigo(){
        if(indiceEnemigoActual < cantidadEnemigos){
            const fila = 0,
                columna = celdasEnemigos[indiceEnemigoActual],
                celda = UI.filas[fila].children[columna];

            if(escenario[fila][columna] !== null && escenario[fila][columna].constructor.name === "Moneda"){
                escenario[fila][columna] = null;
                limpiarCelda(celda);
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

    /**
     * Define las celdas en las que aparecerán los enemigos
     */
    function crearCeldasEnemigos(){
        const cantidadColumnas = escenario[0].length;

        for(let i=0; i<cantidadEnemigos; i++){
            const indiceColumna = obtenerAleatorio(cantidadColumnas);
            celdasEnemigos.push(indiceColumna);
        }
    }

    /**
     * Obtiene un número aleatorio
     * @param {Number} limite El número límite
     * @returns {Number} El número generado
     */
    function obtenerAleatorio(limite){
        return Math.floor(Math.random() * limite);
    }
}
