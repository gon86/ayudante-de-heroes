import { Sprite } from "./Sprite.js";

export class Personaje extends Sprite {
    constructor(tipo){
        super();
        this.tipo = tipo;
        this.salud = 0;
        this.ataque = 0;
    }

    atacar(oponente){
        const ataque = this.obtenerAleatorio(this.ataque);
        oponente.salud -= ataque;

        if(oponente.salud <= 0){
            oponente.salud = 0;
            return true;
        }

        return false;
    }

    obtenerAleatorio(limite){
        return Math.floor(Math.random() * limite);
    }
}