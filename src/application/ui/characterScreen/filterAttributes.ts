import { Attribute } from '@domain/entities';

export function filterAttributes (attributes: Attribute[]): Attribute[] {
    return attributes.filter((attr) => attr.name.trim() !== '');
}
