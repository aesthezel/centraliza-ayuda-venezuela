
class ApiManager {

    #apiSettings;

    static METHODS = Object.freeze({
        "GET": "GET",
        "POST": "POST",
    });

    constructor(apiSettings) {
        this.#apiSettings = apiSettings;
    }

    getSites = async (payload) => {

        /*
        // Future backend integration — uncomment when API is available
        const SUBMIT_PATH = "/api/sites";
        const url = `${this.#apiSettings.baseUrl}${SUBMIT_PATH}`;
        const response = await fetch(url, {
            method: ApiManager.METHODS.GET,
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
        */

        return this.#sites();
    }

    seachForSites = async (payload) => {

        const sites = this.#sites();
        const matches = [];
        const textToSearch = payload.textToSearch != null ? payload.textToSearch : null;

        if (textToSearch == null) {
            return sites;
        }

        const escapedText = textToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const containtWordRegex = new RegExp(escapedText, "i");

        sites.data.forEach((item) => {

            const searchArray = [];
            const name = item.nombre || '';
            const description = item.descripcion || '';
            let tags = item.tags != null ? item.tags : [];
            searchArray.push(name);
            searchArray.push(description);
            searchArray.push(...tags);

            for (const searchTerm of searchArray) {
                if (containtWordRegex.test(searchTerm)) {
                    matches.push(item);
                    break;
                }
            }
        });

        return { data: matches };
    }

    #sites = () => {

        return { data: SOURCES };
    }
}
