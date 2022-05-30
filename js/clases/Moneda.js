export class Moneda {
    constructor(){
        this.x = 0;
        this.tamano = 64;
        this.imagen = new Image();
        this.imagen.src = "imagenes/moneda-giratoria.png";
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