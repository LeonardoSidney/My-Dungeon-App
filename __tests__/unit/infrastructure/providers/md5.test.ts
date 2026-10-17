import { MD5Provider } from '@infra/providers';

describe('MD5Provider', () => {
    const provider = new MD5Provider();

    it('hashes the empty string', () => {
        expect(provider.md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    });

    it('hashes "abc"', () => {
        expect(provider.md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72');
    });

    it('hashes a longer ASCII string', () => {
        expect(provider.md5('The quick brown fox jumps over the lazy dog')).toBe(
            '9e107d9d372bb6826bd81d3542a419d6'
        );
    });

    it('hashes unicode input as utf-8', () => {
        expect(provider.md5('café')).toBe('07117fe4a1ebd544965dc19573183da2');
    });

    it('hashes a 64 byte input exactly at the padding boundary', () => {
        expect(provider.md5('a'.repeat(64))).toBe('014842d480b571495a4a0363793f7367');
    });

    it('hashes a 63 byte input just below the padding boundary', () => {
        expect(provider.md5('a'.repeat(63))).toBe('b06521f39153d618550606be297466d5');
    });

    it('hashes a 100 byte input spanning two blocks', () => {
        expect(provider.md5('a'.repeat(100))).toBe('36a92cc94a9e0fa21f625f8bfb007adf');
    });

    it('hashes a 512 byte input spanning multiple blocks', () => {
        expect(provider.md5('a'.repeat(512))).toBe('56907396339ca2b099bd12245f936ddc');
    });

    it('hashes "bolinhadepelo"', () => {
        expect(provider.md5('bolinhadepelo')).toBe('9338400e2d7c1f4300d62106ffa50f1c');
    });

    it('hashes "abluble"', () => {
        expect(provider.md5('abluble')).toBe('02bf2dc04b201a202ed201c3a3fa868e');
    });

    it('hashes "quevontadedetomarjimo"', () => {
        expect(provider.md5('quevontadedetomarjimo')).toBe('176a9826ca282ed97de9a1487d589ea2');
    });

    it('hashes "ovocomervridro"', () => {
        expect(provider.md5('ovocomervridro')).toBe('96c6002a1f818a9a53598870a4800f20');
    });

    it('hashes "aoctofeiradotio"', () => {
        expect(provider.md5('aoctofeiradotio')).toBe('e69ee959977f55dd35fc6d4fd9285d0a');
    });
});
