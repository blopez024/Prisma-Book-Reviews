
import { emojis } from '../data/emoji.js';

function safeGenreData(genre) {
    if (!genre) return { color: '#ccc', emoji: '📚', name: 'Unknown' };
    const data = emojis[genre.name];
    return data
        ? { color: data.color, emoji: data.emoji, name: genre.name }
        : { color: '#ccc', emoji: '📚', name: genre.name };
}


export { safeGenreData }