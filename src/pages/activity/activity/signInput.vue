<template>
  <div class="signInput">
    <a-form ref="form" :form="form">
      <a-form-item
        label="姓名"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          :span="8"
          :disabled="true"
          @change="changeName"
          v-decorator="[
            'userName',
            {
              rules: [
                {
                  required: true,
                  max: 30,
                  message: '不能超过30个字',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item
        label="手机号"
        placeholder="请输入"
        @change="changePhone"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 12 }"
      >
        <a-input
          :disabled="true"
          v-decorator="[
            'phone',
            {
              rules: [
                {
                  required: true,
                  max: 30,
                  message: '不能超过30个字',
                },
              ],
            },
          ]"
        />
      </a-form-item>
      <a-form-item v-for="(item, index) in questions" :key="index">
        <a-row :gutter="24" class="form-item-row">
          <a-col
            :span="3"
            class="ant-form-item-label"
            style="text-align: right"
          >
            <label>题目</label>
          </a-col>
          <a-col :span="12">
            <a-input v-model="item.title"></a-input>
          </a-col>
          <a-col :span="9">
            <template v-if="questions.length > 1">
              <a-button
                type="link"
                v-if="index !== 0"
                @click="questionUp(index)"
                >上移</a-button
              >
              <a-button
                type="link"
                v-if="index !== questions.length - 1"
                @click="questionDown(index)"
                >下移</a-button
              >
            </template>
            <a-button
              type="link"
              v-if="questions.length > 1"
              @click="deleteQuestion(index)"
              >删除</a-button
            >
            <a-checkbox v-model="item.required">必填</a-checkbox>
          </a-col>
        </a-row>
        <a-input
          v-if="item.type === 3"
          class="title-limit"
          placeholder="最多输入数字"
          v-model="item.maxLength"
        ></a-input>
        <!-- 选择题 -->
        <div style="margin-left: 12.5%" v-else>
          <div v-for="(choice, idx) in item.choices" :key="'choice-' + idx">
            <a-row :gutter="24" class="form-item-row choice">
              <a-col :span="10">
                <a-checkbox
                  v-model="choice.checked"
                  class="choice-checkox"
                ></a-checkbox>
                <a-select
                  :mode="item.type === 2 ? 'multiple' : ''"
                  v-model="choice.value"
                >
                  <a-select-option
                    v-for="i in 25"
                    :key="(i + 9).toString(36) + i"
                  >
                    {{ (i + 9).toString(36) + i }}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="12">
                <a-button
                  type="link"
                  v-if="idx !== 0"
                  @click="choiceUp(index, idx)"
                  >上移</a-button
                >
                <a-button
                  type="link"
                  v-if="idx !== item.choices.length - 1"
                  @click="choiceDown(index, idx)"
                  >下移</a-button
                >
                <a-button
                  type="link"
                  v-if="item.choices.length > 1"
                  @click="deleteChoice(index, idx)"
                  >删除</a-button
                >
                <a-checkbox v-model="choice.required">允许填空</a-checkbox>
              </a-col>
            </a-row>
            <a-input
              v-if="choice.required"
              class="choice-limit"
              placeholder="最多输入数字"
              v-model="choice.maxLength"
            ></a-input>
          </div>
          <a-button
            type="dashed"
            icon="plus"
            block
            class="plus-question"
            @click="addChoice(index)"
            >添加单个选项</a-button
          >
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
const questionObj = {
  title: "",
  required: true,
};
const choice = {
  checked: true,
  value: "" || [],
  maxLength: "",
  required: false,
};

export default {
  props: {
    currntQuestions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      questions: [],
      userName: "",
    };
  },
  watch: {
    currntQuestions: {
      handler(val) {
        this.questions = val || [questionObj];
      },
      immediate: true,
    },
  },
  created() {
    this.form = this.$form.createForm(this, {
      onValuesChange: (_, values) => {
        this.$emit("chagneInfo", values);
      },
    });
  },
  methods: {
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    changeName() {},
    changePhone(val) {
      console.log(val);
    },
    addChoice(index) {
      this.questions[index].choices.push(JSON.parse(JSON.stringify(choice)));
    },
    deleteQuestion(index) {
      this.questions.splice(index, 1);
    },
    deleteChoice(pidx, idx) {
      this.questions[pidx].choices.splice(idx, 1);
    },
    questionUp(index) {
      this.locationUp(this.questions, index);
    },
    questionDown(index) {
      this.locationDown(this.questions, index);
    },
    choiceUp (pidx,idx) {
      this.locationUp(this.questions[pidx].choices, idx);
    },
    choiceDown (pidx,idx) {
      this.locationDown(this.questions[pidx].choices, idx);
    },
    // 上移
    locationUp(arr, index) {
      const current = arr[index];
      const before = arr[index - 1];
      arr.splice(index - 1, 1, current);
      arr.splice(index, 1, before);
    },
    // 下移
    locationDown(arr, index) {
      const current = arr[index];
      const next = arr[index + 1];
      arr.splice(index + 1, 1, current);
      arr.splice(index, 1, next);
    },
  },
};
</script>
<style lang='less'>
@labelWidth: 12.5%;
.signInput {
  .form-item-row {
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 10px;
    .ant-col {
      padding: 0 !important;
    }

    .ant-checkbox-wrapper {
      margin-left: 10px;
    }
    .choice-checkox {
      width: 30px;
      margin-left: 0;
      & + .ant-select {
        // margin-left: 10px;
        width: calc(100% - 30px);
      }
    }
  }
  // .form-item-row.choice {
  //   // margin-left: @labelWidth !important;
  // }
  .choice-limit,
  .title-limit {
    width: 160px;
    margin-bottom: 10px;
  }
  .title-limit {
    margin-left: @labelWidth;
  }
  .choice-limit {
    margin-left: 30px;
  }
  .plus-question {
    display: block;
    width: calc(41.66666667% - 30px);
    margin-left: 30px;
    color: #666666;
    font-size: 12px;
    i {
      color: #999;
    }
  }
}
</style>
