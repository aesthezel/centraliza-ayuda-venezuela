
class Manager {

    #apiManager;
    #sideBar;
    #viewManager;
    #searchText;
    #selectedTagZone;
    
    constructor(config) {
        
        this.#apiManager = config.apiManager;
        this.#sideBar = config.sideBar;
        this.#searchText = config.searchText;
        this.#selectedTagZone = config.selectedTagZone;
        this.#viewManager = config.viewManager;
    }

    setupSearchTextChange() {

        this.#searchText.setOnValueChangeListener((value) => {
        
            const tags = this.#sideBar.getSelectedTags();
            this.#requestSites(value,tags);
        });
    }

    setupSidebarTagsClick() {
        
        this.#sideBar.setOnTagItemClickListener((allTags) => {

            const text = this.#searchText.getText() == "" ? null:this.#searchText.getText();
            this.#selectedTagZone.setSelectedTags(allTags);
            this.#requestSites(text,allTags);
        });

    }

    setupSeletedTagsZoneClick() {

        this.#selectedTagZone.setOnRemoveTagListener((allSelectedItems) => {

            const text = this.#searchText.getText() == "" ? null:this.#searchText.getText();
            this.#sideBar.updateSelectedItems(allSelectedItems);
            this.#requestSites(text,allSelectedItems);
        });
    }

    initSitesLoad() {
        this.#requestSites(null,[]);
    }

    initTagsLoad() {
        
        this.#apiManager.getTags({})
            .then((res) => {
                this.#sideBar.setTagItems(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                
            });
    }

    #requestSites(textToSearch, tags) {
        
        this.#searchText.showLoading(true);
        this.#apiManager.seachForSites({
            "textToSearch":textToSearch,
            "tags":tags
        })
            .then((res) => {
                
                this.#viewManager.hideErrors();
                this.#viewManager.cleanView();
                if(res?.data?.length > 0) {
                    this.#viewManager.showResult(res.data);
                }
                else{
                    this.#viewManager.showError("No se encontraron coincidencias.");
                }
            })
            .catch((err) => {
                console.error(err);
                this.#viewManager.hideErrors();
                this.#viewManager.cleanView();
                this.#viewManager.showError("No se pudieron cargar los datos del directorio. Por favor, intente de nuevo más tarde.");
            })
            .finally(() => {
                this.#searchText.showLoading(false);
            });
    }
}

function main() {

   const apiSettings = {
      "baseUrl":"http://localhost:3000"
   };
   
   const apiManager = new ApiManager(apiSettings);
   const resultItemViewBuilder = new ResultItemViewBuilder({ rootView: document });
   const viewManager = new View(document, { resultItemViewBuilder: resultItemViewBuilder });
   
   // ==============================
   // ==== tag item view builder ===
   // ==============================
   const tagItemViewBuilder = new TagItemViewBuilder({ rootView: document });

   // =============================
   // ==== selected tag zone ======
   // =============================
   const selectedTagZone = new TagSelectedZone({
       containerElement: document.getElementById('tags-selected-zone'),
       tagItemViewBuilder: tagItemViewBuilder
   });

   // =========================
   // ====== side bar =========
   // =========================
   const sideBar = new SideBar({
       sidebarElement: document.getElementById('sidebar-nav'),
       overlayElement: document.querySelector('.sidebar-overlay'),
       closeButtonElement: document.querySelector('.sidebar__close-button'),
       hamburgerButtonElement: document.querySelector('.header__menu-button'),
       tagItemViewBuilder: tagItemViewBuilder
   });

   // =========================
   // ====== search text ======
   // =========================
   const searchTextInput = document.getElementById("search-text-input");
   const magnifierElement = document.querySelector('.search-bar__icon--magnifier');
   const spinnerElement = document.querySelector('.search-bar__icon--spinner');
   const searchText = new SeachText({
        "searchTextInput":searchTextInput,
        "magnifierElement":magnifierElement,
        "spinnerElement":spinnerElement,
        "debounceDelay":300
   });
   
   
   const manager = new Manager({
        apiManager:apiManager,
        sideBar:sideBar,
        searchText:searchText,
        selectedTagZone:selectedTagZone,
        viewManager:viewManager,
   });

    manager.initSitesLoad();
    manager.initTagsLoad();
    manager.setupSearchTextChange();
    manager.setupSidebarTagsClick();
    manager.setupSeletedTagsZoneClick();
}

window.addEventListener("load", main);
