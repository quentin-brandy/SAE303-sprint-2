

class Event {
    #id;
    #summary;
    #description;
    #start;
    #end;
    #location;
    #groups;
    #type;
    #semestre;

    constructor(id, summary, description, start, end, location) {
        this.#id = id;
        this.#summary = summary.slice(0, summary.lastIndexOf(','));
        this.#description = description;
        this.#start = new Date(start);
        this.#end = new Date(end);
        this.#location = location;

        this.#groups = summary.slice(summary.lastIndexOf(',')+1);
        this.#groups = this.#groups.split('.');
        this.#groups = this.#groups.map( gr => gr.replace(/\s/g, "") );

        if (this.#summary.includes("CM")) {
            this.#type = "CM";
        } else if (this.#summary.includes("TD")) {
            this.#type = "TD";
        } else if (this.#summary.includes("TP")) {
            this.#type = "TP";
        } else {
            this.#type = "OTHER";
        }
        let regex = /[0-6]/;
        this.#semestre = summary.match(regex);
     
    }

    get id() {
        return this.#id;
    }

    get summary() {
        return this.#summary;
    }

    get description() {
        return this.#description;
    }

    get start() {
        return this.#start;
    }

    get end() {
        return this.#end;
    }

    get location() {
        return this.#location;
    }

    get groups() {
        return this.#groups.map( gr => gr); // retourne une copie du tableau
    }

    // retourne un objet contenant les informations de l'événement
    // dans un format compatible avec Toast UI Calendar (voir https://nhn.github.io/tui.calendar/latest/EventObject)
    toObject() {
        return {
            id: this.#id,
            title: this.#summary,
            body: this.#description,
            start: this.#start,
            end: this.#end,
            location: this.#location,
            type: this.#type,
            groups: this.#groups,
            semestre: this.#semestre
        }
    }
}

export {Event};