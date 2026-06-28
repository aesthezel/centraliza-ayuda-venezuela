class SideBar {

    #onTagItemClickListener;
    #allTagsItems;
    #selectedItems = [];

    // Campos privados para el menú lateral
    #sidebarElement;
    #overlayElement;
    #closeButtonElement;
    #hamburgerButtonElement;
    #isOpen;
    #handleKeyDown;

    constructor(config) {
        if (!config.sidebarElement) throw new Error('SideBar: sidebarElement es requerido');
        if (!config.overlayElement) throw new Error('SideBar: overlayElement es requerido');
        if (!config.closeButtonElement) throw new Error('SideBar: closeButtonElement es requerido');
        if (!config.hamburgerButtonElement) throw new Error('SideBar: hamburgerButtonElement es requerido');

        this.#sidebarElement = config.sidebarElement;
        this.#overlayElement = config.overlayElement;
        this.#closeButtonElement = config.closeButtonElement;
        this.#hamburgerButtonElement = config.hamburgerButtonElement;
        this.#isOpen = false;

        this.#handleKeyDown = this.#onKeyDown.bind(this);

        this.#hamburgerButtonElement.addEventListener('click', () => this.openMenu());
        this.#closeButtonElement.addEventListener('click', () => this.closeMenu());
        this.#overlayElement.addEventListener('click', () => this.closeMenu());
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
        if (this.#isOpen) return;
        this.#isOpen = true;
        this.#sidebarElement.classList.add('sidebar--open');
        this.#overlayElement.classList.add('sidebar-overlay--visible');
        this.#sidebarElement.setAttribute('aria-hidden', 'false');
        this.#hamburgerButtonElement.setAttribute('aria-expanded', 'true');
        document.addEventListener('keydown', this.#handleKeyDown);
        this.#closeButtonElement.focus();
    }

    closeMenu() {
        if (!this.#isOpen) return;
        this.#isOpen = false;
        this.#sidebarElement.classList.remove('sidebar--open');
        this.#overlayElement.classList.remove('sidebar-overlay--visible');
        this.#sidebarElement.setAttribute('aria-hidden', 'true');
        this.#hamburgerButtonElement.setAttribute('aria-expanded', 'false');
        document.removeEventListener('keydown', this.#handleKeyDown);
        this.#hamburgerButtonElement.focus();
    }

    #onKeyDown(event) {
        if (event.key === 'Escape') {
            this.closeMenu();
            return;
        }

        if (event.key === 'Tab') {
            const focusableElements = this.#getFocusableElements();
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    #getFocusableElements() {
        const selector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
        return [...this.#sidebarElement.querySelectorAll(selector)];
    }

    #onTagsItemClickNotify(){
        
        if(this.#onTagItemClickListener != null) {
            this.#onTagItemClickListener(this.#selectedItems);
        }
    }
}