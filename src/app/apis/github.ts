import { IGitHubEvent,
         IEmoji,
         AllEmojis } from 'app/interfaces';
import doFetch from './fetch';
import * as _ from 'lodash';
let _emojis: IEmoji[] = [];
/**
 * Return JSON containing github events
 */
function getEvents(): Promise<IGitHubEvent[]> {
    return doFetch('https://api.github.com/events');
}
/**
 * Return a list of github emojis 
 */
function getEmojis(): Promise<IEmoji[]> {
    // some original names are problematic
    const problematic = {
        '100': '_100',
        '1234': '_1234',
        '+1': 'plus1',
        '-1': 'minus1',
        '8ball': '_8ball',
        'e-mail': 'e_mail',
        'non-potable_water': 'non_potable_water'
    };
    if (!_.isEmpty(_emojis)) return Promise.resolve(_emojis); // primitive caching
    return doFetch('https://api.github.com/emojis').then((allEmojis: AllEmojis) => {
        let emojis: IEmoji[] = [];
        // adapt some of the emoji names
        _.forOwn(allEmojis, (url, name) => {
            let cleanName = undefined;
            if (_.has(problematic, name)) {
                console.log(`Replaced ${name} with ${problematic[name]}`);
                name = problematic[name];
            }
            emojis.push({ name, url });
        });
        _emojis = _.slice(emojis); // keep a copy of the emoji list
        return emojis;
    });
}

const githubApi = {
    getEvents,
    getEmojis
};

export {
    githubApi
}
