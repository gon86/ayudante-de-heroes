import { Personaje } from "./Personaje.js";

/**
 * Controla al enemigo
 */
export class Enemigo extends Personaje {
    /**
     * Crea el enemigo
     * @param {String} tipo El tipo de enemigo
     */
    constructor(tipo){
        super(tipo);
        this.enCombate = false;
        this.llego = false;
        this.fila;
        this.columna;
        this.iniciar();
    }

    /**
     * Establece los valores iniciales para crear al enemigo
     */
    iniciar(){
        let y = 3;

        switch (this.tipo) {
            case "zombie": 
                y = 3;
                this.salud = 50;
                this.ataque = 10;
                break;
            case "ogro":  y = 4;
                this.salud = 75;
                this.ataque = 25;
                break;
            case "demonio":  y = 5;
                this.salud = 100;
                this.ataque = 40;
                break;
        }

        this.establecerPosYImagen(y);
    }

    /**
     * Determina si ha llegado a destino
     * @returns {Boolean} Indica si ha llegado
     */
    haLlegado(){
        return this.llego;
    }

    /**
     * Establece si ha llegado
     * @param {Boolean} haLlegado Indica si ha llegado
     */
    establecerHaLlegado(haLlegado){
        this.llego = haLlegado;
    }

    /**
     * Obtiene la posición
     * @returns {Object} Contiene la fila y columna
     */
    obtenerPosicion(){
        const fila = this.fila;
        const columna = this.columna;

        return { fila: fila, columna: columna };
    }

    /**
     * Establece la posición
     * @param {Number} fila El número de fila
     * @param {Number} columna El número de columna
     */
    establecerPosicion(fila, columna){
        this.fila = fila;
        this.columna = columna;
    }

    /**
     * Permite saber si puede avanzar de casillero
     * @param {Number} duracionFrame La duración del frame
     * @param {Number} tiempoActual El tiempo actual
     * @param {Number} tiempoEnemigo Indica cada cuánto tiempo aparece
     * @param {Number} totalFilas El total de filas del tablero
     * @returns {Boolean} Indica si puede avanzar
     */
    puedeAvanzar(duracionFrame, tiempoActual, tiempoEnemigo, totalFilas){
        if(!this.estaCombatiendo() && tiempoActual >= (tiempoEnemigo - duracionFrame) && 
            this.fila < (totalFilas - 1)){
            return true;
        }

        return false;
    }

    /**
     * Permite saber si está combatiendo
     * @returns {Boolean} Indica si está combatiendo
     */
    estaCombatiendo(){
        return this.enCombate;
    }

    /**
     * Establece si está en combate
     * @param {Boolean} enCombate Indica si está en combate
     */
    combatiendo(enCombate){
        this.enCombate = enCombate;
    }
}