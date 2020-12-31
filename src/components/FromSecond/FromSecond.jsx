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

const FormList = {
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
    },
    labelAlign:{
      type: String,
      default: 'right'
    },
    labelCol: {
      type: Object,
      default: () => ({ span:6 })
    },
    wrapperCol: {
      type: Object,
      default: () => ({ span: 18 })
    }
  },
  data() {
    return {
      form: null,
      myList:[]
    }
  },
  watch:{
    formList: {
      handler(newVal, oldVal) {
        // console.log(newVal)
        this.myList = newVal
      },
      deep: true,
      immediate: true //立即执行
    }
  },
  created: function () {
    this.form = this.$form.createForm(this, { name: 'formList' });
    this.setFieldsValue = this.form.setFieldsValue;
    this.getFieldsValue = this.form.getFieldsValue;
  },
  computed: {
    rowSpan() {
      return Math.floor(24 / this.rowCol);
    }
  },
  methods: {
    generateItem(attrs) {
      const { type, name, rules, disabled = false , showSearch, onChange = defaultFn, initialValue, buttonName, buttonType = "primary", htmlType = "submit", ...others } = attrs;
      switch (type) {
        case 'input':
          return (
            <a-input v-decorator={ [name, { rules: rules, initialValue }] } { ...others }  placeholder={ attrs.placeholder }/>
          );
        case 'select':
          return (
            <a-select
              disabled = {disabled}
              show-search = {showSearch ? showSearch : false} // 是否支持搜索
              option-filter-prop="name" // 搜索字段名
              filter-option= { this.filterOption } 
              v-decorator={ [name, { rules: rules, initialValue }] }
              placeholder={ attrs.placeholder }
              onChange={ onChange }
              { ...others }
            >
              {
                (others.selectOptions || []).map((option) =>
                  (<a-select-option key={ option.id } value={ option.id } data-title={ option.name }>
                    { option.name }
                  </a-select-option>))
              }
            </a-select>
          );
        case 'datePicker':
          return (<a-date-picker v-decorator={ [name, { rules: rules,initialValue }] }  { ...others } />);
        case 'rangePicker':
          return (<a-range-picker v-decorator={ [name, { rules: rules,initialValue }] }  { ...others } />);
        case "button":
          return (<a-button type={ buttonType } html-type={ htmlType } { ...others }>{ buttonName }</a-button>);
        default:
          return null;
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.onSubmit();
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      );
    },
  },
  render() {
    return (
      <a-form
        form={ this.form }
        labelCol={ this.labelCol }
        wrapperCol={ this.wrapperCol }
        { ...this.formSetting }
        onSubmit={ this.handleSubmit }
        labelAlign= { this.labelAlign }
      >
        <a-row gutter={ 24 } type="flex" justify="space-between">
          {
            this.myList.map((item, index) => {
              const { align, labelCol, wrapperCol, ...others } = item;
              return (
                <a-col span={ this.myList.length % 3 === 1 ? 6 : this.rowSpan }>
                  <a-form-item
                    key={ index }
                    label={ item.label }
                    align={ align }
                    labelCol={ labelCol }
                    wrapperCol={ wrapperCol }
                  >
                    { this.generateItem(others) }
                  </a-form-item>
                </a-col>
              )
            })
          }
        </a-row>
      </a-form>
    );
  }
};

export default FormList;