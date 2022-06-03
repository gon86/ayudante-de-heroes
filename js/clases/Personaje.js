import { Sprite } from "./Sprite.js";

/**
 * Permite controlar un personaje
 */
export class Personaje extends Sprite {
    /**
     * Crea el personaje
     * @param {String} tipo El tipo de personaje
     */
    constructor(tipo){
        super();
        this.tipo = tipo;
        this.salud = 0;
        this.ataque = 0;
    }

    /**
     * Realiza un ataque
     * @param {Personaje} oponente El oponente
     * @returns {Boolean} Indica si el oponente ha sido derrotado
     */
    atacar(oponente){
        const ataque = this.obtenerAleatorio(this.ataque);
        oponente.salud -= ataque;

        if(oponente.salud <= 0){
            oponente.salud = 0;
            return true;
        }

        return false;
    }

    /**
     * Obtiene un número aleatorio
     * @param {Number} limite El número límite
     * @returns {Number} El número generado
     */
    obtenerAleatorio(limite){
        return Math.floor(Math.random() * limite);
    }
}