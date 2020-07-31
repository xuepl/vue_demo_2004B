<template>
  <div>

    <el-card>
      <el-form :inline="true" :model="getCaseFrom">
        <el-form-item label="">
          <el-input v-model="caseName" placeholder="请输入用例名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getCaseListEvent">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openAddCaseDialogEvent">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="caseList" style="width: 100%">
        <el-table-column prop="name" label="用例名">
          <template slot-scope="scope">
            <el-link type="primary" @click="$router.push({name:'testCaseAPI',params:{case_id:scope.row.id}})">{{
              scope.row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="api_count" label="接口总数" />

        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateCaseEvent(scope.row.id, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="用例描述" />
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button @click="openUpdateCaseDialogEvent(scope.row)">修改</el-button>
            <el-button type="danger" @click="openDeleteCaseDialogEvent(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页器-->
      <el-row>
        <el-col :span="9" :offset="13">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="sizeChangeEvent"
            @current-change="currentChangeEvent"
          />
        </el-col>
      </el-row>
    </el-card>

    <!--新增用例对话框-->
    <el-dialog
      title="新增用例"
      :visible.sync="addCaseDialogVisible"
      width="30%"
      :before-close="addCaseDialogCloseEvent"
    >
      <!--新增用例集表单-->
      <el-form ref="caseForm" label-width="80px" :model="caseForm" :rules="caseRules">
        <el-form-item label="用例名" prop="name">
          <el-input v-model="caseForm.name" />
        </el-form-item>
        <el-form-item label="用例描述" prop="description">
          <el-input v-model="caseForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCaseDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="addCaseEvent">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用例集对话框-->
    <el-dialog
      title="修改用例"
      :visible.sync="updateCaseDialogVisible"
      width="30%"
      :before-close="updateCaseDialogCloseEvent"
    >
      <!--修改用例集表单-->
      <el-form ref="caseForm" label-width="100px" :model="caseForm" :rules="caseRules">
        <el-form-item label="用例名" prop="name">
          <el-input v-model="caseForm.name" />
        </el-form-item>
        <el-form-item label="用例描述" prop="description">
          <el-input v-model="caseForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCaseDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="updateCaseEvent(caseId, caseForm)">确 定</el-button>
      </span>
    </el-dialog>

    <!--删除主机-->
    <el-dialog
      title="删除用例集"
      :visible.sync="deleteCaseDialogVisible"
      width="30%"
      :before-close="deleteCaseDialogCloseEvent"
    >
      <span>是否确认删除该用例集？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteCaseDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="deleteCaseEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  caseListRequest,
  addCaseRequest,
  updateCaseRequest,
  deleteCaseRequest
} from '@/api/project.js'
import { sleep } from '@/utils/sleep.js'

export default {
  name: 'CaseList',
  data() {
    return {
      caseName: '',
      projectList: [],
      caseList: [],
      suiteId: null,
      caseId: null,
      loading: false,
      addCaseDialogVisible: false,
      updateCaseDialogVisible: false,
      deleteCaseDialogVisible: false,
      currentPage: 1,
      size: 10,
      total: 0,
      getCaseFrom: {
        projectName: ''
      },
      caseForm: {
        name: '',
        case: '',
        description: ''
      },
      caseRules: {
        name: [{ required: true, message: '请输入环境名称', trigger: 'blur' }],
        case: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
        description: []
      }

    }
  },
  created() {
    if (this.$route.params.suite_id) {
      this.suiteId = this.$route.params.suite_id
      this.getCaseListEvent()
    }
  },
  methods: {
    getCaseListEvent() {
      var query = {}
      if (this.suiteId) {
        query = { suite_id: this.suiteId }
      }
      if (this.caseName !== '') {
        query['name'] = this.caseName
      }
      console.log(query)
      caseListRequest(query).then(response => {
        this.caseList = response.data.results
        this.$message.success(response.message)
      })
    },

    openAddCaseDialogEvent() {
      if (this.suiteId) {
        this.addCaseDialogVisible = true
      } else {
        this.$message.error('请重新选择用例集')
      }
    },
    openUpdateCaseDialogEvent(row) {
      this.caseId = row.id
      const { name, description } = row
      this.caseForm = { name, description }
      this.updateCaseDialogVisible = true
    },
    openDeleteCaseDialogEvent(row) {
      this.caseId = row.id
      this.deleteCaseDialogVisible = true
    },
    addCaseDialogCloseEvent() {
      this.$refs.caseForm.resetFields()
      this.addCaseDialogVisible = false
    },
    updateCaseDialogCloseEvent() {
      this.$refs.caseForm.resetFields()
      this.updateCaseDialogVisible = false
    },
    deleteCaseDialogCloseEvent() {
      this.deleteCaseDialogVisible = false
    },

    addCaseEvent() {
      this.$refs.caseForm.validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.caseForm))
          data['suite_id'] = this.suiteId
          addCaseRequest(data).then(res => {
            if (res.code === 20000) {
              this.getCaseListEvent()
              this.addCaseDialogVisible = false
              this.$message.success(res.message)
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('数据验证失败')
        }
      })
    },
    updateCaseEvent(id, row) {
      updateCaseRequest(id, row).then(result => {
        this.$message.success(result.message)
        this.updateCaseDialogVisible = false
        this.getCaseListEvent()
      }).catch((result) => {
        sleep(500).then(() => {
          this.getCaseListEvent()
        })
      })
    },
    deleteCaseEvent() {
      deleteCaseRequest(this.caseId).then(response => {
        this.$message.success('删除成功')
        this.deleteCaseDialogCloseEvent()
        this.getCaseListEvent()
      }).catch(res => {
        this.deleteCaseDialogCloseEvent()
      })
    },
    sizeChangeEvent(size) {
      this.size = size
      this.getCaseListEvent()
    },
    currentChangeEvent(page) {
      this.currentPage = page
      this.getCaseListEvent()
    }

  }

}
</script>

<style scoped>

</style>
