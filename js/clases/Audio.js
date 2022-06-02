/**
 * Permite controlar el audio del juego
 */
export class Audio {
    /**
     * Crea el audio con su configuración inicial
     * @param {String} src El nombre del audio a crear con su extensión
     */
    constructor(src){
        this.nombre = src;
        this.sonido = document.createElement("audio");
        this.sonido.src = "audio/" + src;
        this.sonido.setAttribute("preload", "auto");
        this.sonido.setAttribute("controls", "none");
        this.sonido.style.display = "none";
        document.body.appendChild(this.sonido);
    }

    /**
     * Obtiene el elemento audio
     * @returns {Object} La etiqueta audio
     */
    obtenerSonido(){
        return this.sonido;
    }
    /**
     * Obtiene el nombre del audio
     * @returns {String} El nombre con su extensión 
     */
    obtenerNombre(){
        return this.nombre;
    }

    /**
     * Establece el atributo loop en true para que se reproduzca indefinidamente
     */
    loop(){
        this.sonido.loop = true;
    }

    /**
     * Inicia la reproducción
     */
    play(){
        this.sonido.play();
    }

    /**
     * Detiene la reproducción
     */
    stop(){
        this.sonido.pause();
        this.sonido.currentTime = 0;
    }
}