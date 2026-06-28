class SeachText {

    #searchText;
    #debounceDelay;
    #searchTimeout = null;

    #previusValue = null;

    #onValueChangeListener = null;

    constructor(config) {
        this.#searchText = config.searchTextInput;
        this.#debounceDelay = config.debounceDelay != null ? config.debounceDelay : 300;
        this.#searchText.addEventListener("input", this.#onInputHandler);
    }

    showLoading(isLoading) {
        const inputWrapper = this.#searchText.closest('.search-bar__input-wrapper');
        if (inputWrapper) {
            inputWrapper.classList.toggle('search-bar--loading', isLoading);
        }
        this.#searchText.setAttribute("aria-busy", `${isLoading}`);
    }

    setOnValueChangeListener(listenerFunc) {
        this.#onValueChangeListener = listenerFunc;
    }

    #onValueChangeNotify(value) {
        if (this.#onValueChangeListener != null) {
            this.#onValueChangeListener(value);
        }
    }

    #onInputHandler = (event) => {

        clearTimeout(this.#searchTimeout);
        let value = event.target.value.trim();

        if (value === "") {
            value = null;
        }

        this.#searchTimeout = setTimeout(() => {

            if (this.#previusValue != value) {
                this.#onValueChangeNotify(value);
                this.#previusValue = value;
            }

        }, this.#debounceDelay);
    }
}
