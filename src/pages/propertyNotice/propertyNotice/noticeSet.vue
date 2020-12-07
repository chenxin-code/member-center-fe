<template>
  <div style="height: 100%;">
    <div class="content-header">
      {{ notice.id ? "编辑" : "添加" }}公告
      <span class="fallback" @click="FALLBACK" style="cursor:pointer">返回</span>
    </div>
    <div class="content-main" style="height: calc(100% - 91px);margin-top:20px;">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" style="height: 100%;overflow: auto;" autoComplete="off">
        <a-form-item label="项目">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['projectId']"
            placeholder="请选择项目"
            :disabled="notice.id ? true : false"
          >
            <a-select-option v-for="item in projectData" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="标题">
          <a-input
            v-decorator="['title', { rules: [{ required: true, message: '标题不能为空' },{ message: '标题最长30个字',max: 30 },{whitespace: true,
              message: '标题不能为空'}] } ]"
            placeholder="请输入标题"
          />
        </a-form-item>
        <a-form-item label="发布方">
          <a-input
            v-decorator="['publisher', { rules: [{ required: true, message: '发布方不能为空' },{ message: '发布方最长13个字',max: 13 },{whitespace: true,
              message: '发布方不能为空'}] } ]"
            placeholder="请输入发布方"
          />
        </a-form-item>
        <a-form-item label="类型">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['typeId',{ rules: [{ required: true, message: '请选择类型' }] },]"
            placeholder="请选择类型"
          >
            <a-select-option v-for="item in types" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="公告等级">
          <a-select
            :getPopupContainer="(triggerNode)=>{ return triggerNode.parentNode || document.body;}"
            v-decorator="['grade',{ initialValue: '5' }]"
            placeholder="请选择公告等级"
          >
            <a-select-option v-for="(item, key) in grades" :key="key">{{item}}</a-select-option>
          </a-select>
          <span style="color: #c3c3c3">公告等级会在消息中心列表中展示，默认普通为不展示</span>
        </a-form-item>
        <a-form-item label="通知方式">
          <noticeWay v-decorator="['pushModes']" />
        </a-form-item>
        <a-form-item label="详细内容" style="margin-bottom: 200px">
          <richTextLike
            ref="child"
            @addPreviewNotice="addPreviewNotice"
            v-decorator="['richText', { rules: [ { required: true, message: '请填写详细内容' }] }]"
            :urls="{
              picUpload: 'uploadPropertyNoticePic',
              previewQRCode: 'app_notice'
            }"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="content-footer">
      <a-button type="primary" size="large" style="width: 120px;" @click="onSubmit(0)">保存</a-button>
      <a-button type="primary" size="large" style="width: 120px;" @click="onSubmit(1)">保存并发布</a-button>
    </div>
  </div>
</template>

<script>
import api from "@/api";
import { mapActions } from "vuex"
import richTextLike from "@/components/richTextLike";
import noticeWay from "./noticeWay";
import { debounce } from '@/utils/util';
export default {
  name: "addNotice",
  components: { richTextLike, noticeWay },
  props: {
    project: {
      type: Object,
      default: () => ({})
    },
    notice: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "form" }),
      loading: false,
      grades: {
        5: "普通",
        4: "提示",
        3: "重要",
        2: "紧急",
        1: "非常紧急"
      },
      types: [],
      projectData: [],
      richText: []
    }
  },
  computed: {},
  created() {
    this.getNoticeTypes();
    this.getData();
  },
  mounted() {
    this.getMyProject();
  },
  methods: {
    ...mapActions([
      "FALLBACK"
    ]),
    getData() {
      if (this.notice?.id) {
        api.getPropertyNoticeInfo({ id: this.notice.id }).then(res => {
          if (res.code === 200) {
            const data = res.data;
            this.form.setFieldsValue({
              grade: (data.grade || 5).toString(),
              publisher: data.publisher,
              pushModes: {
                checked: data.pushModes !== 2,
                radioValue: data.pushModes !==2  ? data.pushModes.toString() : ""
              },
              richText: JSON.stringify(data.details),
              title: data.title,
              typeId: data.typeId,
            });
          }
        });
      }
    },
    getNoticeTypes() {
      api.getPropertyNoticeTypes().then((res) => {
        if (res.code === 200) {
          this.types = res.data || [];
        }
      });
    },
    //获取项目
    getMyProject() {
      api.myProject().then(res => {
        if (res.code === 200) {
          this.projectData = res.data;
          this.form.setFieldsValue({
            projectId: this.project.id,
          });
        }
      });
    },
    addPreviewNotice(value) {
      console.log(value)
      this.form.validateFields((err, values) => {
        if (!err) {
          const para = {
            projectId: values.projectId,
            title: values.title ? values.title.trim() : "",
            publisher: values.publisher ? values.publisher.trim() : "",
            typeId: values.typeId,
            grade: Number(values.grade),
            pushModes: values.pushModes != undefined && values.pushModes.checked === true ? Number(values.pushModes.radioValue) : 2,
            detail: value,
            status: 0
          };
          const that = this;
          api.addPreviewNotice(para).then(res => {
            if (res.code === 200) {
              that.$refs.child.toQrcode(res.data);
            }
          }).finally(() => {
          });
        }
      })

    },
    onSubmit(e) {
      // e.preventDefault();
      debounce(()=>{
        const isAdd = !this.notice.id;
        this.form.validateFields((err, values) => {
          if (!err) {
            if(Array.isArray(values.richText)){
              this.richText = values.richText
            }else{
              this.richText = JSON.parse(values.richText)
            }
            for (var i = 0; i < this.richText.length; i++) {
              if (this.richText[i].type === "pic" || (this.richText[i].type === "text" && this.richText[i].content !== "")) {
                values = {
                  id: !isAdd ? this.notice.id : undefined,
                  projectId: values.projectId,
                  title: values.title ? values.title.trim() : "",
                  publisher: values.publisher ? values.publisher.trim() : "",
                  typeId: values.typeId,
                  grade: Number(values.grade),
                  pushModes: values.pushModes != undefined && values.pushModes.checked === true ? Number(values.pushModes.radioValue) : 2,
                  detail: isAdd ? JSON.stringify(values.richText) : values.richText,
                  status: e
                };
                api[isAdd ? "addPropertyNotice" : "updatePropertyNotice"](values).then(res => {
                  if (res.code === 200) {
                    this.$message.success((isAdd ? "新增" : "编辑") + "成功");
                    this.$router.push({ name: "propertyNotice" });
                  }
                });
                return;
              }else {
                this.$message.error("内容不能为空");
                return;
              }
            }
          }
        });
      })
    },
  }
}
</script>

<style lang="less" scoped>
.content-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > *:not(.last-child) {
    margin-right: 10px;
  }
}
</style>
