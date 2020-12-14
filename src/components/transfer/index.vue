<template>
  <a-transfer
    :data-source="mockData"
    :target-keys="value"
    show-search
    :list-style="{
      height: '480px'
    }"
    :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
    :show-select-all="false"
    @change="onChange"
  >
    <template
      slot="children"
      slot-scope="{
        props: { direction, filteredItems, selectedKeys, disabled: listDisabled },
        on: { itemSelectAll, itemSelect }
      }"
    >
      <a-table
        style="width:360px;height:360px;overflow:auto"
        :row-selection="getRowSelection({ disabled: listDisabled, selectedKeys, itemSelectAll, itemSelect })"
        :columns="direction === 'left' ? leftColumns : rightColumns"
        :data-source="filteredItems"
        size="small"
        :style="{ pointerEvents: listDisabled ? 'none' : null }"
        :custom-row="
          ({ key, disabled: itemDisabled }) => ({
            on: {
              click: () => {
                if (itemDisabled || listDisabled) return;
                itemSelect(key, !selectedKeys.includes(key));
              }
            }
          })
        "
      />
    </template>
  </a-transfer>
</template>

<script>
import difference from 'lodash/difference';
export default {
  name: 'vTransfer',
  props: ['value', 'mockData', 'leftColumns', 'rightColumns'],
  data() {
    return {
      targetKeys: this.value
    };
  },
  methods: {
    onChange(nextTargetKeys) {
      this.targetKeys = nextTargetKeys;
      this.$emit('input', this.targetKeys);
    },
    getRowSelection({ disabled, selectedKeys, itemSelectAll, itemSelect }) {
      return {
        getCheckboxProps: item => ({ props: { disabled: disabled || item.disabled } }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows.filter(item => !item.disabled).map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, selectedKeys)
            : difference(selectedKeys, treeSelectedKeys);
          itemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          itemSelect(key, selected);
        },
        selectedRowKeys: selectedKeys
      };
    }
  }
};
</script>

<style scoped></style>
