/***
 * 表单查询组件
 * rowCol: 一行显示多少列
 * formList: 表单项
 *  {
 *    label: String
 *    type: [input, select, date, button]
 *    name: String
 *    placeholder: String
 *    selectOptions: []
 *    disabled: Boolean
 *    rules: []
 *    initialValue: any
 *    onChange: Function
 *    htmlType
 *    align
 *    labelCol
 *    wrapperCol
 *  }
 * onSubmit 默认提交表单事件
 * @returns {undefined}
 */
const defaultFn = () => undefined;
// import Upload from './Upload/index.jsx';
const FormList = {
  // component: {
  //   Upload
  // },
  name: 'Button',
  props: {
    formList: {
      type: Array,
      default: []
    },
    rowCol: {
      type: [Number, String],
      default: 3
    },
    formSetting: {
      type: Object,
      default: () => ({})
    },
    onSubmit: {
      type: Function,
      default: defaultFn
    }
  },
  data() {
    return {
      form: null
    };
  },
  created: function() {
    this.form = this.$form.createForm(this, { name: 'formList' });
  },
  computed: {
    rowSpan() {
      return Math.floor(24 / this.rowCol);
    }
  },
  methods: {
    generateItem(attrs) {
      const {
        type,
        name,
        rules,
        onChange = defaultFn,
        buttonName,
        ...others
      } = attrs;
      switch (type) {
        case 'input':
          return <a-input v-decorator={[name, { rules: rules }]} {...others} placeholder={attrs.placeholder} />;
        case 'select':
          return (
            <a-select
              v-decorator={[name, { rules: rules }]}
              placeholder={attrs.placeholder}
              onChange={onChange}
              {...others}>
              {(others.selectOptions || []).map(option => (
                <a-select-option key={option.id + '1'} value={option.id} data-title={option.name}>
                  {option.name}
                </a-select-option>
              ))}
            </a-select>
          );
        case 'datePicker':
          return <a-date-picker v-decorator={[name, { rules: rules }]} {...others} />;
        case 'rangePicker':
          return <a-range-picker v-decorator={[name, { rules: rules }]} {...others} />;
        // case 'upload':
        //   return <Upload v-decorator={[name, { rules: rules }]} {...others} />;
        default:
          return null;
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
            this.onSubmit(values);
        }
      });
    }
  },
  render() {
    return (
      <a-form
        form={this.form}
        autoComplete='off'
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        {...this.formSetting}
        onSubmit={this.handleSubmit}>
        <a-row>
            <a-col span="20">
            <a-row gutter={24}>
                {this.formList.map((item, index) => {
                    const { align, labelCol, wrapperCol, ...others } = item;
                    return (
                    <a-col span={this.formList.length % 3 === 1 ? 6 : this.rowSpan}>
                        <a-form-item key={index} label={item.label} align={align} labelCol={labelCol} wrapperCol={wrapperCol}>
                        {this.generateItem(others)}
                        </a-form-item>
                    </a-col>
                    );
                })}
            </a-row>
            </a-col>
            <a-col span="2" offset="2">
                <a-button style={{width: '100%'}} type="primary" html-type="submit" onClick={this.handleSubmit}>查询</a-button>
            </a-col>
        </a-row>
      </a-form>
    );
  }
};

export default FormList;
