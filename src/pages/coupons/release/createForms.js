const validator = (rule, value, callback, message) => {
    if (parseInt(value, 10) < 1 || parseInt(value, 10) > 999999999) {
        callback(message)
    } else {
        callback()
    }
}
export const couponsCenterList = [
    {
        label: '发放数量',
        placehold: '请输入发放数量',
        name: 'issuedCount',
        rules: [
            {required: true, message: '请输入发放数量'},
            {pattern: /^[1-9]\d*$/, message: '请输入发放数量'},
        ]
    },
    {
        label: '每人领取数量限制',
        placehold: '1-999999999',
        name: 'perPersonLimit',
        rules: [
            { required: true, message: '请输入每人领取数量限制!' },
            {pattern: /^[1-9]\d*$/, message: '请输入每人领取数量限制!'},
            {
                validator: (rule, value, callback) => validator(rule, value, callback, '每人领取数量限制, 1-999999999')
            }
        ]
    },
    {
        label: '每日领取数量限制',
        placehold: '1-999999999',
        name: 'perDayLimit',
        rules: [
            { required: true, message: '请输入每日领取数量限制!' },
            {pattern: /^[1-9]\d*$/, message: '请输入每日领取数量限制!'},
            {
                validator: (rule, value, callback) => validator(rule, value, callback, '每日领取数量限制, 1-999999999')
            }
        ]
    },
    {
        label: '每人每日领取数量限制',
        placehold: '1-999999999',
        name: 'perPersonDayLimit',
        rules: [
            { required: true, message: '请输入每人每日领取数量限制!' },
            {pattern: /^[1-9]\d*$/, message: '请输入每人每日领取数量限制!'},
            {
                validator: (rule, value, callback) => validator(rule, value, callback, '每人每日领取数量限制, 1-999999999')
            }
        ]
    },
]
export const bangdouList = [
    {
        label: '发放数量',
        placehold: '请输入发放数量',
        name: 'issuedCount',
        rules: [
            { required: true, message: '请输入发放数量!' },
            {pattern: /^[1-9]\d*$/, message: '请输入发放数量!'},
        ]
    },
    {
        label: '邦豆兑换值',
        placehold: '请输入邦豆兑换值',
        name: 'integrealCount',
        rules: [
            { required: true, message: '请输入邦豆兑换值!' },
            {pattern: /^[1-9]\d*$/, message: '请输入邦豆兑换值!'},
        ]
    },
    {
        label: '每人兑换数量限制',
        placehold: '1-999999999',
        name: 'perPersonLimit',
        rules: [
            { required: true, message: '请输入每人兑换数量限制!' },
            {pattern: /^[1-9]\d*$/, message: '请输入每人兑换数量限制!'},
            {
                validator: (rule, value, callback) => validator(rule, value, callback, '每人兑换数量限制, 1-999999999!')
            }
        ]
    },
    {
        label: '每日兑换数量限制',
        placehold: '1-999999999',
        name: 'perDayLimit',
        rules: [
            { required: true, message: '请输入每日兑换数量限制!' },
            {pattern: /^[1-9]\d*$/, message: '请输入每日兑换数量限制!'},
            {
                validator: (rule, value, callback) => validator(rule, value, callback, '每人每日领取数量限制, 1-999999999')
            }
        ]
    },
    {
        label: '每人每日兑换数量限制',
        placehold: '1-999999999',
        name: 'perPersonDayLimit',
        rules: [
            { required: true, message: '请输入每人每日兑换数量限制!' },
            {pattern: /^[1-9]\d*$/, message: '请输入每人每日兑换数量限制!'},
            {validator: (rule, value, callback) => validator(rule, value, callback, '每人每日兑换数量限制, 1-999999999')}
        ]
    },
]
export const cardList = [
    {
        label: '发放数量',
        placehold: '请输入发放数量',
        name: 'issuedCount',
        rules: [
            { required: true, message: '请输入发放数量!' },
            {pattern: /^[1-9]\d*$/, message: '请输入发放数量'},
        ]
    }
]

export const level = [
    { label: 'v1', value: 1 },
    { label: 'v2', value: 2 },
    { label: 'v3', value: 3 },
    { label: 'v4', value: 4 },
    { label: 'v5', value: 5 },
]

export const typeList = [
    {id: '', name: '全部'},
    {id: 10, name: '代金券'},
    {id: 20, name: '满减券'},
    {id: 40, name: '抵扣券'}
]

export const activityList = [
    {id: '', name: '全部'},
    {id: 4014, name: '物业费'},
    {id: 4005, name: '消费券'}
]