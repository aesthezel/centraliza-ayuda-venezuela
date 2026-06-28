class TagItemViewBuilder {

    constructor(config) {
        // config reservado para futura configuración
    }

    buildItemView(tagStr) {
        const button = document.createElement('button');
        button.className = 'sidebar-tag-btn';
        button.setAttribute('role', 'checkbox');
        button.setAttribute('aria-checked', 'false');
        button.setAttribute('aria-label', tagStr);
        button.dataset.tag = tagStr;

        const labelSpan = document.createElement('span');
        labelSpan.className = 'sidebar-tag-btn__label';
        if (tagStr.length > 30) {
            labelSpan.textContent = tagStr.substring(0, 30) + '\u2026';
            button.setAttribute('title', tagStr);
        } else {
            labelSpan.textContent = tagStr;
        }

        const indicator = document.createElement('span');
        indicator.className = 'sidebar-tag-btn__indicator';
        indicator.setAttribute('aria-hidden', 'true');

        button.appendChild(labelSpan);
        button.appendChild(indicator);
        return button;
    }
}