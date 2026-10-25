export function toggleById<T extends { id: string; }> (list: T[], item: T): T[] {
    const isSelected = list.some(entry => entry.id === item.id);
    if (isSelected) {
        return list.filter(entry => entry.id !== item.id);
    }
    return [...list, item];
}
