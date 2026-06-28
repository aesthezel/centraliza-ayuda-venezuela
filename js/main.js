function main() {

   const apiSettings = {
      "baseUrl":"http://localhost:3000"
   };
   
   const apiManager = new ApiManager(apiSettings);
   const viewManager = new View(document);
   
   const payload = {};
   
   
   apiManager.getSites(payload)
        .then((res) => {
                        
            viewManager.cleanView();
            viewManager.showResult(res.data);
        })
        .catch((err) => {
           
            console.error(err);
            viewManager.showError("No se pudieron cargar los datos del directorio. Por favor, intente de nuevo más tarde.");
        })
        .finally(() => {
            
        });
   
   // =========================
   // ====== side bar =========
   // =========================
   const sideBar = new SideBar({
       sidebarElement: document.getElementById('sidebar-nav'),
       overlayElement: document.querySelector('.sidebar-overlay'),
       closeButtonElement: document.querySelector('.sidebar__close-button'),
       hamburgerButtonElement: document.querySelector('.header__menu-button')
   });

   apiManager.getTags({})
        .then((res) => {
            sideBar.setTagItems(res.data);
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            
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
   
   searchText.setOnValueChangeListener((value) => {
        
        
        searchText.showLoading(true);
        apiManager.seachForSites({"textToSearch":value})
            .then((res) => {
                viewManager.hideErrors();
                viewManager.cleanView();
                if(res?.data?.length > 0) {
                    viewManager.showResult(res.data);
                }
                else{
                    viewManager.showError("No se encontraron coincidencias.");
                }
            })
            .catch((err) => {
                console.error(err);
                viewManager.hideErrors();
                viewManager.cleanView();
                viewManager.showError("No se pudieron cargar los datos del directorio. Por favor, intente de nuevo más tarde.");
            })
            .finally(() => {
                searchText.showLoading(false);
            });
   });

   
}

window.addEventListener("load", main);
