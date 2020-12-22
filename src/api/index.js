import * as member from './member';
import * as task from './task';
import * as card from './card';
import * as access from './access';

export default {
    ...member,
    ...task,
    ...card,
    ...access,
}
