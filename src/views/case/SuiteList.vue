<template>
  <div>

    <el-card>
      <el-form :inline="true" :model="getSuiteFrom">
        <el-form-item label="">
          <el-select
            v-model="getSuiteFrom.projectName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入项目名称"
            :remote-method="getProjectListEvent"
            :loading="loading"
            @change="projectSelectedEvent"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getSuiteListEvent">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openAddSuiteDialogEvent">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="suiteList" style="width: 100%">
        <el-table-column prop="name" label="用例集">
          <template slot-scope="scope">
            <el-link type="primary" @click="$router.push({name:'testSuiteCase',params:{suite_id:scope.row.id}})">{{
              scope.row.name }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="case_count" label="用例总数" />

        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateSuiteEvent(scope.row.id, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button @click="openUpdateSuiteDialogEvent(scope.row)">修改</el-button>
            <el-button type="danger" @click="openDeleteSuiteDialogEvent(scope.row)">删除</el-button>
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

    <!--新增用例集对话框-->
    <el-dialog
      title="新增用例集"
      :visible.sync="addSuiteDialogVisible"
      width="30%"
      :before-close="addSuiteDialogCloseEvent"
    >
      <!--新增用例集表单-->
      <el-form ref="suiteForm" label-width="100px" :model="suiteForm" :rules="suiteRules">
        <el-form-item label="用例集名" prop="name">
          <el-input v-model="suiteForm.name" />
        </el-form-item>
        <el-form-item label="用例集描述" prop="description">
          <el-input v-model="suiteForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSuiteDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="addSuiteEvent">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改用例集对话框-->
    <el-dialog
      title="修改用例集"
      :visible.sync="updateSuiteDialogVisible"
      width="30%"
      :before-close="updateSuiteDialogCloseEvent"
    >
      <!--修改用例集表单-->
      <el-form ref="suiteForm" label-width="100px" :model="suiteForm" :rules="suiteRules">
        <el-form-item label="用例集名" prop="name">
          <el-input v-model="suiteForm.name" />
        </el-form-item>
        <el-form-item label="用例集描述" prop="description">
          <el-input v-model="suiteForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateSuiteDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="updateSuiteEvent(suiteId, suiteForm)">确 定</el-button>
      </span>
    </el-dialog>

    <!--删除主机-->
    <el-dialog
      title="删除用例集"
      :visible.sync="deleteSuiteDialogVisible"
      width="30%"
      :before-close="deleteSuiteDialogCloseEvent"
    >
      <span>是否确认删除该用例集？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteSuiteDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="deleteSuiteEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  projectList,
  suiteListRequest,
  addSuiteRequest,
  updateSuiteRequest,
  deleteSuiteRequest
} from '@/api/project.js'
import { sleep } from '@/utils/sleep.js'

export default {
  name: 'SuiteList',
  data() {
    return {
      value: '',
      projectList: [],
      suiteList: [],
      projectId: null,
      suiteId: null,
      loading: false,
      addSuiteDialogVisible: false,
      updateSuiteDialogVisible: false,
      deleteSuiteDialogVisible: false,
      currentPage: 1,
      size: 10,
      total: 0,
      getSuiteFrom: {
        projectName: ''
      },
      suiteForm: {
        name: '',
        suite: '',
        description: ''
      },
      suiteRules: {
        name: [{ required: true, message: '请输入环境名称', trigger: 'blur' }],
        suite: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
        description: []
      }

    }
  },
  methods: {
    getProjectListEvent(value) {
      this.loading = true
      projectList({ name: value }).then(response => {
        this.loading = false
        this.total = response.data.count
        this.projectList = response.data.results
      })
    },
    projectSelectedEvent(val) {
      this.$store.dispatch('project/setProjectId', val)
      this.projectId = val
    },
    getSuiteListEvent() {
      if (this.projectId) {
        suiteListRequest({ project_id: this.projectId }).then(response => {
          this.suiteList = response.data.results
          this.$message.success(response.message)
        })
      } else {
        this.$message.error('查询失败，请选择项目')
      }
    },

    openAddSuiteDialogEvent() {
      if (this.projectId) {
        this.addSuiteDialogVisible = true
      } else {
        this.$message.error('请选择项目')
      }
    },
    openUpdateSuiteDialogEvent(row) {
      this.suiteId = row.id
      const { name, description } = row
      this.suiteForm = { name, description }
      this.updateSuiteDialogVisible = true
    },
    openDeleteSuiteDialogEvent(row) {
      this.suiteId = row.id
      this.deleteSuiteDialogVisible = true
    },
    addSuiteDialogCloseEvent() {
      this.$refs.suiteForm.resetFields()
      this.addSuiteDialogVisible = false
    },
    updateSuiteDialogCloseEvent() {
      this.$refs.suiteForm.resetFields()
      this.updateSuiteDialogVisible = false
    },
    deleteSuiteDialogCloseEvent() {
      this.deleteSuiteDialogVisible = false
    },

    addSuiteEvent() {
      this.$refs.suiteForm.validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.suiteForm))
          data['project_id'] = this.projectId
          addSuiteRequest(data).then(res => {
            if (res.code === 20000) {
              this.getSuiteListEvent()
              this.addSuiteDialogVisible = false
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
    updateSuiteEvent(id, row) {
      updateSuiteRequest(id, row).then(result => {
        this.$message.success(result.message)
        this.updateSuiteDialogVisible = false
        this.getSuiteListEvent()
      }).catch((result) => {
        sleep(500).then(() => {
          this.getSuiteListEvent()
        })
      })
    },
    deleteSuiteEvent() {
      deleteSuiteRequest(this.suiteId).then(response => {
        this.$message.success('删除成功')
        this.deleteSuiteDialogCloseEvent()
        this.getSuiteListEvent()
      }).catch(res => {
        this.deleteSuiteDialogCloseEvent()
      })
    },
    sizeChangeEvent(size) {
      this.size = size
      this.getSuiteListEvent()
    },
    currentChangeEvent(page) {
      this.currentPage = page
      this.getSuiteListEvent()
    }

  }

}
</script>

<style scoped>

</style>
