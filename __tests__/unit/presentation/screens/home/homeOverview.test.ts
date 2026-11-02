import {
    buildSetupSteps,
    CatalogEntityEnum,
    formatCount,
    formatDaysAgo,
    SetupStepEnum,
    summarizeServers,
    type CatalogCounts,
} from '@presentation/screens/home/homeOverview';

function buildCounts (overrides: Partial<CatalogCounts> = {}): CatalogCounts {
    const zeros = Object.fromEntries(Object.values(CatalogEntityEnum).map(entity => [entity, 0])) as CatalogCounts;
    return { ...zeros, ...overrides };
}

describe('buildSetupSteps', () => {
    it('marks every step done once the catalog has what a table needs', () => {
        const counts = buildCounts({
            [CatalogEntityEnum.CONNECTIONS]: 1,
            [CatalogEntityEnum.ASSISTANTS]: 1,
            [CatalogEntityEnum.CHARACTERS]: 2,
            [CatalogEntityEnum.SYSTEM_PROMPTS]: 1,
            [CatalogEntityEnum.ADVENTURES]: 1,
        });

        expect(buildSetupSteps(counts).every(step => step.isDone)).toBe(true);
    });

    it('accepts a world master as the narrator step', () => {
        const steps = buildSetupSteps(buildCounts({ [CatalogEntityEnum.WORLD_MASTERS]: 1 }));

        expect(steps.find(step => step.id === SetupStepEnum.NARRATOR)?.isDone).toBe(true);
        expect(steps.find(step => step.id === SetupStepEnum.CHARACTER)?.isDone).toBe(false);
    });

    it('points every pending step to the screen that solves it', () => {
        const steps = buildSetupSteps(buildCounts());

        expect(steps.map(step => step.route)).toEqual(['settings', 'assistants', 'worldMasters', 'characters', 'systemPrompts', 'adventures']);
        expect(steps.some(step => step.isDone)).toBe(false);
    });
});

describe('summarizeServers', () => {
    it('counts the models answered by each connection', () => {
        const connections = [{ id: 'c-1', name: 'Home PC', ip: '192.168.0.2' }, { id: 'c-2', name: 'Cloud', ip: 'api.example.com' }];
        const models = [
            { id: 'qwen', name: 'qwen', connectionId: 'c-1', connectionName: 'Home PC' },
            { id: 'llama', name: 'llama', connectionId: 'c-1', connectionName: 'Home PC' },
        ];

        expect(summarizeServers(connections, models)).toEqual([
            { id: 'c-1', name: 'Home PC', modelCount: 2 },
            { id: 'c-2', name: 'Cloud', modelCount: 0 },
        ]);
    });
});

describe('formatCount', () => {
    it('formats 0 as "0"', () => {
        expect(formatCount(0)).toBe('0');
    });

    it('formats 999 as "999"', () => {
        expect(formatCount(999)).toBe('999');
    });

    it('formats 1000 as "1.0k"', () => {
        expect(formatCount(1000)).toBe('1.0k');
    });

    it('formats 98450 as "98.5k"', () => {
        expect(formatCount(98450)).toBe('98.5k');
    });
});

describe('formatDaysAgo', () => {
    const now = new Date('2026-10-26T12:00:00.000Z');

    it('describes "2026-10-26T08:00:00.000Z" as "today"', () => {
        expect(formatDaysAgo('2026-10-26T08:00:00.000Z', now)).toBe('today');
    });

    it('describes "2026-10-25T08:00:00.000Z" as "yesterday"', () => {
        expect(formatDaysAgo('2026-10-25T08:00:00.000Z', now)).toBe('yesterday');
    });

    it('describes "2026-10-20T08:00:00.000Z" as "6 days ago"', () => {
        expect(formatDaysAgo('2026-10-20T08:00:00.000Z', now)).toBe('6 days ago');
    });
});
