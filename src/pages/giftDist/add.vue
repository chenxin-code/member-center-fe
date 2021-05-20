<template>
  <div class="detail">
    <div class="detail-header">
      <p class="detail-header-title">新建派发</p>
      <p class="detail-header-btn" @click="goBack()">返回</p>
    </div>
    <div class="detail-main">
      <div class="form-body">
        <a-form-model ref="ruleForm" :rules="rules" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-form-model-item label="选择礼包">
            <div :class="`create-main-couponSelect ${showRedBorder && 'border-red'}`" @click="visible = true">
              {{ selectGiftName }}
            </div>
            <p v-show="showRedBorder" class="create-main-couponSelectTip">请选择礼包</p>
          </a-form-model-item>
          <a-radio-group v-model="form.issuedRang" class="scopeTypeData">
            <a-radio style="display: block; height: 130px;" :value="1">
              <div class="scopeTypeRadio">
                <span style="padding-right: 40px; line-height: 40px;">选择来源</span>
                <div v-if="form.issuedRang === 1">
                  <a-form-model-item label="会员来源" prop="memberSource">
                    <a-checkbox-group
                      v-model="form.memberSource"
                      :options="memberSourceArray"
                      @change="(value) => {form.memberSource = value}"
                      class="scopeGroup"
                    />
                  </a-form-model-item>
                  <a-form-model-item label="会员等级" prop="startLevelId">
                    <div class="scopeGroup">
                      <a-select
                        style="width: 150px;"
                        v-model="form.startLevelId"
                        @change="startLevelIdSelect"
                      >
                        <a-select-option :value="v.value" v-for="(v, k) in levelIdArray" :key="k">
                          {{ v.label }}
                        </a-select-option>
                      </a-select>
                      <span style="padding: 0 20px; color: #ccc;">------</span>
                      <a-select
                        style="width: 150px;"
                        v-model="form.endLevelId"
                        @change="endLevelIdSelect"
                      >
                        <a-select-option :value="v.value" v-for="(v, k) in levelIdArray" :key="k">
                          {{ v.label }}
                        </a-select-option>
                      </a-select>
                    </div>
                  </a-form-model-item>
                </div>
              </div>
            </a-radio>
            <a-radio style="display: block; height: 130px;" :value="2">
              <span style="padding-right: 40px;">指定会员</span>
              <a-form-model-item style="display: inline-block; width: 100%;" v-if="form.issuedRang === 2">
                <a-upload
                  v-decorator="[
                    'form.file',
                    {
                      initialValue: form.file,
                      rules: [
                        {
                          validator: (rule, value, callback) =>
                            validatorFn1(rule, value, callback, '请选择文件上传!')
                        }
                      ]
                    }
                  ]"
                  :file-list="fileList1"
                  :remove="handleRemove1"
                  name="file"
                  accept=".xls,.xlsx"
                  :before-upload="uploadBefor"
                >
                  <a-button>
                    <a-icon type="upload"/>
                    上传文件
                  </a-button>
                </a-upload>
              </a-form-model-item>
              <div style="padding: 40px 0 0 148px;" v-if="form.issuedRang === 2">
                <p style="font-size: 12px; color: #c1c1c1;">
                  支持扩展名：.xlsx，支持批量上传会员手机号或会员UUID，重复会员计算一次
                </p>
                <p>
                  <a-button type="link" :loading="loadingUrl" @click="getTplDownload()">下载会员信息模板</a-button>
                </p>
              </div>
            </a-radio>
          </a-radio-group>
          <a-form-model-item :wrapper-col="{ span: 12, offset: 4 }">
            <a-button type="primary" html-type="submit" style="margin-right: 10px" @click="goBack()">取消</a-button>
            <a-button type="primary" html-type="submit" @click="handleSubmit()" :loading="submitLoading">提交
            </a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <a-modal title="礼包选择" :visible="visible" @ok="handleOk" @cancel="visible = false" width="1300px">
      <FilterForm ref="form" rowCol="3" :formList="formList" :onSubmit="onSearch"/>
      <a-table
        :style="{ marginTop: '20px' }"
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: 300 }"
        :rowKey="(r, i) => i"
        :row-selection="rowSelection">
        <template slot="validitySlot" slot-scope="scope">
          <div class="editable-row-operations">
            <span v-html="parseValidityStr(scope)"></span>
          </div>
        </template>
      </a-table>
      <a-pagination
        :total="total"
        :show-total="total => `共 ${total} 条`"
        show-quick-jumper
        show-size-changer
        v-model="current"
        :current="current"
        :pageSize="pageSize"
        :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
        @change="change"
        @showSizeChange="showSizeChange"
        style="margin-top: 30px;width: 100%;text-align: right;"
      />
    </a-modal>
  </div>
</template>

<script>
const validatorFn1 = (rule, value, callback, message) => {
  if (!value) {
    callback(message);
  } else {
    if (value.fileList.length === 0) {
      callback(message);
    } else {
      callback();
    }
  }
};
import api from './../../api';
import moment from 'moment';
import FilterForm from './../../components/FilterGroup/index.jsx';

export default {
  components: {FilterForm},
  data() {
    return {
      formList: [
        {
          label: '礼包名称',
          type: 'input',
          name: 'name',
          placeholder: '请输入',
          labelCol: {span: 6},
          wrapperCol: {span: 18}
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: {span: 0},
          wrapperCol: {span: 24}
        },
        {},
        {},
        {},
        {
          type: 'btn-default',
          buttonName: '创建礼包',
          htmlType: 'button',
          align: 'right',
          labelCol: {span: 0},
          wrapperCol: {span: 24}
        }
      ],
      tableColumns: [
        {
          title: '礼包名称',
          dataIndex: 'name',
          key: 'name',
          width: 180
        },
        {
          title: '有效期',
          key: 'validitySlot',
          scopedSlots: {customRender: 'validitySlot'},
          width: 250
        }
      ],
      selectedRows: [],
      selectGiftId: null,//选中礼包id
      selectGiftName: null,//选中礼包名称
      searchGiftName: null,//搜索礼包名称
      pageSize: 10,
      current: 1,
      total: 0,
      tableLoading: false,
      tableData: [],
      visible: false,
      showRedBorder: false,
      submitLoading: false,
      loadingUrl: false,
      form: {
        giftBagId: null,
        giftBagName: null,
        issuedRang: 1,
        memberSource: ['sys_dichan'],
        startLevelId: 1,
        endLevelId: 1,
        file: null
      },
      rules: {
        giftBagName: [{required: true, message: '请选择礼包', trigger: 'change'}],
        memberSource: [{required: true, message: '请选择会员来源', trigger: 'change'}]
      },
      memberSourceArray: [{label: '地产Pro', value: 'sys_dichan'}, {label: '邻里邦Pro', value: 'sys_linlibang'}],
      levelIdArray: [
        {label: '邻里会员V1', value: 1},
        {label: '邻里会员V2', value: 2},
        {label: '邻里会员V3', value: 3},
        {label: '邻里会员V4', value: 4},
        {label: '邻里会员V5', value: 5}
      ],
      fileList1: []
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.getList();
      }
    },
    'form.otherAwardType'(val) {
      if (val === '0') {
        this.form.otherAwardId = '';
        this.form.otherAwardName = '';
      }
    },
    fileList1: {
      handler(newVal) {
      },
      immediate: true,
      deep: true
    },
    'form.startLevelId': {
      handler() {
        if (this.form.startLevelId > this.form.endLevelId) {
          this.$set(this.form, 'endLevelId', this.form.startLevelId);
        }
      },
      immediate: true,
      deep: true
    },
    'form.endLevelId': {
      handler() {
        if (this.form.endLevelId < this.form.startLevelId) {
          this.$set(this.form, 'startLevelId', this.form.endLevelId);
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {

  },
  computed: {
    parseValidityStr() {
      return param => {
        return `${this.momentStrHms(param.startTime)} ～ ${this.momentStrHms(param.endTime)}`;
      };
    },
    momentStr() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD');
        }
      };
    },
    momentStrHms() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD HH:mm:ss');
        }
      };
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRows = selectedRows;
        },
        type: 'radio'
      };
    }
  },
  methods: {
    onSearch(args) {
      const {name} = args;
      this.searchGiftName = name || null;
      this.current = 1;
      this.getList();
    },
    change(page) {
      this.current = page;
      this.getList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      this.$nextTick(() => {
        return api.selectGiftBagList({
          name: this.searchGiftName,
          status: '1',//只要启用的
          nowTime: this.momentStr(new Date()),
          pageIndex: this.current,
          pageSize: this.pageSize,
        }).then(resp => {
          if (resp.code === 200) {
            this.total = resp.data.total;
            this.tableData.splice(0, this.tableData.length);
            resp.data.records.forEach((v, k) => {
              this.tableData.push(v);
            });
          }
        }).finally(() => {
          this.tableLoading = false;
        });
      });
    },
    handleOk() {
      if (this.selectedRows.length > 0) {
        this.visible = false;
        this.selectGiftId = this.selectedRows[0].id;
        this.selectGiftName = this.selectedRows[0].name;
        this.showRedBorder = false;
      } else {
        this.$message.error('必须选择一个礼包!');
      }
    },
    validatorFn1,
    uploadBefor(file) {
      this.form.file = file;
      this.$set(this.fileList1, 0, file);
      return false;
    },
    handleRemove1(file) {
      const index = this.fileList1.indexOf(file);
      const newFileList = this.fileList1.slice();
      newFileList.splice(index, 1);
      this.fileList1 = newFileList;
      this.form.file = null;
    },
    handleSubmit() {
      if (!this.selectGiftId) {
        this.showRedBorder = true;
      }
      this.form.giftBagId = this.selectGiftId;
      this.form.giftBagName = this.selectGiftName;
      const data = JSON.parse(JSON.stringify(this.form));
      Object.assign(data, {
        memberSource: data.memberSource.join(','),
        file: this.form.file,
        saveStatus: 1
      });
      const paramFormData = Object.keys(data).reduce((pre, key) => {
        pre.append([key], data[key]);
        return pre;
      }, new FormData());
      this.$refs.ruleForm.validate(valid => {
        if (valid && !this.showRedBorder) {
          this.submitLoading = true;
          api.directGiftBagHoliday(paramFormData).then(resp => {
            if (resp.code === 200) {
              this.$refs.ruleForm.resetFields();
              this.$message.success(resp.message);
              this.goBack();
            }
          }).finally(() => {
            this.submitLoading = false;
          });
        }
      });
    },
    goBack() {
      this.$router.replace({path: '/giftDist'});
    },
    getTplDownload() {
      this.loadingUrl = true;
      api.getTplDownload().then(resp => {
        if (resp.code === 200) {
          window.open(resp.data);
        }
      }).finally(() => {
        this.loadingUrl = false;
      });
    },
    startLevelIdSelect(value) {
      this.form.startLevelId = value;
    },
    endLevelIdSelect(value) {
      this.form.endLevelId = value;
    }
  }
};
</script>

<style lang="less" scoped>
.form-body {
  padding: 20px 0;
}

.tc-textTarea {
  height: 200px;
  width: 100%;
  resize: none;
}

.detail {
  height: 100%;

  &-header {
    display: flex;
    justify-content: space-between;
    line-height: 56px;
    border-bottom: 2px solid #dadada;

    &-title,
    &-btn {
      margin: 0;
      padding: 0 40px;
    }

    &-btn {
      color: #4c79fa;
      cursor: pointer;
    }
  }

  &-main {
    height: calc(100% - 58px);
    overflow: auto;
    padding: 20px;

    &-title {
      font-size: 16px;
      color: #7f7f7f;
      padding-left: 35px;
      line-height: 50px;
      margin: 0;
    }

    &-items {
      color: #666;
      margin-bottom: 20px;

      &-label {
        display: inline-block;
        width: 120px;
        text-align: right;
        color: #333;
      }
    }

    .create-main-couponSelect {
      width: 100%;
      line-height: 32px;
      height: 32px;
      border: 1px solid #bfbfbf;
      color: #bfbfbf;
      padding-left: 10px;
      border-radius: 3px;
      cursor: pointer;
    }

    .create-main-couponSelectTip {
      color: #f5222d;
      margin: 0;
      line-height: 1.5;
      padding-top: 3px;
    }

    .border-red {
      border-color: #f5222d;
    }
  }
}

.createflex {
  display: flex;
  align-items: center;
}

.scopeTypeData {
  padding-left: calc(16.66666667% - 90px);
}

.scopeTypeRadio {
  display: inline-flex;
}

.scopeGroup {
  margin-left: 15px;
}
</style>
