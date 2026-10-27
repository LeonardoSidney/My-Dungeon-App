import { toOpenableLink } from '@presentation/screens/adventures/chat/components/textMarkdown/openableLink';

const SCRIPT_SCHEME = 'javascript';

describe('toOpenableLink', () => {
    it('opens an https link and shows its host as the destination', () => {
        expect(toOpenableLink('https://example.com')).toEqual({ url: 'https://example.com', host: 'example.com' });
    });

    it('opens an http link with a path, a query and a fragment', () => {
        const url = 'http://example.com/path?query=1#top';

        expect(toOpenableLink(url)).toEqual({ url, host: 'example.com' });
    });

    it('opens a link whose scheme is written in uppercase', () => {
        expect(toOpenableLink('HTTPS://Example.com')).toEqual({ url: 'HTTPS://Example.com', host: 'Example.com' });
    });

    it('opens a link to an ip address with a port', () => {
        const url = 'http://192.168.0.2:8080/models';

        expect(toOpenableLink(url)).toEqual({ url, host: '192.168.0.2:8080' });
    });

    it('refuses a javascript url', () => {
        expect(toOpenableLink(`${SCRIPT_SCHEME}:alert(1)`)).toBeNull();
    });

    it('refuses an inline html page', () => {
        expect(toOpenableLink('data:text/html,<script>alert(1)</script>')).toBeNull();
    });

    it('refuses a phone number', () => {
        expect(toOpenableLink('tel:+5511999999999')).toBeNull();
    });

    it('refuses a prefilled sms', () => {
        expect(toOpenableLink('sms:+5511999999999?body=hello')).toBeNull();
    });

    it('refuses a deep link into another app', () => {
        expect(toOpenableLink('market://details?id=com.example')).toBeNull();
    });

    it('refuses a local file', () => {
        expect(toOpenableLink('file:///data/data/app/databases')).toBeNull();
    });

    it('refuses a relative path', () => {
        expect(toOpenableLink('/settings')).toBeNull();
    });

    it('refuses a host hidden behind user info', () => {
        expect(toOpenableLink('https://trusted.com@attacker.example')).toBeNull();
    });

    it('refuses a backslash that browsers read as a slash', () => {
        expect(toOpenableLink('https://attacker.example\\@trusted.com')).toBeNull();
    });

    it('refuses a url with spaces', () => {
        expect(toOpenableLink('https://example.com/a b')).toBeNull();
    });

    it('refuses a lookalike unicode host', () => {
        expect(toOpenableLink('https://exаmple.com')).toBeNull();
    });
});
