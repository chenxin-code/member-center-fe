<template>
  <div id="labels">
    <div class="content-header">会员列表</div>
    <div class="content-main" ref="content_main">
      <a-row style="padding:20px;height:100%;">
        <a-col flex:auto>
          <FormList ref="form" rowCol="3" :formList="formList" :onSubmit="onCheck" />
          <!-- 表格 -->
          <a-table
            :columns="columns"
            :row-key="(r, i) => i"
            :data-source="data"
            :scroll="{ y: scrollY }"
            :pagination="false"
            :loading="tableLoading"
            style="width:100%;margin-top:8px;"
          >
            <template slot="tags" slot-scope="tags">
              <span>
                {{ tags.tag === 0 ? '默认' : '自定义' }}
              </span>
            </template>
            <template slot="operation" slot-scope="operation">
              <div class="editable-row-operations">
                <a @click="goDetail(operation)">查看</a>
              </div>
            </template>
          </a-table>
          <!-- 分页 -->
          <a-pagination
            :total="total"
            :show-total="total => `共 ${total} 条`"
            show-quick-jumper
            show-size-changer
            v-model="current"
            :default-current="current"
            :page-size.sync="pageSize"
            @change="onShowSizeChange"
            @showSizeChange="onShowSizeChange"
            :pageSizeOptions="['10', '20', '50', '100']"
            style="margin-top:30px;width:100%;text-align: right;"
          />
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import FormList from '@/components/FormList/index.jsx';
import api from '@/api';
import message from 'ant-design-vue/es/message';
import { debounce } from '@/utils/util';
export default {
  name: 'labels',
  data() {
    return {
      formList: [
        {
          label: '标签名',
          type: 'input',
          name: 'sealabelName',
          placeholder: '请输入标签名'
        },
        {
          label: '类型',
          type: 'select',
          name: 'tag',
          selectOptions: [
            {
              id: '',
              name: '全部'
            },
            {
              id: '0',
              name: '默认'
            },
            {
              id: '1',
              name: '自定义'
            }
          ]
        },
        {
          type: 'button',
          buttonName: '查询',
          htmlType: 'submit',
          align: 'right',
          labelCol: { span: 0 },
          wrapperCol: { span: 24 }
        }
      ],
      //表格高度
      scrollY: 100,
      //表头数据
      columns: [
        {
          title: '标签名',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          key: 'updateTime'
        },
        {
          title: '类型',
          key: 'tag',
          scopedSlots: { customRender: 'tags' }
        },
        {
          title: '操作',
          key: 'type',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      tag: '',
      sealabelName: '',
      labelname: '',
      labelId: '',
      addlabel: '',
      loading: false,
      tableLoading: true,
      validateStatus: '',
      validateHelp: '',
      //列表数据
      data: [],
      //分页
      total: 0,
      pageSize: 10,
      current: 1
    };
  },
  components: {
    FormList
  },
  mounted() {
    setTimeout(() => {
      console.log(this.$refs.content_main.offsetHeight);
      this.scrollY = this.$refs.content_main.offsetHeight - 245 + 'px';
    }, 100);
    this.$refs.form.setFieldsValue({
      tag: ''
    });
    this.getlabelList();
  },
  methods: {
    watchChange(e) {
      const value = e.target.value;
      if (value.trim().length > 0) {
        this.validateStatus = '';
        this.validateHelp = '';
        if (value.trim().length > 20) {
          this.validateStatus = 'error';
          this.validateHelp = '标签名最长20字';
        } else {
          this.validateStatus = '';
          this.validateHelp = '';
        }
      } else {
        this.validateStatus = 'error';
        this.validateHelp = '标签名称不能为空';
      }
    },
    //查询按钮
    onCheck() {
      debounce(() => {
        this.current = 1;
        this.getlabelList();
      });
    },
    //跳详情页
    goDetail(operation) {
      console.log('operation :>> ', operation);
      debounce(() => {
        this.$router.push({
          name: 'detail',
          params: {
            project: {
              name: operation.name,
              id: operation.id
            }
          }
        });
      });
    },
    // 分页
    onShowSizeChange(current, pageSize) {
      this.current = current;
      this.pageSize = pageSize;
      this.getlabelList();
    },
    //获取列表
    getlabelList() {
      // const { tag, sealabelName } = this.$refs.form.getFieldsValue();
      // console.log('tag :>> ', tag);
      // console.log('sealabelName :>> ', sealabelName);
      const para = {
        // tag: tag,
        // name: sealabelName ? sealabelName.trim() : '',
        pageIndex: this.current,
        pageSize: this.pageSize
      };
      this.tableLoading = true;
      api
        .getLabel(para)
        .then(res => {
          console.log('res :>> ', res);
          if (res.code === 200) {
            this.data = res.data.records;
            this.total = res.data.total;
          }
        })
        .finally(() => {
          this.tableLoading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
#labels {
  height: 100%;
  overflow: hidden;

  .editable-row-operations a {
    margin-right: 10px;
  }
}
</style>
