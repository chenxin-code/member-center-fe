export default [
  // 基本设置
  {
    label: "基本设置",
    children: [
      {
        icon: ("kongjianguanli.png"),
        title: "空间管理",
        route: `/space`,
        authKeys: ["app_space"],
      },
      {
        icon: ("gongsiguanli.png"),
        title: "公司管理",
        route: `/company`,
        authKeys: ["app_company"],
      },
      {
        icon: ("yonghuguanli.png"),
        title: "用户管理",
        route: `/user/hcmUser`,
        authKeys: ["app_user"],
      },
      {
        icon: ("quyuguanli.png"),
        title: "区域管理",
        route: `/area`,
        authKeys: ["app_area"],
      },
    ],
  },
  // 物业服务
  {
    label: "物业服务",
    children: [
      {
        icon: ("quyurenyuan.png"),
        title: "区域人员配置",
        route: `/areaPersonnel`,
        authKeys: ["app_area_emp"],
      },
      {
        icon: ("wuyegonggao.png"),
        title: "物业公告",
        route: `/propertyNotice`,
        authKeys: ["app_notice"],
      },
      {
        icon: ("zhuhudangan.png"),
        title: "住户档案",
        route: `/resident`,
        authKeys: ["app_owner_archive"],
      },
      {
        icon: ("pinzhiguanli.png"),
        title: "品质管理",
        route: `/qualityManagement/inspection`,
        authKeys: ["app_quality"],
      },
      {
        icon: ("zhuangxiuguanli.png"),
        title: "装修管理",
        route: `/decorateManagement`,
        authKeys: ["app_decorate"],
      },
      {
        icon: ("renhang.png"),
        title: "人行管理",
        route: '',
        type: "other",
        authKeys: ["app_manpass"],
      },
      {
        icon: ("chehang.png"),
        title: "车行管理",
        route: '',
        type: "other",
        authKeys: ["app_park"],
      },
      {
        icon: ("gongdan.png"),
        title: "工单管理",
        route: '',
        type: "other",
        authKeys: ["app_jobs"],
      },
      {
        icon: ("shebeisheshi.png"),
        title: "设备设施",
        route: '',
        type: "other",
        authKeys: ["app_device"],
      },
      // {
      //   icon: ("yunyingxinxiguanli.png"),
      //   title: "运营信息管理",
      //   route: '/operationsManagement/helpCenter',
      //   authKeys: ["app_notice"],
      // },
    ],
  },
  // 运营管理
  {
    label: "运营管理",
    children: [
      {
        icon: ("guanggaoguanli.png"),
        title: "广告管理",
        route: `/advertise/second/guidePageAppC`,
        authKeys: ["app_advertising"],
      },
      {
        icon: ("weiyingyong.png"),
        title: "微应用管理",
        route: `/micro`,
        authKeys: ["app_micro"],
      },
      {
        icon: ("banbenguanli.png"),
        title: "版本管理",
        route: 'version',
        authKeys: ["app_app"],
      },
    ],
  },
  // {
  //   label: "装修管理",
  //   children: [
  //     {
  //       icon: ("zhuangxiushenqing.png"),
  //       title: "装修申请",
  //       route: `/decorateManagement`,
  //       authKeys: ["app_decorate"],
  //     },
  //   ]
  // },
  // {
  //   label: "品质管理",
  //   children: [
  //     {
  //       icon: ("xunjiandianguanli.png"),
  //       title: "品质管理",
  //       route: `/qualityManagement/inspectionPoint`,
  //       authKeys: ["app_quality"],
  //     },
  //   ]
  // }
];
