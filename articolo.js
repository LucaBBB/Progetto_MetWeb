class Task{

    constructor(id, titolo, descrizione, categoria, immagine, id_autore) {
        this.id = id;
        this.titolo = titolo;
        this.descrizione = descrizione;
        this.categoria = categoria;
        this.immagine = immagine;
        this.id_autore = id_autore;
    }
}

module.exports = Task;