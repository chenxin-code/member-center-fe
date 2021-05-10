<template>
  <div id="act-detail">
    <div class="content-header">
      行为详情
      <span class="fallback" @click="$router.go(-1)" style="cursor: pointer;">返回</span>
    </div>
    <div class="act-main">
      <a-row style="height: 100%">
        <div class="act-common act-base">
          <a-row class="common-row">
            <a-col :span="24">
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">行为名称:</div>
                    <div class="column-left">{{name}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">行为代码:</div>
                    <div class="column-left">{{code}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">行为来源:</div>
                    <div class="column-left">{{laiyuan}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">行为类型:</div>
                    <div class="column-left">{{leixing}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">行为描述:</div>
                    <div class="column-left">{{memo}}</div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">关联的任务:</div>
                    <div class="column-left">
                      <a-table
                        :columns="columns"
                        :bordered="true"
                        :pagination="false"
                        :data-source="taskData"
                        v-if="taskData.length > 0"
                        :row-key="(r, i) => i">
                      </a-table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="common-column-wrapp">
                <div class="common-column">
                  <div class="column-item">
                    <div class="column-right">行为状态:</div>
                    <div class="column-left">{{isUsingStr}}</div>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-row>
    </div>
  </div>
</template>

<script>
import api from './../../../api';
export default {
  name: 'taskCenter-behavior-detial',
  components: {},
  data() {
    return {
      name: null,
      code: null,
      memo: null,
      isUsingStr: null,
      laiyuan: null,
      leixing: null,
      taskData: [],
      columns: [
        {
          title: '任务名称',
          dataIndex: 'taskName',
          key: 'taskName',
          align: "center",
        },
        {
          title: '任务描述',
          dataIndex: 'memo',
          key: 'memo',
          align: "center",
        },
        {
          title: '奖励类型',
          dataIndex: 'taskCondition',
          key: 'taskCondition',
          align: "center",
        }
      ]
    };
  },
  computed: {

  },
  methods: {

  },
  created() {
    api.selectBehaviour({
      id: this.$route.query.id
    }).then(resp => {
      if (resp.code === 200) {
        this.name = resp.data.name;
        this.code = resp.data.code;
        this.memo = resp.data.memo;
        this.isUsingStr = Number(resp.data.isUsing)?'启用':'禁用';
        this.laiyuan = resp.data.sourceName;
        [{id: 1, name: '消费'},{id: 2, name: '其他'}].forEach((v, k) => {
          if (v.id === resp.data.type) {
            this.leixing = v.name;
          }
        });
        resp.data.taskList.forEach((v, k) => {
          this.taskData.push({
            taskName: v.taskName,
            memo: v.memo,
            taskCondition: v.taskCondition
          });
        });
      }
    });
  },
  mounted() {
  },
  watch: {}
};
</script>

<style lang="less" scoped>
#act-detail {
  height: 100%;

  .content-header {
    .fallback {
      cursor: pointer;
    }
  }

  .act-main {
    height: calc(100% - 50px);
    overflow-y: auto;

    .act-common {
      background-color: #fff;

      .common-title {
        color: #666;
        padding: 20px 0 0 30px;

        .common-title-content {
          font-size: 16px;
          height: 16px;
          line-height: 16px;
          padding-left: 8px;
          border-left: 3px solid rgba(33, 33, 206, 0.5);
        }
      }

      .common-row {
        padding: 30px 16px 0;
        border-bottom: 1px dashed #ccc;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        align-items: center;

        .common-column-wrapp {
          margin-bottom: 20px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;

          .common-column {
            padding-right: 50px;

            .column-item {
              padding-bottom: 20px;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              align-items: center;

              .column-right {
                width: 132.25px;
                padding-right: 5px;
                display: flex;
                flex-direction: row;
                justify-content: flex-end;
                align-items: center;
              }

              .column-left {
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: center;

                .column-left-image {
                  margin-left: 10px;
                  width: 103px;
                  height: 103px;
                  border: 1px dashed #ccc;
                  border-radius: 8px;
                  display: flex;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                }
              }
            }

            .column-item:last-child {
              padding-bottom: 0;
            }
          }
        }

        .common-column-wrapp:last-child {
          margin-bottom: 0;
        }
      }

      .common-row:last-child {
        border: none;
      }
    }

    .act-award {
      padding-bottom: 20px;

      .common-row {
        .common-column-wrapp {
          margin-bottom: 20px !important;
        }
      }
    }
  }
}
</style>
