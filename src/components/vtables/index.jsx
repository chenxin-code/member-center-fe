const table = {
  render() {
    const props = { ...this.$attrs, ...this.$props, ...{ dataSource: this.tableColumns, columns: this.tableData }}
    // const slots = Object.keys(this.$slots).map(slot => {
    //   return (
    //     <template slot={slot}>{ this.$slots[slot] }</template>
    //   )
    // })
    const table = (
      <a-table
        props={props} scopedSlots={ this.$scopedSlots }
      >
        <slot name="tables"></slot>
      </a-table>
    )
    return (
      <div class="dc-table">
        { table }
      </div>
    );
  }
};

export default table;