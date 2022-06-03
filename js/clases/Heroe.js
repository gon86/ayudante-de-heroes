import { Personaje } from "./Personaje.js";

/**
 * Controla al héroe
 */
export class Heroe extends Personaje {
    /**
     * Crea el héroe
     * @param {String} tipo El tipo de héroe
     */
    constructor(tipo){
        super(tipo);
        this.iniciar();
    }

    /**
     * Establece los valores iniciales para crear al héroe
     */
    iniciar(){
        let y = 0;

        switch (this.tipo) {
            case "elfo": 
                y = 0;
                this.salud = 75;
                this.ataque = 10;
                break;
            case "caballero":  
                y = 1;
                this.salud = 100;
                this.ataque = 25;
                break;
            case "mago":  
                y = 2;
                this.salud = 75;
                this.ataque = 50;
                break;
        }

        this.establecerPosYImagen(y);
    }
}