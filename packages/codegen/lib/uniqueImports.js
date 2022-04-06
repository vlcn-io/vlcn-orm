export default function uniqueImports(imports) {
    const seen = new Set();
    const ret = imports.filter(i => {
        const key = toKey(i);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
    return ret;
}
function toKey(i) {
    return i.name + '-' + i.as + '-' + i.from;
}
//# sourceMappingURL=uniqueImports.js.map