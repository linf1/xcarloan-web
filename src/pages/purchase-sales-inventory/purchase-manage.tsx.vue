<!-- 外采管理 -->
<template>
  <section class="page purchase-manage">
    <page-header title="外采管理" hidden-print hidden-export>
    </page-header>
    <data-form hidden-date-search :model="queryParamsModel" @on-search="refreshEnterShellSave">
      <template slot="input">
        <i-form-item prop="orderNo" label="订单编号：">
          <i-input placeholder="请输入订单编号" v-model="queryParamsModel.orderNo"></i-input>
        </i-form-item>
        <i-form-item prop="customerName" label="客户姓名：">
          <i-input placeholder="请输入客户姓名" v-model="queryParamsModel.customerName"></i-input>
        </i-form-item>
        <i-form-item prop="stockStatus" label="状态：">
          <i-select v-model="queryParamsModel.stockStatus" clearable>
            <i-option v-for="{value,label} in $dict.getDictData(10014)" :key="value" :label="label" :value="value"></i-option>
          </i-select>
        </i-form-item>
      </template>
    </data-form>
    <data-box :columns="enterShellSaveColumns" :data="enterShellSaveDataSet" @on-page-change="refreshEnterShellSave" :page="pageService" ref="databox"></data-box>
  </section>
</template>

<script lang="tsx">
import Page from "~/core/page";
import { namespace } from "vuex-class";
import { Button } from "iview";
import { Layout } from "~/core/decorator";
import Component from "vue-class-component";
import CarParams from "~/components/base-data/car-params.vue";
import ModifyBasicStockCar from "~/components/purchase-sales-inventory/modify-basic-stock-car.vue";
import OrderCarDetails from "~/components/purchase-sales-inventory/order-car-details.vue";
import { Dependencies } from "~/core/decorator";
import { PageService } from "~/utils/page.service";
import { BasicEnterShellSaveService } from "~/services/manage-service/basic-enter-shell-save.service";
import { BasicStockCarService } from "~/services/manage-service/basic-stock-car.service";

const CustomerOrderModule = namespace("customerOrderSpace");

@Layout("workspace")
@Component({
  components: {}
})
export default class PurchaseManage extends Page {
  @Dependencies(PageService) private pageService: PageService;
  @Dependencies(BasicEnterShellSaveService) private basicEnterShellSaveService: BasicEnterShellSaveService;
  @Dependencies(BasicStockCarService) private basicStockCarService: BasicStockCarService;
  @CustomerOrderModule.Action showOrderInfo;

  private enterShellSaveColumns: any = [];
  private enterShellSaveDataSet: Array<any> = [];

  private queryParamsModel = {
    orderNo: "",
    customerName: "",
    stockStatus: ""
  };

  created() {
    this.enterShellSaveColumns = [
      {
        title: "操作",
        width: this.$common.getOperateWidth(2),
        align: "center",
        render: (h, { row, column, index }) => {
          let buttons = [(<i-button type="text" class="row-command-button" onClick={() => this.onGetVehicleInfo(row)}>详情</i-button>)]
          if (row.stockStatus === 10123) {
            buttons.push(<i-button type="text" class="row-command-button" onClick={() => this.onStockCarOperate(row.modelId, row)}>采购</i-button>)
          } else if (row.stockStatus === 10046) {
            buttons.push(<i-button type="text" class="row-command-button" onClick={() => this.onChangeCsrStockStatus(row)}>车辆整备</i-button>)
          }
          return h('div', {}, buttons)
        }
      },
      {
        align: "center",
        editable: true,
        title: "订单编号",
        key: "orderNo",
        minWidth: this.$common.getColumnWidth(5),
        render: (h, { row }) => (<i-button type="text" class="row-command-button" onClick={() => this.showOrderInfo(row.orderId)}>{row.orderNo}</i-button>)

      },
      {
        align: "center",
        editable: true,
        title: "客户姓名",
        key: "customerName",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "车型名称",
        key: "modelName",
        minWidth: this.$common.getColumnWidth(4),
        render: (h, { row, column, index }) => (<i-button type="text" class="row-command-button" onClick={() => this.onGetCarParams(row.modelId)}>{row.modelName}</i-button>)
      },
      {
        align: "center",
        editable: true,
        title: "车辆颜色",
        key: "modelColors",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "采购价格(元)",
        key: "stockPrice",
        minWidth: this.$common.getColumnWidth(4)
      },
      {
        align: "center",
        editable: true,
        title: "状态",
        key: "stockStatus",
        minWidth: this.$common.getColumnWidth(3),
        render: (h, { row, columns, index }) =>
          h("p", {}, this.$filter.dictConvert(row.stockStatus))
      }
    ];
  }

  mounted() {
    // 加载数据
    this.refreshEnterShellSave();
  }

  /**
   * keep-alive生命周期钩子函数
   */
  activated() {
    // 加载数据
    this.refreshEnterShellSave();
  }

  /**
   * 刷新列表
   */
  refreshEnterShellSave() {
    this.basicEnterShellSaveService
      .queryOutSideList(this.queryParamsModel, this.pageService)
      .subscribe(
        data => (this.enterShellSaveDataSet = data),
        err => this.$Message.error(err.msg)
      );
  }

  /**
   * 修改库存状态
   * @param data
   */
  onChangeCsrStockStatus(row) {
    this.$Modal.confirm({
      content: "确定执行车辆整备操作吗？",
      onOk: () => {
        this.basicStockCarService.updateCarStockStatus(row).subscribe(
          data => {
            this.$Message.success("操作成功！");
            this.refreshEnterShellSave();
          },
          err => this.$Message.error(err.msg)
        );
      }
    });
  }

  /**
   * 库存操作
   * @param val
   */
  onStockCarOperate(modelId: number, val?: Object) {
    this.$dialog.show({
      title: "外采",
      footer: true,
      onOk: modifyBasicStockCar => {
        return modifyBasicStockCar.submit().then(v => {
          if (v) this.refreshEnterShellSave();
          return v;
        });
      },
      render: h =>
        h(ModifyBasicStockCar, {
          props: {
            modelId: modelId,
            stockCarData: val
          }
        })
    });
  }

  /**
   * 获取车辆信息
   */
  onGetVehicleInfo(data) {
    this.$dialog.show({
      title: "查看详情",
      isView: true,
      footer: true,
      render: h =>
        h(OrderCarDetails, {
          props: {
            orderId: data.orderId
          }
        })
    });
  }

  /**
   * 查看车型信息
   */
  onGetCarParams(modelId) {
    this.$dialog.show({
      title: "车型信息",
      isView: true,
      footer: true,
      render: h =>
        h(CarParams, {
          props: {
            carId: modelId,
            isView: true
          }
        })
    });
  }
}
</script>

<style lang="less" scoped>
</style>
