export default function slugify(str: string) {
    return String(str)
        .normalize('NFKD') // split accented characters into their base characters and diacritical marks
        .replace(/[\u0300-\u036f]/g, '') // remove combining diacritical marks
        .trim() // trim leading or trailing whitespace
        .toLowerCase() // convert to lowercase
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // remove non-alphanumeric characters
        .replace(/-+/g, '-') // remove consecutive hyphens
        .replace(/^-+|-+$/g, ''); // remove leading and trailing hyphens
}
