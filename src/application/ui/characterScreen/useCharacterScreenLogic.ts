import { useEffect, useState } from 'react';
import { Character, Assistant, Ability, Proficiency, Status } from '@domain/entities';
import { CharacterFormData } from './constants';
import {
    createCharacterController,
    editCharacterController,
    eraseCharacterController,
    getCharactersController,
    getAssistantsController,
    getAbilitiesController,
    getProficienciesController,
    getStatusesController
} from '@infra/container';

export function useCharacterScreenLogic () {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [assistants, setAssistants] = useState<Assistant[]>([]);
    const [abilities, setAbilities] = useState<Ability[]>([]);
    const [proficiencies, setProficiencies] = useState<Proficiency[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);

    const loadCharacters = async () => {
        setLoading(true);
        try {
            const ctrl = getCharactersController();
            const result = await ctrl.handle();
            setCharacters(result);
        } catch (error) {
            console.error('Failed to load characters:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAssistants = async () => {
        try {
            const ctrl = getAssistantsController();
            const result = await ctrl.handle();
            setAssistants(result);
        } catch (error) {
            console.error('Failed to load assistants:', error);
        }
    };

    const loadAbilities = async () => {
        try {
            const ctrl = getAbilitiesController();
            const result = await ctrl.handle();
            setAbilities(result);
        } catch (error) {
            console.error('Failed to load abilities:', error);
        }
    };

    const loadProficiencies = async () => {
        try {
            const ctrl = getProficienciesController();
            const result = await ctrl.handle();
            setProficiencies(result);
        } catch (error) {
            console.error('Failed to load proficiencies:', error);
        }
    };

    const loadStatuses = async () => {
        try {
            const ctrl = getStatusesController();
            const result = await ctrl.handle();
            setStatuses(result);
        } catch (error) {
            console.error('Failed to load statuses:', error);
        }
    };

    useEffect(() => {
        loadCharacters();
        loadAssistants();
        loadAbilities();
        loadProficiencies();
        loadStatuses();
    }, []);

    const handleDelete = async (characterId: string) => {
        try {
            const ctrl = eraseCharacterController();
            await ctrl.handle(characterId);
            await loadCharacters();
        } catch (error) {
            console.error('Failed to delete character:', error);
        }
    };

    const handleEdit = (character: Character) => {
        const currentAssistant = assistants.find((a) => a.id === character.assistant.id) || null;
        setEditingCharacter(character);
        setSelectedAssistant(currentAssistant);
        setShowForm(true);
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingCharacter(null);
        setSelectedAssistant(null);
    };

    const handleAdd = () => {
        setEditingCharacter(null);
        setSelectedAssistant(null);
        setShowForm(true);
    };

    const handleFormSave = async (characterData: CharacterFormData) => {
        if (editingCharacter) {
            const normalizeAssistant = (assistant: Assistant | null): Assistant | null => {
                if (!assistant) return null;
                const normalized = assistants.find((a) => a.id === assistant.id);
                return normalized ?? null;
            };

            const normalizeItems = <T extends { id: string; }> (items: T[], currentList: T[]): T[] => {
                return items
                    .filter((item) => currentList.some((listItem) => listItem.id === item.id))
                    .map((item) => {
                        const normalized = currentList.find((listItem) => listItem.id === item.id);
                        return normalized || item;
                    });
            };

            const normalizedAssistant = normalizeAssistant(characterData.assistant);

            if (!normalizedAssistant) return;

            const updatedCharacter: Character = {
                ...editingCharacter,
                name: characterData.name,
                activationWord: characterData.activationWord,
                prompt: characterData.prompt,
                observation: characterData.observation,
                assistant: normalizedAssistant,
                abilities: normalizeItems(characterData.abilities, abilities),
                proficiencies: normalizeItems(characterData.proficiencies, proficiencies),
                statuses: normalizeItems(characterData.statuses, statuses),
                attributes: characterData.attributes,
            };
            await editCharacterController().handle({ character: updatedCharacter });
        }

        if (!editingCharacter) {
            await createCharacterController().handle({
                name: characterData.name,
                activationWord: characterData.activationWord,
                prompt: characterData.prompt,
                observation: characterData.observation,
                assistant: characterData.assistant,
                abilities: characterData.abilities,
                proficiencies: characterData.proficiencies,
                statuses: characterData.statuses,
                attributes: characterData.attributes,
            });
        }

        await loadCharacters();
        handleFormClose();
    };

    return {
        characters,
        assistants,
        abilities,
        proficiencies,
        statuses,
        selectedAssistant,
        setSelectedAssistant,
        loading,
        showForm,
        editingCharacter,
        handleAdd,
        handleEdit,
        handleDelete,
        handleFormClose,
        handleFormSave,
    };
}
