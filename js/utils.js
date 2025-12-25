export function el(tag, props = {}, ...children) {
    const svgTags = ['svg', 'polyline', 'line', 'circle', 'path', 'rect', 'text', 'g', 'defs', 'linearGradient', 'stop'];
    const tagName = tag.toLowerCase().trim();
    const isSvg = svgTags.includes(tagName);
    const element = isSvg
        ? document.createElementNS('http://www.w3.org/2000/svg', tag)
        : document.createElement(tag);
    if (!props) props = {};
    Object.entries(props).forEach(([key, value]) => {
        if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else {
            // Convert camelCase to kebab-case for SVG attributes
            const name = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            element.setAttribute(name, value);
        }
    });
    children.forEach(child => {
        if (child === null || child === undefined) return;
        if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        } else if (Array.isArray(child)) {
            child.forEach(c => element.appendChild(c));
        }
    });
    return element;
}
export function elSvg(tag, props = {}, ...children) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    if (!props) props = {};
    Object.entries(props).forEach(([key, value]) => {
        if (key === 'className') {
            element.setAttribute('class', value);
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else {
            const name = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            element.setAttribute(name, value);
        }
    });
    children.forEach(child => {
        if (child === null || child === undefined) return;
        if (typeof child === 'string' || typeof child === 'number') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    return element;
}
