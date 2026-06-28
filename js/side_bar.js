class SideBar {

    #onTagItemClickListener;
    #allTagsItems;
    #selectedItems = [];

    constructor(config) {

    }

    setOnTagItemClickListener(listenerFunc) {
        this.#onTagItemClickListener = listenerFunc;
        
    }

    setTagItems(itemList) {
        //clean html view
        this.#allTagsItems = itemList;
        //add all items to html view
    }

    openMenu() {

    }

    closeMenu() {

    }

    #onTagsItemClickNotify(){
        
        if(this.#onTagItemClickListener != null) {
            this.#onTagItemClickListener(this.#selectedItems);
        }
    }
}