import { useCallback, useState } from 'react';
import { getDropdownArrow } from './getDropdownArrow';
import { toggleShowList } from './toggleShowList';
import { closeShowList } from './closeShowList';

export function useCharacterSelectorToggle () {
    const [showList, setShowList] = useState(false);

    const toggleList = useCallback(() => {
        const nextShowList = toggleShowList(showList);
        setShowList(nextShowList);
    }, [showList]);

    const closeList = useCallback(() => {
        const nextShowList = closeShowList();
        setShowList(nextShowList);
    }, []);

    const dropdownArrow = getDropdownArrow(showList);

    return {
        showList,
        setShowList,
        toggleList,
        closeList,
        dropdownArrow
    };
}
