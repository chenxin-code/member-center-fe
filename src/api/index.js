import * as login from './login';
import * as portal from './portal';
import * as space from './space';
import * as task from './task';
import * as card from './card';
import * as access from './access';
import * as micro from './micro';
import * as member from './member';

export default {
    ...login,
    ...portal,
    ...space,
    ...micro,
    ...member,
    ...task,
    ...card,
    ...access,
}