/**
 * Permite controlar un combate
 */
export class Combate {
    /**
     * Crea el combate
     * @param {Heroe} heroe El héroe
     * @param {Enemigo} enemigo El enemigo
     */
    constructor(heroe, enemigo){
        this.heroe = heroe;
        this.enemigo = enemigo;
        this.tamano = 64;
        this.anchoBarra = 54;
        this.turnoHeroe = true;
        this.saludHeroe = document.createElement("div");
        this.saludEnemigo = document.createElement("div");
    }

    /**
     * Establece el siguiente turno
     * @returns {Personaje} El personaje al que le toca el turno
     */
    siguienteTurno(){
        let fin;
        let ultimoAtacante;

        if(this.turnoHeroe){
            fin = this.heroe.atacar(this.enemigo);
            this.actualizarAnchoBarra(this.enemigo, this.saludEnemigo);
            ultimoAtacante = this.heroe;
        } else {
            fin = this.enemigo.atacar(this.heroe);
            this.actualizarAnchoBarra(this.heroe, this.saludHeroe);
            ultimoAtacante = this.enemigo;
        }

        if(fin){
            return ultimoAtacante;
        }

        this.turnoHeroe = !this.turnoHeroe;
        return null;
    }

    /**
     * Actualiza el ancho de la barra de salud
     * @param {Personaje} personaje El personaje
     * @param {Object} barraSalud El elemento HTML que representa la barra
     */
    actualizarAnchoBarra(personaje, barraSalud){
        const anchoEnPx = personaje.salud * this.anchoBarra / 100;
        barraSalud.style.width = Math.round(anchoEnPx) + "px";
    }

    /**
     * Obtiene la imagen del combate
     * @returns {Object} Div que contiene las barras de ambos personajes
     */
    obtenerImagen(){
        const contenedor = document.createElement("div");
        contenedor.style.width = this.tamano + "px";
        contenedor.style.height = this.tamano + "px";
        contenedor.classList.add("contenedor-combate");

        this.saludHeroe.classList.add("salud-heroe");
        this.saludEnemigo.classList.add("salud-enemigo");

        contenedor.appendChild(this.saludHeroe);
        contenedor.appendChild(this.saludEnemigo);

        return contenedor;
    }
}