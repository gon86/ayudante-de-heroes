export class Personaje {
    constructor(tipo){
        this.tipo = tipo;
        this.experiencia = 0;
        this.salud = 0;
        this.ataque = 0;
        this.x = 0;
        this.tamano = 64;
        this.imagen = new Image();
        this.imagen.src = "imagenes/personajes.png";
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

    establecerPosYImagen(y){
        this.imagen.style.marginTop = (-y * this.tamano) + "px";
    }

    obtenerImagen(){
        const contenedor = document.createElement("div");
        contenedor.appendChild(this.imagen);
        contenedor.style.width = this.tamano + "px";
        contenedor.style.height = this.tamano + "px";
        contenedor.style.overflow = "hidden";
        contenedor.style.display = "inline-block";

        return contenedor;
    }

    siguienteFrame(){
        this.imagen.style.marginLeft = (-this.x * this.tamano) + "px";
        this.incrementarPosX();
    }

    incrementarPosX(){
        if(this.x >= 3){
            this.x = 0;
        } else {
            this.x++;
        }
    }
}