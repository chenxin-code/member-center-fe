<template>
  <div id="activitySetSecond">
    <div class="content-card">
      <div class="content-header">
        报名表设置
        <span class="fallback" @click="FALLBACK">返回</span>
      </div>
      <div class="content-main">
        <a-row type="flex">
          <a-col :span="2" style="text-align: right; padding-right: 10px">
            <span>说明:</span>
          </a-col>
          <a-col :span="22">
            <a-textarea
              v-model="form.signDesc"
              placeholder="请输入"
              :auto-size="{ minRows: 4, maxRows: 6 }"
            />
          </a-col>
        </a-row>
      </div>
    </div>

    <div class="content-card content-main">
      <a-row type="flex" class="content-card--row">
        <!-- <a-col flex="166px" class="left-content">
          <a-list class="type-change left-list">
            <a-list-item
              v-for="(item, index) of tabList"
              :key="item.name"
              :class="{ active: currentComponent === item.name }"
              @click="tabChange(item.name, index)"
              >{{ item.label }}</a-list-item
            >
          </a-list>
        </a-col> -->
        <a-col flex="auto" class="right-content">
          <component
            :is="currentComponent"
            :currntQuestions="form.questions"
            @chagneInfo="chagneInfo"
          ></component>
        </a-col>
      </a-row>
    </div>
    <div class="content-footer">
      <a-button>上一步</a-button>
      <a-button type="primary" @click="save">保存</a-button>
      <a-button type="primary">保存并发布</a-button>
    </div>
  </div>
</template>

<script>
import signSingle from "./signSingle";
import signMultiple from "./signMultiple";
import signInput from "./signInput";

import { mapActions } from "vuex";
const choice = {
  checked: true,
  value: '' || [],
  maxLength: "",
  required: false,
};
export default {
  data() {
    return {
      form: {
        signDesc: "",
        userName: "",
        phone: "",
        questions: [
          {
            title: "",
            required: true,
            type: 1,
            maxLength: '', //题目长度
            choices: [JSON.parse(JSON.stringify(choice)),JSON.parse(JSON.stringify(choice))], //选择题
          },
          {
            title: "",
            required: true,
            type: 2,
            maxLength: '', //题目长度
            choices: [JSON.parse(JSON.stringify(choice)),JSON.parse(JSON.stringify(choice))], //选择题
          },
          {
            title: "",
            required: true,
            type: 3,
            maxLength: '', //题目长度
            choices: [], //选择题
          },
        ],
      },
      tabList: [
        {
          label: "单选",
          name: "signSingle",
        },
        {
          label: "多选",
          name: "signMultiple",
        },
        {
          label: "填空",
          name: "signInput",
        },
      ],
      currentComponent: "signInput",
      currentIndex: 2,
    };
  },
  components: {
    signSingle,
    signMultiple,
    signInput,
  },
  methods: {
    ...mapActions(["FALLBACK"]),
    tabChange(tab, index) {
      this.currentComponent = tab;
      this.currentIndex = index;
    },
    // 绑定姓名和手机号
    chagneInfo(val) {
      const key = Object.keys(val);
      this.form[key[0]] = val[key[0]];
    },
    save() {
      console.log("tab", this.tabList);
    },
  },
};
</script>
<style lang='less'>
@modelHeight: 20px;
#activitySetSecond {
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
  .content-card {
    background: #fff;
    & + .content-card {
      margin-top: 20px;
      height: 100%;
      flex: 1 1 auto;
      overflow: hidden;
    }
  }
  .content-main {
    padding: @modelHeight;
    & + .content-main {
      position: relative;
      padding-top: 40px;
    }
  }
  .content-card--row {
    height: 100%;
    overflow: hidden;
    flex-flow: row nowrap;

    .left-content {
      height: 100%;
      background: #f7f8fc;
    }
    .right-content {
      height: 100%;
      overflow: auto;
    }
  }
  .left-list {
    width: 100%;
    padding: 10px;
    li {
      width: 100%;
      padding: 10px;
      margin-bottom: 10px;
      background: #ffffff;
      border: 1px solid #e9e9e9;
      border-radius: 2px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0;
      cursor: pointer;
    }
    li.active {
      background: #e2f3ff;
      border: 1px solid @primary-color;
      border-radius: 2px;
      color: @primary-color;
      font-family: PingFangSC-Semibold;
    }
  }
  .content-footer {
    text-align: right;
    line-height: 64px;
    .ant-btn + .ant-btn {
      margin-left: 10px;
    }
  }
}
</style>
