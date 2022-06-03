import { Sprite } from "./Sprite.js";

/**
 * Permite controlar la moneda
 */
export class Moneda extends Sprite {
    /**
     * Crea la moneda estableciendo su posición
     */
    constructor(){
        super();
        this.establecerPosYImagen(6);
    }
}