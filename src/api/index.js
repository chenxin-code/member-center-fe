import * as area from './area';
import * as login from './login';
import * as space from './space';
import * as organization from './organization';
import * as user from './user';
import * as portal from './portal';
import * as notice from './notice';
import * as advertise from './advertise';
import * as micro from './micro';
import * as resident from './resident';
import * as version from './version'
import * as areaPersonnel from './areaPersonnel'
import * as decorationmanage from './decorationmanage';
import * as qualitymanage from './qualitymanage';

export default {
  ...area,
  ...login,
  ...space,
  ...organization,
  ...user,
  ...portal,
  ...notice,
  ...advertise,
  ...micro,
	...version,
  ...areaPersonnel,
  ...resident,
  ...version,
  ...decorationmanage,
  ...qualitymanage
}
