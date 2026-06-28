
class ApiManager {

    #apiSettings;

    #sitesByTag = null;

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

        return { data: this.#sites() };
    }

    getTags = async (payload) => {
        
        const tags = this.#tags();
        return {data: tags}
    }

    seachForSites = async (payload) => {

        
        
        const textToSearch = payload.textToSearch != null ? payload.textToSearch : null;
        const selectedTags = payload.tags != null ? payload.tags : [];
        
        let sites;
        if (selectedTags.length > 0 ) {
            sites = this.#siteGroupByTag(selectedTags);
        }
        else {
            sites = this.#sites();
        }

        if (textToSearch == null) {
            return  { data:sites};
        }
        
        const matches = [];
        const escapedText = textToSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const containtWordRegex = new RegExp(escapedText, "i");

        sites.forEach((item) => {

            const searchArray = [];
            const name = item.nombre != null ? item.nombre:'';
            const description = item.descripcion != null ? item.descripcion:'';
            const tags = item.tags != null ? item.tags : [];
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

        return SOURCES; 
    }

    #tags = () => {
        
        const sites = this.#sites();
        
        const allTags = sites
            .map((item) => {
                return item.tags != null ? item.tags : [];
            })
            .flatMap((item) => item)
        ;

        const tags = [...new Set(allTags)].sort();
        
        return tags;
    }

    #siteGroupByTag(searchTags) {
        
        this.#initSiteGroupByTag();
        const tempResultSet = {};
        searchTags.forEach((tag) => {
            let groupSite = this.#sitesByTag[tag];
            if(groupSite == null) {
                groupSite = [];
            }
            groupSite.forEach((site) => {
                tempResultSet[site.id] = site;
            });
        });
        
        const resultSet = Object.values(tempResultSet).sort((a,b) => a.id - b.id);
        return resultSet;
    }

    #initSiteGroupByTag = () => {
       
        if(this.#sitesByTag == null) {
            this.#sitesByTag = {};
            const allTags = this.#tags();
            const sites = this.#sites();
            allTags.forEach((tagItem) => {
                
                sites.forEach( (siteItem) => {
                    const tags = siteItem.tags != null ? siteItem.tags : [];
                    if( tags.includes(tagItem)) {
                        let groupSite = this.#sitesByTag [tagItem];
                        if(groupSite == null) {
                            groupSite = []
                        }
                        groupSite.push(siteItem);
                        this.#sitesByTag[tagItem] = groupSite;
                    }
                });
            });
        }
    }
}
