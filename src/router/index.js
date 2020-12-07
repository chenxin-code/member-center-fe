import Vue from 'vue';
import Router from 'vue-router';
import paramsStorage from './ParamsStorage.js';
import store from '@/store';

Vue.use(Router);
//登录
const Login = () => import('../pages/login/login');
//获取token
const Token = () => import('../pages/login/index');
//portal
const Portal = () => import('../pages/portal/portal');

//空间管理
//空间
const Space = () => import('../pages/space/space/space');
const SpaceAdd = () => import('../pages/space/space/addSpace');
const SpaceEdit = () => import('../pages/space/space/editSpace');
const MainSpaceEdit = () => import('../pages/space/space/editMainSpace');
//项目
const Project = () => import('../pages/space/project/project');
const ProjectDetail = () => import('../pages/space/project/detail');
const ProjectInfo = () => import('../pages/space/project/projectInfo');
const ProjectInfoMation = () => import('../pages/space/project/projectnformation');
//标签
const Label = () => import('../pages/space/label/label');

const Home = () => import('../components/home');
//区域管理
const Area = () => import('../pages/area/area');
//公司管理
const Company = () => import('../pages/company/company');

// 用户
// C端用户
const ClientUser = () => import('../pages/user/clientUser/clientUser');
const HcmUser = () => import('../pages/user/hcmUser/hcmUser');
const AddHcmUser = () => import('../pages/user/hcmUser/addHcmUser');
const AuthorizeHcmUser = () => import('../pages/user/hcmUser/authorizeHcmUser');
const UserInfo = () => import('../pages/user/userInfo/userInfo');

//物业公告
const PropertyList = () => import('../pages/propertyNotice/propertyNotice/propertyNotice');
const NoticeSet = () => import('../pages/propertyNotice/propertyNotice/noticeSet');
const PropertyDetail = () => import('../pages/propertyNotice/propertyNotice/propertyDetail');
const TypeManage = () => import('../pages/propertyNotice/typeManage/typeManage');

//广告管理
//广告区域
const AdvertiseArea = () => import('../pages/advertise/advertiseArea/advertiseArea');
const AdvertiseAreaSet = () => import('../pages/advertise/advertiseArea/advertiseAreaSet');
//开屏页
const GuidePageAppC = () => import('../pages/advertise/guidePage/guidePageAppC');
const guidePageAppCSet = () => import('../pages/advertise/guidePage/guidePageAppCSet');
const GuidePageAppB = () => import('../pages/advertise/guidePage/guidePageAppB');
//弹窗管理
const PopUp = () => import('../pages/advertise/popUp/popUp');
const PopUpSet = () => import('../pages/advertise/popUp/popUpSet');
//广告推送
const AdvertisePush = () => import('../pages/advertise/advertisePush/advertisePush');
const AdvertisePushSet = () => import('../pages/advertise/advertisePush/advertisePushSet');
const AdvertisePushDetail = () => import('../pages/advertise/advertisePush/advertisePushDetail');
//邻里生活
const NeighborhoodLife = () => import('../pages/advertise/neighborhoodLife/neighborhoodLife');
const NeighborhoodLifeSet = () => import('../pages/advertise/neighborhoodLife/neighborhoodLifeSet');
//邻里推荐
const NeighborhoodRecommend = () => import('../pages/advertise/neighborhoodRecommend/neighborhoodRecommend');
const NeighborhoodRecommendSet = () => import('../pages/advertise/neighborhoodRecommend/neighborhoodRecommendSet');
//邻里星选
const NeighborhoodStarChoose = () => import('../pages/advertise/neighborhoodStarChoose/neighborhoodStarChoose');
const NeighborhoodStarChooseSet = () => import('../pages/advertise/neighborhoodStarChoose/neighborhoodStarChooseSet');
//APP-B增值推广
const AddPromotion = () => import('../pages/advertise/addPromotion/index');
const AddPromotionSet = () => import('../pages/advertise/addPromotion/addPromotionSet');

//微应用管理
const MicroApplication = () => import('../pages/micro/micro/microApplication');
const MicroApplicationAdd = () => import('../pages/micro/micro/addMicroApplication');
const MicroApplicationDetail = () => import('../pages/micro/micro/detail');
const ReleaseVersion = () => import('../pages/micro/micro/releaseVersion');
const ReleaseMicroVersion = () => import('../pages/micro/micro/releaseMicroVersion');
//资源包列表
const ResourcePackage = () => import('../pages/micro/resourcePackage/resourcePackage');
const ResourcePackageAdd = () => import('../pages/micro/resourcePackage/addResourcePackage');

//区域人员配置
const AreaPersonnel = () => import('../pages/areaPersonnel/areaPersonnel');
const AreaPersonnelSet = () => import('../pages/areaPersonnel/areaPersonnelSet');

//活动管理
const Activity = () => import('../pages/activity/activity/index');
const ClassifyManage = () => import('../pages/activity/classifyManage/index');
const SignIn = () => import('../pages/activity/activity/signIn');
const ActivitySetFirst = () => import('../pages/activity/activity/activitySetFirst');
const ActivitySetSecond = () => import('../pages/activity/activity/activitySetSecond');

//访客管理
const Visitor = () => import('../pages/visitor/index');
const VisitorDetail = () => import('../pages/visitor/detail');
const VisitorSet = () => import('../pages/visitor/visitorSet');

//住户档案
const ResidentFile = () => import('../pages/residentFile/residentFile/residentFile');
const ResidentDetail = () => import('../pages/residentFile/residentDetail/residentDetail');
const ResidentLabel = () => import('../pages/residentFile/label/label');

//运营信息管理
const BusinessCooperation = () => import('../pages/operations/businessCooperation/index');
const HelpCenter = () => import('../pages/operations/helpCenter/index');
const HelpCenterEdit = () => import('../pages/operations/helpCenter/createHelp');
const MutualCancellation = () => import('../pages/operations/mutualCancellation/index');
const PrivacyPolicy = () => import('../pages/operations/privacyPolicy/index');
const ProductPresentation = () => import('../pages/operations/productPresentation/index');

//版本管理
const AddVersion = () => import('../pages/version/addVersion');
const Version = () => import('../pages/version/version');

//装修申请
const DecorateApplyList = () => import('../pages/decorateManagement/decorateApply/index');
const DecorateApplyAddManage = () => import('../pages/decorateManagement/decorateApply/addApply');
const DecorateApplyDetailManage = () => import('../pages/decorateManagement/decorateApply/detailApply');
//品质管理
//巡检点管理
const InspectionPointList = () => import('../pages/qualityManagement/inspectionPoint/inspectionPoint');
const InspectionPointManageSet = () => import('../pages/qualityManagement/inspectionPoint/inspectionPointSet');

//标准管理
const StandardList = () => import('../pages/qualityManagement/standard/standard');
const StandardManageSet = () => import('../pages/qualityManagement/standard/standardSet');

//主题管理
const SpecialCheckThemeList = () => import('../pages/qualityManagement/theme/specialCheckTheme/specialCheckTheme');
const SpecialCheckThemeSet = () => import('../pages/qualityManagement/theme/specialCheckTheme/specialCheckThemeSet');

const InspectionThemeList = () => import('../pages/qualityManagement/theme/inspectionTheme/inspectionTheme');
const InspectionThemeSet = () => import('../pages/qualityManagement/theme/inspectionTheme/inspectionThemeSet');

const QualityControlThemeList = () =>
  import('../pages/qualityManagement/theme/qualityControlTheme/qualityControlTheme');
const QualityControlThemeSet = () =>
  import('../pages/qualityManagement/theme/qualityControlTheme/qualityControlThemeSet');

const DecorationInspectionThemeList = () =>
  import('../pages/qualityManagement/theme/decorationInspectionTheme/decorationInspectionTheme');
const DecorationInspectionThemeSet = () =>
  import('../pages/qualityManagement/theme/decorationInspectionTheme/decorationInspectionThemeSet');

//巡检管理
const InspectionList = () => import('../pages/qualityManagement/inspection/index');
const InspectionDetail = () => import('../pages/qualityManagement/inspection/detailInspection');
const recordDetail = () => import('../pages/qualityManagement/inspection/recordDetail');
const abarbeitungDetail = () => import('../pages/qualityManagement/inspection/initiateCorrective');

//质检管理
const QualityInspectionHeadList = () =>
  import('../pages/qualityManagement/qualityinspection/headquarters/headquarters');
const QualityInspectionAddHead = () =>
  import('../pages/qualityManagement/qualityinspection/headquarters/addHeadquarters');
const QualityInspectionDetailHead = () =>
  import('../pages/qualityManagement/qualityinspection/headquarters/detailHeadquarters');
const QualityInspectionResultHead = () =>
  import('../pages/qualityManagement/qualityinspection/headquarters/registrationResults');
const QualityInspectionRectificationHead = () =>
  import('../pages/qualityManagement/qualityinspection/headquarters/initiateCorrective');

const QualityInspectionCityList = () =>
  import('../pages/qualityManagement/qualityinspection/city/cityQualityInspection');
const QualityInspectionDetailCity = () =>
  import('../pages/qualityManagement/qualityinspection/city/detailCityQualityInspection');
const QualityInspectionlResultCity = () =>
  import('../pages/qualityManagement/qualityinspection/city/registrationResults');
const QualityInspectionlRectificationCity = () =>
  import('../pages/qualityManagement/qualityinspection/city/initiateCorrective');

//专项管理
const SpecialCheckList = () => import('../pages/qualityManagement/specialCheck/index');
const SpecialCheckDetail = () => import('../pages/qualityManagement/specialCheck/detailSpecialCheck');
const SpecialCheckDetailResult = () => import('../pages/qualityManagement/specialCheck/registrationResults');
const SpecialCheckDetailResultHead = () => import('../pages/qualityManagement/specialCheck/detailResults');
const SpecialCheckRectification = () => import('../pages/qualityManagement/specialCheck/initiateCorrective');

//装修巡查管理
const DecorateInspectionList = () => import('../pages/qualityManagement/decorate/index');
const DecorateInspectionDetail = () => import('../pages/qualityManagement/decorate/detailDecorateInspection');

//放行条管理
const ReleasePass = () => import('../pages/releasePass/index');
const AddReleasePass = () => import('../pages/releasePass/addReleasePass');
const ReleasePassDetail = () => import('../pages/releasePass/detail');

let router = new Router({
  base: '/',
  routes: [
    {
      path: '/login',
      name: 'login',
      menuKey: 'login',
      meta: { menu: '/login', bread: [{ path: '/login', name: '登录' }] },
      component: Login
    },
    {
      path: '/token',
      name: 'token',
      menuKey: '',
      meta: { menu: '/token', bread: [{ path: '/token', name: '获取token' }] },
      component: Token
    },
    {
      path: '/portal',
      name: 'portal',
      menuKey: 'portal',
      meta: { menu: '/portal', bread: [{ path: '/portal', name: 'portal' }] },
      component: Portal
    },
    {
      path: '/',
      redirect: { name: 'login' },
      name: 'home',
      menuKey: 'home',
      component: Home,
      children: [
        {
          path: '/space',
          name: 'space',
          menuKey: 'space',
          meta: {
            menu: '/space',
            keepAlive: true,
            authKeys: ['menu_space'],
            bread: [{ path: '/space', name: '空间列表' }]
          },
          component: Space
        },
        {
          path: '/space/add',
          name: 'spaceAdd',
          menuKey: 'space',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/space',
            authKeys: ['menu_space'],
            bread: [
              { path: '/space', name: '空间列表' },
              { path: '/space/add', name: '添加空间' }
            ]
          },
          component: SpaceAdd
        },
        {
          path: '/space/edit',
          name: 'spaceEdit',
          menuKey: 'space',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/space',
            authKeys: ['menu_space'],
            bread: [
              { path: '/space', name: '空间列表' },
              { path: '/space/edit', name: '编辑空间' }
            ]
          },
          component: SpaceEdit
        },
        {
          path: '/space/mainEdit',
          name: 'mainSpaceEdit',
          menuKey: 'space',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/space',
            authKeys: ['menu_space'],
            bread: [
              { path: '/space', name: '空间列表' },
              { path: '/space/mainEdit', name: '编辑空间' }
            ]
          },
          component: MainSpaceEdit
        },
        {
          path: '/project/second/projectList',
          name: 'projectList',
          menuKey: 'projectList',
          meta: {
            menu: '/project/second/projectList',
            authKeys: [''],
            bread: [{ path: '/project/second/projectList', name: '项目列表' }],
            keepAlive: true
          },
          component: Project
        },
        {
          path: '/project/second/projectDetail',
          name: 'projectDetail',
          props: paramsStorage.setPropsStorage,
          menuKey: 'projectDetail',
          meta: {
            menu: '/project/second/projectList',
            authKeys: [''],
            bread: [
              { path: '/project/second/projectList', name: '项目列表' },
              {
                path: '/project/second/projectDetail',
                name: '项目详情'
              }
            ]
          },
          component: ProjectDetail
        },
        {
          path: '/project/second/projectInfo',
          name: 'projectInfo',
          menuKey: 'projectInfo',
          meta: {
            menu: '/project/second/projectInfo',
            authKeys: [''],
            bread: [{ path: '/project/second/projectInfo', name: '社区信息列表' }]
          },
          component: ProjectInfo
        },
        {
          path: '/project/projectnformation',
          name: 'projectnformation',
          props: paramsStorage.setPropsStorage,
          menuKey: 'projectInfo',
          meta: {
            menu: '/project/second/projectInfo',
            authKeys: [''],
            bread: [
              { path: '/project/second/projectInfo', name: '社区信息列表' },
              { path: '/project/projectnformation', name: '创建社区信息列表' }
            ]
          },
          component: ProjectInfoMation
        },
        {
          path: '/label',
          name: 'labels',
          menuKey: 'label',
          meta: { menu: '/label', authKeys: ['menu_space_label'], bread: [{ path: '/label', name: '标签列表' }] },
          component: Label
        },
        {
          path: '/area',
          name: 'area',
          menuKey: 'area',
          meta: { menu: '/area', authKeys: ['menu_area'], bread: [{ path: '/area', name: '区域管理' }] },
          component: Area
        },
        {
          path: '/company',
          name: 'company',
          menuKey: 'company',
          meta: { menu: '/company', authKeys: ['menu_company'], bread: [{ path: '/company', name: '公司库' }] },
          component: Company
        },
        {
          path: '/user/clientUser',
          name: 'clientUser',
          menuKey: 'clientUser',
          meta: {
            menu: '/user/clientUser',
            authKeys: ['menu_c_user'],
            bread: [{ path: '/user/clientUser', name: 'C端用户' }]
          },
          component: ClientUser
        },
        {
          path: '/user/hcmUser',
          name: 'hcmUser',
          menuKey: 'hcmUser',
          meta: {
            menu: '/user/hcmUser',
            authKeys: ['menu_b_user'],
            bread: [{ path: '/user/hcmUser', name: 'B端用户' }],
            keepAlive: true
          },
          component: HcmUser
        },
        {
          path: '/user/hcmUser/addHcmUser',
          name: 'addHcmUser',
          menuKey: 'hcmUser',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/user/hcmUser',
            authKeys: ['menu_b_user'],
            bread: [
              { path: '/user/hcmUser', name: 'B端用户' },
              { path: '/user/hcmUser/addHcmUser', name: '添加用户' }
            ]
          },
          component: AddHcmUser
        },
        {
          path: '/user/hcmUser/authorizeHcmUser',
          name: 'authorizeHcmUser',
          menuKey: 'hcmUser',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/user/hcmUser',
            authKeys: ['menu_b_user'],
            bread: [
              { path: '/user/hcmUser', name: 'B端用户' },
              { path: '/user/hcmUser/authorizeHcmUser', name: '授权用户' }
            ]
          },
          component: AuthorizeHcmUser
        },
        {
          path: '/user/userInfo',
          name: 'userInfo',
          menuKey: 'userInfo',
          meta: { menu: '/user/userInfo', authKeys: [''], bread: [{ path: '/user/userInfo', name: '个人中心' }] },
          component: UserInfo
        },
        //物业公告
        {
          path: '/propertyNotice',
          name: 'propertyNotice',
          menuKey: 'propertyNotice',
          meta: {
            menu: '/propertyNotice',
            authKeys: ['app_notice'],
            bread: [{ path: '/propertyNotice', name: '物业公告' }],
            keepAlive: true
          },
          component: PropertyList
        },
        {
          path: '/propertyNotice/noticeSet',
          name: 'noticeSet',
          props: paramsStorage.setPropsStorage,
          // props: setPropsStorage,
          menuKey: 'propertyNotice',
          meta: {
            menu: '/propertyNotice',
            authKeys: ['app_notice'],
            bread: [
              { path: '/propertyNotice', name: '物业公告' },
              { path: '/propertyNotice/noticeSet', name: '公告设置' }
            ]
          },
          component: NoticeSet
        },
        {
          path: '/propertyNotice/propertyDetail',
          name: 'propertyDetail',
          props: paramsStorage.setPropsStorage,
          menuKey: 'propertyNotice',
          meta: {
            menu: '/propertyNotice',
            authKeys: ['app_notice'],
            bread: [
              { path: '/propertyNotice', name: '物业公告' },
              { path: '/propertyNotice/propertyDetail', name: '公告详情' }
            ]
          },
          component: PropertyDetail
        },
        {
          path: '/propertyNotice/typeManage',
          name: 'typeManage',
          menuKey: 'typeManage',
          meta: {
            menu: '/propertyNotice/typeManage',
            authKeys: ['app_notice'],
            bread: [{ path: '/propertyNotice/typeManage', name: '类型管理' }]
          },
          component: TypeManage
        },
        //装修品质
        {
          path: '/decorateManagement',
          name: 'decorateManagement',
          menuKey: 'decorateManagement',
          meta: {
            menu: '/decorateManagement',
            authKeys: ['app_decorate'],
            bread: [{ path: '/decorateManagement', name: '装修申请' }]
          },
          component: DecorateApplyList
        },
        {
          path: '/decorateManagement/add',
          name: 'decorateManagementAdd',
          props: paramsStorage.setPropsStorage,
          menuKey: 'decorateManagement',
          meta: {
            menu: '/decorateManagement/add',
            authKeys: ['menu_decorate_see'],
            bread: [
              { path: '/decorateManagement', name: '装修申请列表' },
              { path: '/decorateManagement/add', name: '新建装修申请' }
            ]
          },
          component: DecorateApplyAddManage
        },
        {
          path: '/decorateManagement/edit',
          name: 'decorateManagementEdit',
          props: paramsStorage.setPropsStorage,
          menuKey: 'decorateManagement',
          meta: {
            menu: '/decorateManagement/edit',
            authKeys: ['menu_decorate_see'],
            bread: [
              { path: '/decorateManagement', name: '装修申请列表' },
              { path: '/decorateManagement/edit', name: '编辑装修申请' }
            ]
          },
          component: DecorateApplyAddManage
        },
        {
          path: '/decorateManagement/detail',
          name: 'decorateManagementDetail',
          menuKey: 'decorateManagement',
          meta: {
            menu: '/decorateManagement/detail',
            authKeys: ['menu_decorate_see'],
            bread: [
              { path: '/decorateManagement', name: '装修申请列表' },
              { path: '/decorateManagement/detail', name: '装修申请详情' }
            ]
          },
          component: DecorateApplyDetailManage
        },
        //品质管理
        {
          path: '/qualityManagement/inspectionPoint',
          name: 'inspectionPoint',
          menuKey: 'inspectionPoint',
          meta: {
            menu: '/qualityManagement/inspectionPoint',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/inspectionPoint', name: '巡检点管理' }]
          },
          component: InspectionPointList
        },
        {
          path: '/qualityManagement/inspectionPoint/add',
          name: 'inspectionPointAdd',
          props: paramsStorage.setPropsStorage,
          menuKey: 'inspectionPoint',
          meta: {
            menu: '/qualityManagement/inspectionPoint',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/inspectionPoint', name: '巡检点管理列表' },
              { path: '/qualityManagement/inspectionPoint/add', name: '添加巡检点管理' }
            ]
          },
          component: InspectionPointManageSet
        },
        {
          path: '/qualityManagement/inspectionPoint/edit',
          name: 'inspectionPointEdit',
          menuKey: 'inspectionPoint',
          meta: {
            menu: '/qualityManagement/inspectionPoint',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/inspectionPoint', name: '巡检点管理列表' },
              { path: '/qualityManagement/inspectionPoint/edit', name: '编辑巡检点管理' }
            ]
          },
          component: InspectionPointManageSet
        },
        {
          path: '/qualityManagement/inspectionPoint/detail',
          name: 'inspectionPointDetail',
          menuKey: 'inspectionPoint',
          meta: {
            menu: '/qualityManagement/inspectionPoint',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/inspectionPoint', name: '巡检点管理列表' },
              { path: '/qualityManagement/inspectionPoint/detail', name: '巡检点管理详情' }
            ]
          },
          component: InspectionPointManageSet
        },
        {
          path: '/qualityManagement/standard',
          name: 'standard',
          menuKey: 'standard',
          meta: {
            menu: '/qualityManagement/standard',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/standard', name: '标准管理' }]
          },
          component: StandardList
        },
        {
          path: '/qualityManagement/standard/add',
          name: 'standardAdd',
          props: paramsStorage.setPropsStorage,
          menuKey: 'standard',
          meta: {
            menu: '/qualityManagement/standard',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/standard', name: '标准管理' },
              { path: '/qualityManagement/standard/add', name: '新建标准' }
            ]
          },
          component: StandardManageSet
        },
        {
          path: '/qualityManagement/standard/edit',
          name: 'standardEdit',
          menuKey: 'standard',
          meta: {
            menu: '/qualityManagement/standard',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/standard', name: '标准管理' },
              { path: '/qualityManagement/standard/edit', name: '编辑标准' }
            ]
          },
          component: StandardManageSet
        },
        {
          path: '/qualityManagement/standard/detail',
          name: 'standardDetail',
          menuKey: 'standard',
          meta: {
            menu: '/qualityManagement/standard',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/standard', name: '标准管理' },
              { path: '/qualityManagement/standard/detail', name: '标准详情' }
            ]
          },
          component: StandardManageSet
        },

        //品质主题
        {
          path: '/qualityManagement/inspectionTheme',
          name: 'inspectionTheme',
          menuKey: 'inspectionTheme',
          meta: {
            menu: '/qualityManagement/inspectionTheme',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/inspectionTheme', name: '巡查主题' }]
          },
          component: InspectionThemeList
        },
        {
          path: '/qualityManagement/inspectionTheme/add',
          name: 'inspectionThemeSet',
          props: paramsStorage.setPropsStorage,
          menuKey: 'inspectionTheme',
          meta: {
            menu: '/qualityManagement/inspectionTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/inspectionTheme', name: '巡查主题' },
              { path: '/qualityManagement/inspectionTheme/add', name: '新建主题包' }
            ]
          },
          component: InspectionThemeSet
        },
        {
          path: '/qualityManagement/inspectionTheme/edit',
          name: 'inspectionThemeSetEdit',
          props: paramsStorage.setPropsStorage,
          menuKey: 'inspectionTheme',
          meta: {
            menu: '/qualityManagement/inspectionTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/inspectionTheme', name: '巡查主题' },
              { path: '/qualityManagement/inspectionTheme/edit', name: '编辑主题包' }
            ]
          },
          component: InspectionThemeSet
        },

        {
          path: '/qualityManagement/qualityControlTheme',
          name: 'qualityControlTheme',
          meta: {
            menu: '/qualityManagement/qualityControlTheme',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/qualityControlTheme', name: '质检主题' }]
          },
          component: QualityControlThemeList
        },
        {
          path: '/qualityManagement/qualityControlTheme/add',
          name: 'qualityControlThemeSet',
          props: paramsStorage.setPropsStorage,
          menuKey: 'qualityControlTheme',
          meta: {
            menu: '/qualityManagement/qualityControlTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlTheme', name: '质检主题' },
              { path: '/qualityManagement/qualityControlTheme/add', name: '新建主题包' }
            ]
          },
          component: QualityControlThemeSet
        },
        {
          path: '/qualityManagement/qualityControlTheme/edit',
          name: 'qualityControlThemeSetEdit',
          props: paramsStorage.setPropsStorage,
          menuKey: 'qualityControlTheme',
          meta: {
            menu: '/qualityManagement/qualityControlTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlTheme', name: '质检主题' },
              { path: '/qualityManagement/qualityControlTheme/edit', name: '编辑主题包' }
            ]
          },
          component: QualityControlThemeSet
        },
        {
          path: '/qualityManagement/qualityControlTheme/detail',
          name: 'qualityControlThemeSet',
          menuKey: 'qualityControlTheme',
          meta: {
            menu: '/qualityManagement/qualityControlTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlTheme', name: '质检主题列表' },
              { path: '/qualityManagement/qualityControlTheme/detail', name: '质检主题详情' }
            ]
          },
          component: QualityControlThemeSet
        },

        {
          path: '/qualityManagement/specialCheckTheme',
          name: 'specialCheckTheme',
          meta: {
            menu: '/qualityManagement/specialCheckTheme',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/specialCheckTheme', name: '专项主题' }]
          },
          component: SpecialCheckThemeList
        },
        {
          path: '/qualityManagement/specialCheckTheme/add',
          name: 'specialCheckThemeSet',
          props: paramsStorage.setPropsStorage,
          menuKey: 'specialCheckTheme',
          meta: {
            menu: '/qualityManagement/specialCheckTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/specialCheckTheme', name: '专项主题' },
              { path: '/qualityManagement/specialCheckTheme/add', name: '新建主题包' }
            ]
          },
          component: SpecialCheckThemeSet
        },
        {
          path: '/qualityManagement/specialCheckTheme/edit',
          name: 'specialCheckThemeSetEdit',
          props: paramsStorage.setPropsStorage,
          menuKey: 'specialCheckTheme',
          meta: {
            menu: '/qualityManagement/specialCheckTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/specialCheckTheme', name: '专项主题' },
              { path: '/qualityManagement/specialCheckTheme/edit', name: '编辑主题包' }
            ]
          },
          component: SpecialCheckThemeSet
        },
        {
          path: '/qualityManagement/specialCheckTheme/detail',
          name: 'specialCheckThemeSet',
          menuKey: 'specialCheckTheme',
          meta: {
            menu: '/qualityManagement/specialCheckTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/specialCheckTheme', name: '专项主题列表' },
              { path: '/qualityManagement/specialCheckTheme/detail', name: '专项主题详情' }
            ]
          },
          component: SpecialCheckThemeSet
        },
        {
          path: '/qualityManagement/decorationInspectionTheme',
          name: 'decorationInspectionTheme',
          meta: {
            menu: '/qualityManagement/decorationInspectionTheme',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/decorationInspectionTheme', name: '装修巡查主题' }]
          },
          component: DecorationInspectionThemeList
        },
        {
          path: '/qualityManagement/decorationInspectionTheme/add',
          name: 'decorationInspectionThemeSet',
          props: paramsStorage.setPropsStorage,
          menuKey: 'decorationInspectionTheme',
          meta: {
            menu: '/qualityManagement/decorationInspectionTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/decorationInspectionTheme', name: '装修巡查主题' },
              { path: '/qualityManagement/decorationInspectionTheme/add', name: '新建主题包' }
            ]
          },
          component: DecorationInspectionThemeSet
        },
        {
          path: '/qualityManagement/decorationInspectionTheme/edit',
          name: 'decorationInspectionThemeSetEdit',
          props: paramsStorage.setPropsStorage,
          menuKey: 'decorationInspectionTheme',
          meta: {
            menu: '/qualityManagement/decorationInspectionTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/decorationInspectionTheme', name: '装修巡查主题' },
              { path: '/qualityManagement/decorationInspectionTheme/edit', name: '编辑主题包' }
            ]
          },
          component: DecorationInspectionThemeSet
        },
        {
          path: '/qualityManagement/decorationInspectionTheme/detail',
          name: 'decorationInspectionThemeSet',
          menuKey: 'decorationInspectionTheme',
          meta: {
            menu: '/qualityManagement/decorationInspectionTheme',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/decorationInspectionTheme', name: '装修巡查主题列表' },
              { path: '/qualityManagement/decorationInspectionTheme/detail', name: '装修巡查主题编辑' }
            ]
          },
          component: DecorationInspectionThemeSet
        },
        //巡检管理
        {
          path: '/qualityManagement/inspection',
          name: 'inspection',
          menuKey: 'inspection',
          meta: {
            menu: '/qualityManagement/inspection',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/inspection', name: '巡查管理' }]
          },
          component: InspectionList
        },
        {
          path: '/qualityManagement/inspection/detail/:id',
          name: 'inspectionDetail',
          menuKey: 'inspection',
          meta: {
            menu: '/qualityManagement/inspection',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/inspection', name: '巡查管理' },
              { path: '/qualityManagement/inspection/detail/:id', name: '任务详情' }
            ]
          },
          component: InspectionDetail
        },
        {
          path: '/qualityManagement/inspection/detail/recordDetail/:id',
          name: 'inspectionDetailRecord',
          menuKey: 'inspection',
          meta: {
            menu: '/qualityManagement/inspection',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/inspection', name: '巡查管理' },
              { path: '/qualityManagement/inspection/detail/:id', name: '任务详情' },
              { path: '/qualityManagement/inspection/detail/recordDetail/:id', name: '记录详情' }
            ]
          },
          component: recordDetail
        },
        {
          path: '/qualityManagement/inspection/detail/recordDetail/abarbeitungDetail/:id/:standardId/:taskId',
          name: 'abarbeitungDetail',
          menuKey: 'inspection',
          meta: {
            menu: '/qualityManagement/inspection',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/inspection', name: '巡查管理' },
              {
                path: '/qualityManagement/inspection/detail/recordDetail/abarbeitungDetail/:id/:standardId/:taskId',
                name: '发起整改'
              }
            ]
          },
          component: abarbeitungDetail
        },

        //质检 //总部抽检
        {
          path: '/qualityManagement/qualityControlHead',
          name: 'qualityControlHead',
          menuKey: 'qualityControlHead',
          meta: {
            menu: '/qualityManagement/qualityControlHead',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/qualityControlHead', name: '总部抽查' }]
          },
          component: QualityInspectionHeadList
        },

        {
          path: '/qualityManagement/qualityControlHead/add',
          name: 'qualityControlHeadAdd',
          menuKey: 'qualityControlHead',
          meta: {
            menu: '/qualityManagement/qualityControlHead',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlHead', name: '总部抽查' },
              { path: '/qualityManagement/qualityControlHead/add', name: '任务详情' }
            ]
          },
          component: QualityInspectionAddHead
        },
        {
          path: '/qualityManagement/qualityControlHead/edit',
          name: 'qualityControlHeadEdit',
          menuKey: 'qualityControlHead',
          meta: {
            menu: '/qualityManagement/qualityControlHead',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlHead', name: '总部抽查' },
              { path: '/qualityManagement/qualityControlHead/edit', name: '任务详情' }
            ]
          },
          component: QualityInspectionAddHead
        },
        {
          path: '/qualityManagement/qualityControlHead/detail',
          name: 'qualityControlHeadDetail',
          menuKey: 'qualityControlHead',
          meta: {
            menu: '/qualityManagement/qualityControlHead',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlHead', name: '总部抽查' },
              { path: '/qualityManagement/qualityControlHead/detail', name: '总部抽查详情' }
            ]
          },
          component: QualityInspectionDetailHead
        },
        {
          path: '/qualityManagement/qualityControlHead/detail/resultDetail',
          name: 'qualityControlHeadResultDetail',
          menuKey: 'qualityControlHead',
          meta: {
            menu: '/qualityManagement/qualityControlHead',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlHead', name: '总部抽查' },
              { path: '/qualityManagement/qualityControlHead/detail', name: '总部抽查详情' },
              { path: '/qualityManagement/qualityControlHead/detail/resultDetail', name: '结果详情' }
            ]
          },
          component: QualityInspectionResultHead
        },
        {
          path: '/qualityManagement/qualityControlHead/detail/result',
          name: 'qualityControlHeadResult',
          menuKey: 'qualityControlHead',
          meta: {
            menu: '/qualityManagement/qualityControlHead',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlHead', name: '总部抽查' },
              { path: '/qualityManagement/qualityControlHead/detail', name: '总部抽查详情' },
              { path: '/qualityManagement/qualityControlHead/detail/result', name: '登记结果' }
            ]
          },
          component: QualityInspectionlResultCity
        },
        {
          path: '/qualityManagement/qualityControlHead/detail/rectification',
          name: 'qualityControlHeadRectification',
          menuKey: 'qualityControlHead',
          meta: {
            menu: '/qualityManagement/qualityControlHead',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlHead', name: '总部抽查' },
              { path: '/qualityManagement/qualityControlHead/detail', name: '总部抽查详情' },
              { path: '/qualityManagement/qualityControlHead/detail/rectification', name: '发起整改' }
            ]
          },
          component: QualityInspectionRectificationHead
        },
        //
        {
          path: '/qualityManagement/qualityControlCity',
          name: 'qualityControlCity',
          menuKey: 'qualityControlCity',
          meta: {
            menu: '/qualityManagement/qualityControlCity',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/qualityControlCity', name: '城市自检管理' }]
          },
          component: QualityInspectionCityList
        },
        {
          path: '/qualityManagement/qualityControlCity/detail',
          name: 'qualityControlCityDetail',
          menuKey: 'qualityControlCity',
          meta: {
            menu: '/qualityManagement/qualityControlCity',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlCity', name: '城市自检管理' },
              { path: '/qualityManagement/qualityControlCity/detail', name: '城市自检详情' }
            ]
          },
          component: QualityInspectionDetailCity
        },
        {
          path: '/qualityManagement/qualityControlCity/detail/viewDetail',
          name: 'qualityControlCityViewDetail',
          menuKey: 'qualityControlCity',
          meta: {
            menu: '/qualityManagement/qualityControlCity',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlCity', name: '城市自检管理' },
              { path: '/qualityManagement/qualityControlCity/detail', name: '任务详情' },
              { path: '/qualityManagement/qualityControlCity/detail/viewDetail', name: '结果详情' }
            ]
          },
          component: QualityInspectionResultHead
        },
        {
          path: '/qualityManagement/qualityControlCity/detail/result',
          name: 'qualityControlCityResult',
          menuKey: 'qualityControlCity',
          meta: {
            menu: '/qualityManagement/qualityControlCity',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlCity', name: '城市自检管理' },
              { path: '/qualityManagement/qualityControlCity/detail', name: '任务详情' },
              { path: '/qualityManagement/qualityControlCity/detail/result', name: '登记结果' }
            ]
          },
          component: QualityInspectionlResultCity
        },
        {
          path: '/qualityManagement/qualityControlCity/detail/rectification',
          name: 'qualityControlCityRectification',
          menuKey: 'qualityControlCity',
          meta: {
            menu: '/qualityManagement/qualityControlCity',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/qualityControlCity', name: '城市自检管理' },
              { path: '/qualityManagement/qualityControlCity/detail', name: '任务详情' },
              { path: '/qualityManagement/qualityControlCity/detail/rectification', name: '发起整改' }
            ]
          },
          component: QualityInspectionlRectificationCity
        },
        //专项检查
        {
          path: '/qualityManagement/specialCheck',
          name: 'specialCheck',
          menuKey: 'specialCheck',
          meta: {
            menu: '/qualityManagement/specialCheck',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/specialCheck', name: '专项管理' }]
          },
          component: SpecialCheckList
        },
        {
          path: '/qualityManagement/specialCheck/detail',
          name: 'specialCheckDetail',
          menuKey: 'specialCheck',
          meta: {
            menu: '/qualityManagement/specialCheck',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/specialCheck', name: '专项管理' },
              { path: '/qualityManagement/specialCheck/detail', name: '专项管理详情' }
            ]
          },
          component: SpecialCheckDetail
        },
        {
          path: '/qualityManagement/specialCheck/detail/result',
          name: 'specialCheckResult',
          menuKey: 'specialCheck',
          meta: {
            menu: '/qualityManagement/specialCheck',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/specialCheck', name: '专项管理' },
              { path: '/qualityManagement/specialCheck/detail', name: '专项管理详情' },
              { path: '/qualityManagement/specialCheck/detail/result', name: '登记结果' }
            ]
          },
          component: SpecialCheckDetailResult
        },
        {
          path: '/qualityManagement/specialCheck/detail/resultDetail',
          name: 'specialCheckResultDetail',
          menuKey: 'specialCheck',
          meta: {
            menu: '/qualityManagement/specialCheck',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/specialCheck', name: '专项管理' },
              { path: '/qualityManagement/specialCheck/detail', name: '专项管理详情' },
              { path: '/qualityManagement/specialCheck/detail/resultDetail', name: '结果详情' }
            ]
          },
          component: SpecialCheckDetailResultHead
        },
        {
          path: '/qualityManagement/specialCheck/detail/rectification',
          name: 'specialCheckRectification',
          menuKey: 'specialCheck',
          meta: {
            menu: '/qualityManagement/specialCheck',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/specialCheck', name: '专项管理' },
              { path: '/qualityManagement/specialCheck/detail', name: '专项管理详情' },
              { path: '/qualityManagement/specialCheck/detail/rectification', name: '任务详情' }
            ]
          },
          component: SpecialCheckRectification
        },
        //装修巡检
        {
          path: '/qualityManagement/decorate',
          name: 'decorate',
          menuKey: 'decorate',
          meta: {
            menu: '/qualityManagement/decorate',
            authKeys: ['app_quality'],
            bread: [{ path: '/qualityManagement/decorate', name: '装修巡查管理' }]
          },
          component: DecorateInspectionList
        },
        {
          path: '/qualityManagement/decorate/detail',
          name: 'decorateDetail',
          menuKey: 'decorate',
          meta: {
            menu: '/qualityManagement/decorate',
            authKeys: ['app_quality'],
            bread: [
              { path: '/qualityManagement/decorate', name: '装修巡查管理' },
              { path: '/qualityManagement/decorate/detail', name: '装修巡查管理详情' }
            ]
          },
          component: DecorateInspectionDetail
        },
        //广告管理
        {
          path: '/advertise/second/guidePageAppC',
          name: 'guidePageAppC',
          menuKey: 'guidePageAppC',
          meta: {
            menu: '/advertise/second/guidePageAppC',
            authKeys: [''],
            bread: [{ path: '/advertise/second/guidePageAppC', name: 'AppC开屏页列表' }],
            keepAlive: true
          },
          component: GuidePageAppC
        },
        {
          path: '/advertise/second/guidePageAppCSet',
          name: 'guidePageAppCSet',
          props: paramsStorage.setPropsStorage,
          menuKey: 'guidePageAppCSet',
          meta: {
            menu: '/advertise/second/guidePageAppC',
            authKeys: [''],
            bread: [
              { path: '/advertise/second/guidePageAppC', name: 'AppC开屏页列表' },
              {
                path: '/advertise/second/guidePageAppCSet',
                name: 'AppC开屏页设置'
              }
            ]
          },
          component: guidePageAppCSet
        },
        {
          path: '/advertise/second/guidePageAppB',
          name: 'guidePageAppB',
          menuKey: 'guidePageAppB',
          meta: {
            menu: '/advertise/second/guidePageAppB',
            authKeys: [''],
            bread: [{ path: '/advertise/second/guidePageAppB', name: 'AppB开屏页设置' }]
          },
          component: GuidePageAppB
        },
        {
          path: '/advertise/advertiseArea',
          name: 'advertiseArea',
          menuKey: 'advertiseArea',
          meta: {
            menu: '/advertise/advertiseArea',
            keepAlive: true,
            authKeys: [''],
            bread: [{ path: '/advertise/advertiseArea', name: '广告区域列表' }]
          },
          component: AdvertiseArea
        },
        {
          path: '/advertise/advertiseAreaSet',
          name: 'advertiseAreaSet',
          menuKey: 'advertiseArea',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/advertise/advertiseArea',
            authKeys: [''],
            bread: [
              { path: '/advertise/advertiseArea', name: '广告区域列表' },
              {
                path: '/advertise/advertiseAreaSet',
                name: '广告区域设置'
              }
            ]
          },
          component: AdvertiseAreaSet
        },
        {
          path: '/advertise/popUp',
          name: 'popUp',
          menuKey: 'popUp',
          meta: {
            menu: '/advertise/popUp',
            authKeys: [''],
            bread: [{ path: '/advertise/popUp', name: '弹窗列表' }],
            keepAlive: true
          },
          component: PopUp
        },
        {
          path: '/advertise/popUpSet',
          name: 'popUpSet',
          menuKey: 'popUpSet',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/advertise/popUp',
            authKeys: [''],
            bread: [
              { path: '/advertise/popUp', name: '弹窗列表' },
              { path: '/advertise/popUpSet', name: '弹窗设置' }
            ]
          },
          component: PopUpSet
        },
        {
          path: '/advertise/advertisePush',
          name: 'advertisePush',
          menuKey: 'advertisePush',
          meta: {
            menu: '/advertise/advertisePush',
            authKeys: [''],
            bread: [{ path: '/advertise/advertisePush', name: '广告推送列表' }],
            keepAlive: true
          },
          component: AdvertisePush
        },
        {
          path: '/advertise/advertisePushSet',
          name: 'advertisePushSet',
          menuKey: 'advertisePushSet',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/advertise/advertisePush',
            authKeys: [''],
            bread: [
              { path: '/advertise/advertisePush', name: '广告推送列表' },
              {
                path: '/advertise/advertisePushSet',
                name: '广告推送设置'
              }
            ]
          },
          component: AdvertisePushSet
        },
        {
          path: '/advertise/advertisePushDetail',
          name: 'advertisePushDetail',
          menuKey: 'advertisePushDetail',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/advertise/advertisePush',
            authKeys: [''],
            bread: [
              { path: '/advertise/advertisePush', name: '广告推送列表' },
              {
                path: '/advertise/advertisePushDetail',
                name: '查看广告推送'
              }
            ]
          },
          component: AdvertisePushDetail
        },
        {
          path: '/advertise/neighborhoodLife',
          name: 'neighborhoodLife',
          menuKey: 'neighborhoodLife',
          meta: {
            menu: '/advertise/neighborhoodLife',
            keepAlive: true,
            authKeys: [''],
            bread: [{ path: '/advertise/neighborhoodLife', name: '邻里生活列表' }]
          },
          component: NeighborhoodLife
        },
        {
          path: '/advertise/neighborhoodLifeSet',
          name: 'neighborhoodLifeSet',
          menuKey: 'neighborhoodLifeSet',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/advertise/neighborhoodLife',
            authKeys: [''],
            bread: [
              { path: '/advertise/neighborhoodLife', name: '邻里生活列表' },
              {
                path: '/advertise/neighborhoodLifeSet',
                name: '邻里生活设置'
              }
            ]
          },
          component: NeighborhoodLifeSet
        },
        {
          path: '/advertise/neighborhoodRecommend',
          name: 'neighborhoodRecommend',
          menuKey: 'neighborhoodRecommend',
          meta: {
            menu: '/advertise/neighborhoodRecommend',
            authKeys: [''],
            bread: [{ path: '/advertise/neighborhoodRecommend', name: '邻里推荐列表' }],
            keepAlive: true
          },
          component: NeighborhoodRecommend
        },
        {
          path: '/advertise/neighborhoodRecommendSet',
          name: 'neighborhoodRecommendSet',
          menuKey: 'neighborhoodRecommendSet',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/advertise/neighborhoodRecommend',
            authKeys: [''],
            bread: [
              {
                path: '/advertise/neighborhoodRecommend',
                name: '邻里推荐列表'
              },
              { path: '/advertise/neighborhoodRecommendSet', name: '邻里推荐设置' }
            ]
          },
          component: NeighborhoodRecommendSet
        },
        {
          path: '/advertise/neighborhoodStarChoose',
          name: 'neighborhoodStarChoose',
          menuKey: 'neighborhoodStarChoose',
          meta: {
            menu: '/advertise/neighborhoodStarChoose',
            authKeys: [''],
            bread: [{ path: '/advertise/neighborhoodStarChoose', name: '邻里星选列表' }],
            keepAlive: true
          },
          component: NeighborhoodStarChoose
        },
        {
          path: '/advertise/neighborhoodStarChooseSet',
          name: 'neighborhoodStarChooseSet',
          menuKey: 'neighborhoodStarChooseSet',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/advertise/neighborhoodStarChoose',
            authKeys: [''],
            bread: [
              { path: '/advertise/neighborhoodStarChoose', name: '邻里星选列表' },
              { path: '/advertise/neighborhoodStarChooseSet', name: '邻里星选设置' }
            ]
          },
          component: NeighborhoodStarChooseSet
        },
        {
          path: '/advertise/addPromotion',
          name: 'addPromotion',
          menuKey: 'addPromotion',
          meta: {
            menu: '/advertise/addPromotion',
            authKeys: [''],
            bread: [{ path: '/advertise/addPromotion', name: 'AppB增值推广列表' }],
            keepAlive: true
          },
          component: AddPromotion
        },
        {
          path: '/advertise/addPromotionSet',
          name: 'addPromotionSet',
          menuKey: 'addPromotionSet',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/advertise/addPromotion',
            authKeys: [''],
            bread: [
              { path: '/advertise/addPromotion', name: 'AppB增值推广列表' },
              { path: '/advertise/addPromotionSet', name: 'AppB增值推广设置' }
            ]
          },
          component: AddPromotionSet
        },
        // 微应用列表
        {
          path: '/micro',
          name: 'micro',
          menuKey: 'micro',
          meta: {
            menu: '/micro',
            authKeys: [''],
            bread: [{ path: '/micro', name: '微应用列表' }]
          },
          component: MicroApplication
        },
        {
          path: '/micro/microApplicationAdd',
          name: 'microApplicationAdd',
          menuKey: 'microApplicationAdd',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/micro',
            authKeys: [''],
            bread: [
              { path: '/micro', name: '微应用列表' },
              { path: '/micro/microApplicationAdd', name: '创建微应用' }
            ]
          },
          component: MicroApplicationAdd
        },
        {
          path: '/micro/microApplicationDetail',
          name: 'microApplicationDetail',
          menuKey: 'microApplicationDetail',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/micro',
            authKeys: [''],
            bread: [
              { path: '/micro', name: '微应用列表' },
              { path: '/micro/microApplication/microApplicationDetail', name: '微应用详情' }
            ]
          },
          component: MicroApplicationDetail
        },
        {
          path: '/micro/releaseVersion',
          name: 'releaseVersion',
          menuKey: 'releaseVersion',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/micro',
            authKeys: [''],
            bread: [
              { path: '/micro', name: '微应用列表' },
              { path: '/micro/releaseVersion', name: '微应用版本发布' }
            ]
          },
          component: ReleaseVersion
        },
        // 资源包管理
        {
          path: '/resourcePackage',
          name: 'resourcePackage',
          menuKey: 'resourcePackage',
          meta: { menu: '/resourcePackage', authKeys: [''], bread: [{ path: '/resourcePackage', name: '资源包管理' }] },
          component: ResourcePackage
        },
        {
          path: '/resourcePackage/resourcePackageAdd',
          name: 'resourcePackageAdd',
          props: paramsStorage.setPropsStorage,
          menuKey: 'resourcePackageAdd',
          meta: {
            menu: '/resourcePackage',
            authKeys: [''],
            bread: [
              { path: '/resourcePackage', name: '资源包管理' },
              { path: '/resourcePackage/resourcePackageAdd', name: '创建资源包' }
            ]
          },
          component: ResourcePackageAdd
        },
        {
          path: '/micro/releaseMicroVersion',
          name: 'releaseMicroVersion',
          menuKey: 'releaseMicroVersion',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/micro',
            authKeys: [''],
            bread: [
              { path: '/micro', name: '微应用列表' },
              { path: '/micro/releaseMicroVersion', name: '微应用版本发布' }
            ]
          },
          component: ReleaseMicroVersion
        },
        // 资源包管理
        {
          path: '/areaPersonnel',
          name: 'areaPersonnel',
          menuKey: 'areaPersonnel',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/areaPersonnel',
            authKeys: [''],
            bread: [{ path: '/areaPersonnel', name: '区域人员配置列表' }],
            keepAlive: true
          },
          component: AreaPersonnel
        },
        {
          path: '/areaPersonnel/areaPersonnelSet',
          name: 'areaPersonnelSet',
          menuKey: 'areaPersonnelSet',
          props: paramsStorage.setPropsStorage,
          meta: {
            menu: '/areaPersonnel',
            authKeys: [''],
            bread: [
              { path: '/areaPersonnel', name: '区域人员配置列表' },
              { path: '/resourcePackage/areaPersonnelSet', name: '区域人员配置' }
            ]
          },
          component: AreaPersonnelSet
        },
        //活动管理
        {
          path: '/activity',
          name: 'activity',
          menuKey: 'activity',
          meta: { menu: '/activity', authKeys: [''], bread: [{ path: '/activity', name: '活动列表' }] },
          component: Activity
        },
        {
          path: '/activity/signIn',
          name: 'signIn',
          menuKey: 'signIn',
          meta: { menu: '/activity', authKeys: [''], bread: [{ path: '/activity/signIn', name: '报名签到表' }] },
          component: SignIn
        },
        {
          path: '/activity/activitySetFirst',
          name: 'activitySetFirst',
          menuKey: 'activitySetFirst',
          meta: {
            menu: '/activity',
            authKeys: [''],
            bread: [
              { path: '/activity', name: '活动列表' },
              { path: '/activity/activitySetFirst', name: '基本信息' }
            ]
          },
          component: ActivitySetFirst
        },
        {
          path: '/activity/activitySetSecond',
          name: 'activitySetSecond',
          menuKey: 'activitySetSecond',
          meta: {
            menu: '/activity',
            authKeys: [''],
            bread: [
              { path: '/activity/activitySetSecond', name: '活动列表' },
              { path: '/activity/activitySetSecond', name: '报名表设置' }
            ]
          },
          component: ActivitySetSecond
        },
        {
          path: '/classifyManage',
          name: 'classifyManage',
          menuKey: 'classifyManage',
          meta: { menu: '/classifyManage', authKeys: [''], bread: [{ path: '/classifyManage', name: '分类管理' }] },
          component: ClassifyManage
        },
        //访客管理
        {
          path: '/visitor',
          name: 'visitor',
          menuKey: 'visitor',
          meta: { menu: '/visitor', authKeys: [''], bread: [{ path: '/visitor', name: '访客列表' }] },
          component: Visitor
        },
        {
          path: '/visitor/visitorDetail',
          name: 'visitorDetail',
          menuKey: 'visitorDetail',
          meta: {
            menu: '/visitor',
            authKeys: [''],
            bread: [
              { path: '/visitor', name: '访客列表' },
              { path: '/visitor/visitorDetail', name: '访客详情' }
            ]
          },
          component: VisitorDetail
        },
        {
          path: '/visitor/visitorSet',
          name: 'visitorSet',
          menuKey: 'visitorSet',
          meta: {
            menu: '/visitor',
            authKeys: [''],
            bread: [
              { path: '/visitor', name: '访客列表' },
              { path: '/visitor/visitorSet', name: '访客功能设置' }
            ]
          },
          component: VisitorSet
        },
        {
          path: '/resident',
          name: 'resident',
          menuKey: 'resident',
          meta: {
            menu: '/resident',
            authKeys: [''],
            bread: [
              { path: '/resident', name: '住户档案' }
              // { path: '/resident/detail', name: '项目详情' }
            ],
            keepAlive: true
          },
          component: ResidentFile
        },
        {
          path: '/resident/detail',
          name: 'detail',
          props: paramsStorage.setPropsStorage,
          menuKey: 'resident',
          meta: {
            menu: '/resident',
            authKeys: [''],
            bread: [
              { path: '/resident', name: '住户档案' },
              { path: '/resident/detail', name: '住户详情' }
            ]
          },
          component: ResidentDetail
        },
        {
          path: '/residentLabel',
          name: 'residentLabel',
          menuKey: 'detail',
          meta: {
            menu: '/residentLabel',
            authKeys: [''],
            bread: [{ path: '/residentLabel', name: '标签管理' }]
          },
          component: ResidentLabel
        },
        //运营管理
        // {
        //   path: '/operationsManagement',
        //   name: 'operationsManagement',
        //   menuKey: 'operationsManagement',
        //   meta: {
        //     menu: '/operationsManagement', authKeys: [''],
        //     bread: [{ path: '/operationsManagement', name: '运营信息管理' }],
        //   },
        //   component: BusinessCooperation
        // },
        {
          path: '/operationsManagement/helpCenter',
          name: 'helpCenter',
          menuKey: 'helpCenter',
          meta: {
            menu: '/operationsManagement/helpCenter',
            authKeys: [''],
            bread: [{ path: '/helpCenter', name: '帮助中心管理' }]
          },
          component: HelpCenter
        },
        {
          path: '/operationsManagement/helpCenter/helpCenterEdit',
          name: 'helpCenterEdit',
          //props: paramsStorage.setPropsStorage,
          menuKey: 'helpCenterEdit',
          meta: {
            menu: '/operationsManagement/helpCenter',
            authKeys: [''],
            bread: [
              { path: '/operationsManagement/helpCenter', name: '帮助中心管理' },
              {
                path: '/operationsManagement/helpCenterEdit',
                name: '帮助设置'
              }
            ]
          },
          component: HelpCenterEdit
        },
        {
          path: '/operationsManagement/productPresentation',
          name: 'productPresentation',
          menuKey: 'productPresentation',
          meta: {
            menu: '/operationsManagement/productPresentation',
            authKeys: [''],
            bread: [{ path: '/businessCooperation', name: '产品简介配置' }]
          },
          component: ProductPresentation
        },
        {
          path: '/operationsManagement/businessCooperation',
          name: 'businessCooperation',
          menuKey: 'businessCooperation',
          meta: {
            menu: '/operationsManagement/businessCooperation',
            authKeys: [''],
            bread: [{ path: '/businessCooperation', name: '商务合作配置' }]
          },
          component: BusinessCooperation
        },
        {
          path: '/operationsManagement/privacyPolicy',
          name: 'privacyPolicy',
          menuKey: 'privacyPolicy',
          meta: {
            menu: '/operationsManagement/privacyPolicy',
            authKeys: [''],
            bread: [{ path: '/privacyPolicy', name: '隐私政策配置' }]
          },
          component: PrivacyPolicy
        },
        {
          path: '/operationsManagement/mutualCancellation',
          name: 'mutualCancellation',
          menuKey: 'mutualCancellation',
          meta: {
            menu: '/operationsManagement/mutualCancellation',
            authKeys: [''],
            bread: [{ path: '/mutualCancellation', name: '注销协议配置' }]
          },
          component: MutualCancellation
        },
        // 版本管理
        {
          path: '/version',
          name: 'version',
          menuKey: 'version',
          meta: {
            menu: '/version',
            authKeys: [''],
            bread: [{ path: '/version', name: 'App版本列表' }]
          },
          component: Version
        },
        {
          path: '/version/addVersion',
          name: 'addVersion',
          menuKey: 'addVersion',
          meta: {
            menu: '/version',
            authKeys: [''],
            bread: [
              { path: '/version', name: 'App版本列表' },
              { path: '/version/addVersion', name: 'App版本发布' }
            ]
          },
          component: AddVersion
        },
        {
          path: '/releasePass',
          name: 'releasePass',
          menuKey: 'releasePass',
          meta: {
            menu: '/releasePass',
            authKeys: [''],
            bread: [{ path: '/releasePass', name: '放行条审核' }]
          },
          component: ReleasePass
        },
        {
          path: '/releasePass/addReleasePass',
          name: 'addReleasePass',
          menuKey: 'addReleasePass',
          meta: {
            menu: '/releasePass',
            authKeys: [''],
            bread: [
              { path: '/releasePass', name: '放行条审核' },
              { path: '/releasePass/addReleasePass', name: '新建放行条' }
            ]
          },
          component: AddReleasePass
        },
        {
          path: '/releasePass/releasePassDetail',
          name: 'releasePassDetail',
          menuKey: 'releasePassDetail',
          meta: {
            menu: '/releasePass',
            authKeys: [''],
            bread: [
              { path: '/releasePass', name: '放行条审核' },
              { path: '/releasePass/releasePassDetail', name: '放行条详情' }
            ]
          },
          component: ReleasePassDetail
        }
      ]
    },

    {
      path: '/404',
      component: () => import('../pages/exception/404')
    },
    {
      path: '/403',
      component: () => import('../pages/exception/403')
    },
    {
      path: '/500',
      component: () => import('../pages/exception/500')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ],
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  paramsStorage.clearPropsStorage(to, from);

  if (to.matched.length === 0) {
    from.name
      ? next({
          name: from.name
        })
      : next('/404');
  } else {
    if (sessionStorage.getItem('refreshflag') == '1' && sessionStorage.getItem('store')) {
      store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('store'))));
      sessionStorage.setItem('refreshflag', '0');
    }
    if (Object.keys(to.params).length === 0) {
      // 从store中取出付给params，此处注意路径未必完全吻合，以你的为准
      Object.assign(to.params, store.state.paramMap[to.name] || {});
    }
    // 存储一下params备用
    store.commit('REFRESHPARAM', { key: to.name, value: to.params });
    next();
  }
});

router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    window.location.reload();
    // router.replace(router.history.pending.fullPath);
  } else {
    console.log(error);
  }
});

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
