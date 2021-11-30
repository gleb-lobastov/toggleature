// @ts-nocheck
const STORAGE_KEY = 'pes-ui:show-ff';
const QUERY_KEY = 'showFF';

export default function checkShouldShowFeaturesWidget(searchParams) {
    try {
        const directive = stringToBool(searchParams.get(QUERY_KEY));
        if (directive !== undefined) {
            window.localStorage.setItem(STORAGE_KEY, String(directive));
            return directive;
        }
        return stringToBool(window.localStorage.getItem(STORAGE_KEY));
    } catch (error) {
        return false;
    }
}

function stringToBool(value) {
    switch (value) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return undefined;
    }
}
