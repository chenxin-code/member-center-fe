import * as login from './login';
import * as portal from './portal';
import * as space from './space';
import * as user from './user';
import * as task from './task';
import * as card from './card';
import * as access from './access';

export default {
    ...login,
    ...portal,
    ...space,
    ...user,
    ...task,
    ...card,
    ...access,
}