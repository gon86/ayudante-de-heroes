import { Personaje } from "./Personaje.js";

export class Enemigo extends Personaje {
    constructor(tipo){
        super(tipo);
        this.enCombate = false;
        this.llego = false;
        this.fila;
        this.columna;
        this.iniciar();
    }

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

    haLlegado(){
        return this.llego;
    }

    establecerHaLlegado(haLlegado){
        this.llego = haLlegado;
    }

    obtenerPosicion(){
        const fila = this.fila;
        const columna = this.columna;

        return { fila: fila, columna: columna };
    }

    establecerPosicion(fila, columna){
        this.fila = fila;
        this.columna = columna;
    }

    puedeAvanzar(duracionFrame, tiempoActual, tiempoEnemigo, totalFilas){
        if(!this.estaCombatiendo() && tiempoActual >= (tiempoEnemigo - duracionFrame) && 
            this.fila < (totalFilas - 1)){
            return true;
        }

        return false;
    }

    estaCombatiendo(){
        return this.enCombate;
    }

    combatiendo(enCombate){
        this.enCombate = enCombate;
    }
}