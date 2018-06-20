import { manageService } from '~/config/server/manage-service'
import { NetService } from '~/utils/net.service'
import { Inject, Debounce } from "~/core/decorator";
export class BasicExpenseService {
  @Inject()
  private netService: NetService

  /**
   * 获取所有费用项
   */
  @Debounce()
  findBasicExpenseByAuth() {
    return this.netService.send({
      server: manageService.basicExpenseController.findBasicExpenseByAuth,
      loading: true
    })
  }

  /**
   * 新增费用项
   * @param data 新增实体
   */
  @Debounce()
  addBasicExpense(data) {
    return this.netService.send({
      server: manageService.basicExpenseController.addBasicExpense,
      data: {
        expenseCode: data.expenseCode,
        expenseName: data.expenseName,
        isSystem: data.isSystem,
        remark: data.remark
      },
      loading: true
    })
  }

  /**
   * 修改费用项
   * @param data 修改实体
   */
  @Debounce()
  editBasicExpense(data) {
    return this.netService.send({
      server: manageService.basicExpenseController.editBasicExpense,
      data: {
        id: data.id,
        expenseName: data.expenseName,
        remark: data.remark
      },
      loading: true
    })
  }

  /**
   * 删除费用项
   * @param expenseId 费用项id
   */
  @Debounce()
  deleteBasicExpense(expenseId){
    return this.netService.send({
      server: manageService.basicExpenseController.deleteBasicExpense,
      append: expenseId,
      loading: true
    })
  }

  /**
   * 复制模板
   */
  @Debounce()
  copyTemplate() {
    return this.netService.send({
      server: manageService.basicExpenseController.copyTemplate,
      loading: true
    })
  }

}