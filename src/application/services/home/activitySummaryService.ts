import { Adventure, Character, Chat, RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ACTIVITY_DAYS,
    ActivityHighlights,
    ActivitySummary,
    ActivitySummaryServiceParams,
    AdventureActivity,
    AdventureHighlight,
    CharacterHighlight,
    DailyActivity,
    IActivitySummaryService,
    ModelHighlight,
    StorySummary,
    WORD_SEPARATOR,
} from '@domain/services';

export class ActivitySummaryService implements IActivitySummaryService {
    constructor (private readonly logger: ILogger) { }

    summarize (params: ActivitySummaryServiceParams): ActivitySummary {
        this.logger.info('Executing ActivitySummaryService::summarize');
        const { adventures, characters, now } = params;
        const chats = adventures.flatMap(adventure => adventure.chat);

        return {
            adventures: this.summarizeAdventures(adventures),
            story: this.summarizeStory(chats),
            dailyActivity: this.countDailyActivity(chats, now),
            streak: this.countStreak(chats, now),
            highlights: this.findHighlights(adventures, characters, chats),
        };
    }

    private summarizeAdventures (adventures: Adventure[]): AdventureActivity[] {
        return adventures
            .map(adventure => this.toAdventureActivity(adventure))
            .sort((first, second) => second.lastActivityAt.getTime() - first.lastActivityAt.getTime());
    }

    private toAdventureActivity (adventure: Adventure): AdventureActivity {
        const lastChat = adventure.chat[adventure.chat.length - 1];
        const lastActivityAt = adventure.chat.reduce((latest, chat) => {
            if (chat.updatedAt > latest) {
                return chat.updatedAt;
            }
            return latest;
        }, adventure.createdAt);

        return {
            id: adventure.id,
            name: adventure.name,
            createdAt: adventure.createdAt,
            lastActivityAt,
            messageCount: adventure.chat.length,
            lastMessage: lastChat && this.selectedContent(lastChat),
        };
    }

    private summarizeStory (chats: Chat[]): StorySummary {
        const replies = chats.filter(chat => chat.role === RoleEnum.ASSISTANT);

        return {
            linesWritten: chats.filter(chat => chat.role === RoleEnum.USER).length,
            repliesGenerated: replies.length,
            wordsGenerated: replies.reduce((total, reply) => total + this.countWords(this.selectedContent(reply)), 0),
            rerolls: chats.reduce((total, chat) => total + Math.max(chat.content.length - 1, 0), 0),
        };
    }

    private countDailyActivity (chats: Chat[], now: Date): DailyActivity[] {
        const today = this.startOfDay(now);
        const days = Array.from({ length: ACTIVITY_DAYS }, (_, index) => this.addDays(today, index - ACTIVITY_DAYS + 1));

        return days.map(day => ({
            date: day,
            messageCount: chats.filter(chat => this.isSameDay(chat.createdAt, day)).length,
        }));
    }

    private countStreak (chats: Chat[], now: Date): number {
        const activeDays = new Set(chats.map(chat => this.startOfDay(chat.createdAt).getTime()));
        const today = this.startOfDay(now);
        const hasPlayedToday = activeDays.has(today.getTime());
        let day = hasPlayedToday ? today : this.addDays(today, -1);
        let streak = 0;

        while (activeDays.has(day.getTime())) {
            streak += 1;
            day = this.addDays(day, -1);
        }

        return streak;
    }

    private findHighlights (adventures: Adventure[], characters: Character[], chats: Chat[]): ActivityHighlights {
        return {
            mostPlayed: this.findMostPlayed(adventures),
            hero: this.findHero(characters, chats),
            topModel: this.findTopModel(chats),
        };
    }

    private findMostPlayed (adventures: Adventure[]): AdventureHighlight | undefined {
        return adventures
            .filter(adventure => adventure.chat.length > 0)
            .map(adventure => ({ adventureId: adventure.id, name: adventure.name, messageCount: adventure.chat.length }))
            .sort((first, second) => second.messageCount - first.messageCount)[0];
    }

    private findHero (characters: Character[], chats: Chat[]): CharacterHighlight | undefined {
        const lineCounts = this.countBy(chats.filter(chat => chat.role === RoleEnum.USER).map(chat => chat.characterId));

        return [...lineCounts.entries()]
            .flatMap(([characterId, lineCount]) => {
                const character = characters.find(item => item.id === characterId);
                if (!character) {
                    return [];
                }
                return [{ characterId, name: character.name, lineCount }];
            })
            .sort((first, second) => second.lineCount - first.lineCount)[0];
    }

    private findTopModel (chats: Chat[]): ModelHighlight | undefined {
        const modelIds = chats
            .filter(chat => chat.role === RoleEnum.ASSISTANT)
            .map(chat => chat.modelId)
            .filter((modelId): modelId is string => modelId !== undefined);
        const replyCounts = this.countBy(modelIds);

        return [...replyCounts.entries()]
            .map(([modelId, replyCount]) => ({ modelId, replyCount }))
            .sort((first, second) => second.replyCount - first.replyCount)[0];
    }

    private countBy (keys: string[]): Map<string, number> {
        const counts = new Map<string, number>();
        keys.forEach(key => counts.set(key, (counts.get(key) ?? 0) + 1));
        return counts;
    }

    private selectedContent (chat: Chat): string {
        return chat.content[chat.index] ?? '';
    }

    private countWords (text: string): number {
        return text.split(WORD_SEPARATOR).filter(Boolean).length;
    }

    private startOfDay (date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    private addDays (date: Date, days: number): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
    }

    private isSameDay (date: Date, day: Date): boolean {
        return this.startOfDay(date).getTime() === day.getTime();
    }
}
