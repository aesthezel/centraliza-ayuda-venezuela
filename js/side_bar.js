class SideBar {

    #onTagItemClickListener;
    #allTagsItems;
    #selectedItems = [];

    #sidebarElement;
    #overlayElement;
    #closeButtonElement;
    #hamburgerButtonElement;
    #isOpen;
    #handleKeyDown;

    #tagStateMap = new Map();
    #scrollableElement;
    #tagItemViewBuilder;

    constructor(config) {
        if (!config.sidebarElement) throw new Error('SideBar: sidebarElement es requerido');
        if (!config.overlayElement) throw new Error('SideBar: overlayElement es requerido');
        if (!config.closeButtonElement) throw new Error('SideBar: closeButtonElement es requerido');
        if (!config.hamburgerButtonElement) throw new Error('SideBar: hamburgerButtonElement es requerido');
        if (!config.tagItemViewBuilder) throw new Error('SideBar: tagItemViewBuilder es requerido');

        this.#sidebarElement = config.sidebarElement;
        this.#overlayElement = config.overlayElement;
        this.#closeButtonElement = config.closeButtonElement;
        this.#hamburgerButtonElement = config.hamburgerButtonElement;
        this.#tagItemViewBuilder = config.tagItemViewBuilder;
        this.#isOpen = false;

        this.#handleKeyDown = this.#onKeyDown.bind(this);

        this.#hamburgerButtonElement.addEventListener('click', () => this.openMenu());
        this.#closeButtonElement.addEventListener('click', () => this.closeMenu());
        this.#overlayElement.addEventListener('click', () => this.closeMenu());

        this.#scrollableElement = this.#sidebarElement.querySelector('.sidebar__scrollable');
        this.#scrollableElement.addEventListener('click', (e) => this.#handleTagClick(e));
        this.#scrollableElement.addEventListener('keydown', (e) => this.#handleTagKeydown(e));
    }

    setOnTagItemClickListener(listenerFunc) {
        this.#onTagItemClickListener = listenerFunc;
    }

    getSelectedTags() {
        return this.#selectedItems;
    }

    updateSelectedItems(allSelectedItems) {
        const items = Array.isArray(allSelectedItems) ? allSelectedItems : [];
        this.#selectedItems = [...items];

        // Update tagStateMap to reflect the new selection
        for (const [tag] of this.#tagStateMap) {
            this.#tagStateMap.set(tag, items.includes(tag));
        }

        // Re-render buttons with correct states
        const buttons = this.#scrollableElement.querySelectorAll('.sidebar-tag-btn');
        buttons.forEach(button => {
            const tag = button.dataset.tag;
            const isActive = this.#tagStateMap.get(tag);
            if (isActive) {
                button.classList.add('sidebar-tag-btn--active');
                button.setAttribute('aria-checked', 'true');
            } else {
                button.classList.remove('sidebar-tag-btn--active');
                button.setAttribute('aria-checked', 'false');
            }
        });
    }

    setTagItems(itemList) {
        const items = Array.isArray(itemList) ? itemList : [];
        this.#allTagsItems = items;
        this.#tagStateMap.clear();
        for (const tag of items) {
            this.#tagStateMap.set(tag, false);
        }
        this.#selectedItems = [];
        this.#renderTagButtons();
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

    #renderTagButtons() {
        this.#scrollableElement.innerHTML = '';
        for (const tag of this.#allTagsItems) {
            const button = this.#tagItemViewBuilder.buildItemView(tag);
            this.#scrollableElement.appendChild(button);
        }
    }

    #handleTagClick(event) {
        const button = event.target.closest('.sidebar-tag-btn');
        if (!button) return;
        const tag = button.dataset.tag;
        this.#toggleTag(tag, button);
    }

    #handleTagKeydown(event) {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const button = event.target.closest('.sidebar-tag-btn');
        if (!button) return;
        event.preventDefault();
        const tag = button.dataset.tag;
        this.#toggleTag(tag, button);
    }

    #toggleTag(tag, button) {
        const currentState = this.#tagStateMap.get(tag);
        const newState = !currentState;
        this.#tagStateMap.set(tag, newState);

        if (newState) {
            button.classList.add('sidebar-tag-btn--active');
            button.setAttribute('aria-checked', 'true');
            this.#selectedItems.push(tag);
        } else {
            button.classList.remove('sidebar-tag-btn--active');
            button.setAttribute('aria-checked', 'false');
            this.#selectedItems = this.#selectedItems.filter(t => t !== tag);
        }

        this.#onTagsItemClickNotify();
    }
}