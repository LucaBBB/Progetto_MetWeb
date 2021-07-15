class Task{

    constructor(id, titolo, descrizione, categoria, immagine, creatore) {
        this.id = id;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.categoria = categoria;
        this.immagine = immagine;
        this.creatore = creatore;
    }
}

module.exports = Task;