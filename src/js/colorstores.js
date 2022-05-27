import { writable, derived } from 'svelte/store';
import { isDarkMode } from "./stores";

export const graysPrototypes = writable([
    '#000000',
    '#080808',
    '#101010',
    '#181818',
    '#202020',
    '#282828',
    '#303030',
    '#383838',
    '#404040',
    '#484848',
    '#505050',
    '#585858',
    '#606060',
    '#686868',
    '#707070',
    '#787878',
    '#808080',
    '#888888',
    '#909090',
    '#989898',
    '#a0a0a0',
    '#a8a8a8',
    '#b0b0b0',
    '#b8b8b8',
    '#c0c0c0',
    '#c8c8c8',
    '#d0d0d0',
    '#d8d8d8',
    '#e0e0e0',
    '#e8e8e8',
    '#f0f0f0',
    '#f8f8f8',
    '#ffffff',
]);

const grayPrototypes = writable([
    { l: '#000000', d: '#ffffff' },
    { l: '#080808', d: '#f8f8f8' },
    { l: '#101010', d: '#f0f0f0' },
    { l: '#181818', d: '#e8e8e8' },
    { l: '#202020', d: '#e0e0e0' },
    { l: '#282828', d: '#d8d8d8' },
    { l: '#303030', d: '#d0d0d0' },
    { l: '#383838', d: '#c8c8c8' },
    { l: '#404040', d: '#c0c0c0' },
    { l: '#484848', d: '#b8b8b8' },
    { l: '#505050', d: '#b0b0b0' },
    { l: '#585858', d: '#a8a8a8' },
    { l: '#606060', d: '#a0a0a0' },
    { l: '#686868', d: '#989898' },
    { l: '#707070', d: '#909090' },
    { l: '#787878', d: '#888888' },

    { l: '#808080', d: '#808080' },

    { l: '#888888', d: '#787878' },
    { l: '#909090', d: '#707070' },
    { l: '#989898', d: '#686868' },
    { l: '#a0a0a0', d: '#606060' },
    { l: '#a8a8a8', d: '#585858' },
    { l: '#b0b0b0', d: '#505050' },
    { l: '#b8b8b8', d: '#484848' },
    { l: '#c0c0c0', d: '#404040' },
    { l: '#c8c8c8', d: '#383838' },
    { l: '#d0d0d0', d: '#303030' },
    { l: '#d8d8d8', d: '#282828' },
    { l: '#e0e0e0', d: '#202020' },
    { l: '#e8e8e8', d: '#181818' },
    { l: '#f0f0f0', d: '#101010' },
    { l: '#f8f8f8', d: '#080808' },
    { l: '#ffffff', d: '#000000' },
]);

export const grays = derived([isDarkMode, grayPrototypes], ([$isDarkMode, $grayPrototypes]) => {
    if ($isDarkMode) { return $grayPrototypes.map(e => e.d); }
    else { return $grayPrototypes.map(e => e.l) };
});

const redPrototypes = writable([
    { l: '#ff3030', d: '#651212' }, /* fatal */
    { l: '#f44336', d: '#f44336' }, /*  */
    // { l: '#', d: '#'},
]);