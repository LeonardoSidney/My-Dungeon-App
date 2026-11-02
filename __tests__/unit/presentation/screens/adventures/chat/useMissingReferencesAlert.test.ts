import { renderHook } from '@testing-library/react-native';
import { useMissingReferencesAlert } from '@presentation/screens/adventures/chat/hooks/useMissingReferencesAlert';

const issue = 'Characters > Aria: an entry from Abilities is no longer available';

describe('useMissingReferencesAlert', () => {
    it('stays quiet when nothing is missing', async () => {
        const alert = { handle: jest.fn() };

        await renderHook(() => useMissingReferencesAlert([], alert));

        expect(alert.handle).not.toHaveBeenCalled();
    });

    it('lists the issues when the adventure opens', async () => {
        const alert = { handle: jest.fn() };

        await renderHook(() => useMissingReferencesAlert([issue], alert));

        expect(alert.handle).toHaveBeenCalledTimes(1);
        expect(alert.handle.mock.calls[0][0].message).toContain(issue);
    });

    it('does not repeat the alert when the same issues reload on focus', async () => {
        const alert = { handle: jest.fn() };

        const { rerender } = await renderHook(({ issues }: { issues: string[]; }) => useMissingReferencesAlert(issues, alert), { initialProps: { issues: [issue] } });
        await rerender({ issues: [issue] });

        expect(alert.handle).toHaveBeenCalledTimes(1);
    });

    it('alerts again when the issues change', async () => {
        const alert = { handle: jest.fn() };
        const otherIssue = 'Assistants > Main: an entry from Connections is no longer available';

        const { rerender } = await renderHook(({ issues }: { issues: string[]; }) => useMissingReferencesAlert(issues, alert), { initialProps: { issues: [issue] } });
        await rerender({ issues: [issue, otherIssue] });

        expect(alert.handle).toHaveBeenCalledTimes(2);
    });
});
