/**
 * Controla la hoja de sprites
 */
export class Sprite {
    /**
     * Crea un sprite
     */
    constructor(){
        this.x = 0;
        this.tamano = 64;
        this.imagen = new Image();
        this.imagen.src = "imagenes/sprites.png";
    }

    /**
     * Obtiene la imagen
     * @returns {Object} El div contenedor
     */
    obtenerImagen(){
        const contenedor = document.createElement("div");
        contenedor.appendChild(this.imagen);
        contenedor.style.width = this.tamano + "px";
        contenedor.style.height = this.tamano + "px";
        contenedor.style.overflow = "hidden";
        contenedor.style.display = "inline-block";

        return contenedor;
    }

    /**
     * Establece la posición de la imagen en el eje y
     * @param {Number} y La posición en y
     */
    establecerPosYImagen(y){
        this.imagen.style.marginTop = (-y * this.tamano) + "px";
    }

    /**
     * Avanza al siguiente frame
     */
    siguienteFrame(){
        this.imagen.style.marginLeft = (-this.x * this.tamano) + "px";
        this.incrementarPosX();
    }

    /**
     * Incrementa la posición en el eje x
     */
    incrementarPosX(){
        if(this.x >= 3){
            this.x = 0;
        } else {
            this.x++;
        }
    }
}