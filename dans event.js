if (this.#summary.includes("CM")) {
            this.#type = "CM";
        } else if (this.#summary.includes("TD")) {
            this.#type = "TD";
        } else if (this.#summary.includes("TP")) {
            this.#type = "TP";
        } else {
            this.#type = "OTHER";
        }
