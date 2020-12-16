import * as login from './login';
import * as portal from './portal';
import * as space from './space';
import * as micro from './micro';
import * as member from './member';

export default {
  ...login,
  ...portal,
  ...space,
  ...micro,
  ...member
}
