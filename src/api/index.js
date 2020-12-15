import * as login from './login';
import * as portal from './portal';
import * as space from './space';
import * as user from './user';
import * as task from './task';

export default {
    ...login,
    ...portal,
    ...space,
    ...user,
    ...task
}