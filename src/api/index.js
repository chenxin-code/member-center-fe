import * as member from './member';
import * as task from './task';
import * as card from './card';
import * as access from './access';
import * as dealing from './dealing';
import * as release from './release';

export default {
    ...member,
    ...task,
    ...card,
    ...access,
    ...dealing,
    ...release,
}