//待办事项管理 backlog-controller
import { requestType } from '~/config/enum.config'
const SERVICE = 'service-manage'
const CONTROLLER = 'basicProductController'
export default {
  /**
   * 新增车型产品
   */
  addBasicProduct: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'addBasicProduct',
    type: requestType.Post
  },
  /**
   * 删除车型产品
   */
  deleteBasicProduct: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'roleAllocateBacklogs',
    type: requestType.Delete
  },
  /**
   * 获取车型产品
   */
  findBasicProduct: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findBasicProduct',
    type: requestType.Get
  },
  /**
   * 车型配置
   */
  editBasicProductConfig: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'editBasicProductConfig',
    type: requestType.Post
  },
  /**
   * 还款方案配置
   */
  editBasicProductScheme: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'editBasicProductScheme',
    type: requestType.Post
  },
  /**
   * 获取车型产品列表
   */
  findBasicProductList: {
    service: SERVICE,
    controller: CONTROLLER,
    action: 'findBasicProductList',
    type: requestType.Get
  }

}