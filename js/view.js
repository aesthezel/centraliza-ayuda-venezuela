class View {

    #rootView;

    constructor(rootView) {
        this.#rootView = rootView;
    }

    cleanView() {
        const sitesList = this.#rootView.querySelector('#sites-list');
        if (sitesList) {
            sitesList.innerHTML = '';
        }
    }

    showResult(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return;
        }

        const sitesList = this.#rootView.querySelector('#sites-list');
        if (!sitesList) {
            return;
        }

        for (const site of data) {
            const li = document.createElement('li');
            li.className = 'site-card';

            if (site.nombre && site.url) {
                const a = document.createElement('a');
                a.href = site.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'site-name';
                a.textContent = site.nombre;
                li.appendChild(a);
            }

            if (site.descripcion) {
                const p = document.createElement('p');
                p.className = 'site-description';
                p.textContent = site.descripcion;
                li.appendChild(p);
            }

            sitesList.appendChild(li);
        }
    }

    showNoResults() {
        const sitesList = this.#rootView.querySelector('#sites-list');
        sitesList.innerHTML = '';
        const li = document.createElement('li');
        li.className = 'no-results-message';
        li.textContent = 'No se encontraron coincidencias para su búsqueda.';
        sitesList.appendChild(li);
    }

    showError(message) {
        const main = this.#rootView.querySelector('main');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.setAttribute('role', 'alert');
        errorDiv.textContent = message;
        main.appendChild(errorDiv);
    }
}
