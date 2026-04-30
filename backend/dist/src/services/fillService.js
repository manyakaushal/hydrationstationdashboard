"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillTemplate = fillTemplate;
function fillTemplate(template, values) {
    let result = template;
    for (const key in values) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(values[key]));
    }
    return result;
}
//# sourceMappingURL=fillService.js.map