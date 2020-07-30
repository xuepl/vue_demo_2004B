<template>
  <div>

    <el-card>
      <el-form :inline="true" :model="getHostFrom">
        <el-form-item label="">
          <el-select
            v-model="getHostFrom.projectName"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
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
          <el-button type="primary" @click="getHostListEvent">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openAddHostDialogEvent">新增</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="hostsList" style="width: 100%">
        <el-table-column prop="name" label="主机名字" />
        <el-table-column prop="host" label="主机ip" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateHostEvent(scope.row.id, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column show-overflow-tooltip label="操作">
          <template slot-scope="scope">
            <el-button @click="openUpdateHostDialogEvent(scope.row)">修改</el-button>
            <el-button type="danger" @click="openDeleteHostDialogEvent(scope.row)">删除</el-button>
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

    <!--新增主机对话框-->
    <el-dialog
      title="新增主机"
      :visible.sync="addHostDialogVisible"
      width="30%"
      :before-close="addHostDialogCloseEvent"
    >
      <!--创建主机表单-->
      <el-form ref="hostForm" label-width="80px" :model="hostForm" :rules="hostRules">
        <el-form-item label="环境名称" prop="name">
          <el-input v-model="hostForm.name" />
        </el-form-item>
        <el-form-item label="主机地址" prop="host">
          <el-input v-model="hostForm.host" />
        </el-form-item>
        <el-form-item label="主机描述" prop="description">
          <el-input v-model="hostForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addHostDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="addHostEvent">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改主机对话框-->
    <el-dialog
      title="新增主机"
      :visible.sync="updateHostDialogVisible"
      width="30%"
      :before-close="updateHostDialogCloseEvent"
    >
      <!--创建主机表单-->
      <el-form ref="hostForm" label-width="80px" :model="hostForm" :rules="hostRules">
        <el-form-item label="环境名称" prop="name">
          <el-input v-model="hostForm.name" />
        </el-form-item>
        <el-form-item label="主机地址" prop="host">
          <el-input v-model="hostForm.host" />
        </el-form-item>
        <el-form-item label="主机描述" prop="description">
          <el-input v-model="hostForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateHostDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="updateHostEvent(apiId, hostForm)">确 定</el-button>
      </span>
    </el-dialog>

    <!--删除主机-->
    <el-dialog
      title="删除主机"
      :visible.sync="deleteHostDialogVisible"
      width="30%"
      :before-close="deleteHostDialogCloseEvent"
    >
      <span>是否确认删除该主机配置？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteHostDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="deleteHostEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { projectList, hostListRequest, addHostRequest, updateHostRequest, deleteHostRequest } from '@/api/project.js'
import { sleep } from '@/utils/sleep.js'

export default {
  name: 'HostList',
  data() {
    return {
      value: '',
      projectList: [],
      hostsList: [],
      projectId: null,
      apiId: null,
      loading: false,
      addHostDialogVisible: false,
      updateHostDialogVisible: false,
      deleteHostDialogVisible: false,
      currentPage: 1,
      size: 10,
      total: 0,
      getHostFrom: {
        projectName: ''
      },
      hostForm: {
        name: '',
        host: '',
        description: ''
      },
      hostRules: {
        name: [{ required: true, message: '请输入环境名称', trigger: 'blur' }],
        host: [{ required: true, message: '请输入主机名称', trigger: 'blur' }],
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
      this.projectId = val
    },
    getHostListEvent() {
      if (this.projectId) {
        hostListRequest({ project_id: this.projectId }).then(response => {
          this.hostsList = response.data.results
          this.$message.success(response.message)
        })
      }
    },

    openAddHostDialogEvent() {
      if (this.projectId) {
        this.addHostDialogVisible = true
      } else {
        this.$message.error('请选择项目')
      }
    },
    openUpdateHostDialogEvent(row) {
      this.apiId = row.id
      const { name, host, description } = row
      this.hostForm = { name, host, description }
      this.updateHostDialogVisible = true
    },
    openDeleteHostDialogEvent(row) {
      this.apiId = row.id
      this.deleteHostDialogVisible = true
    },
    addHostDialogCloseEvent() {
      this.$refs.hostForm.resetFields()
      this.addHostDialogVisible = false
    },
    updateHostDialogCloseEvent() {
      this.$refs.hostForm.resetFields()
      this.updateHostDialogVisible = false
    },
    deleteHostDialogCloseEvent() {
      this.deleteHostDialogVisible = false
    },

    addHostEvent() {
      this.$refs.hostForm.validate(valid => {
        if (valid) {
          var data = JSON.parse(JSON.stringify(this.hostForm))
          data['project_id'] = this.projectId
          addHostRequest(data).then(res => {
            if (res.code === 20000) {
              this.getHostListEvent()
              this.addHostDialogVisible = false
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
    updateHostEvent(id, row) {
      updateHostRequest(id, row).then(result => {
        this.$message.success(result.message)
        this.updateHostDialogVisible = false
        this.getHostListEvent()
      }).catch((result) => {
        sleep(500).then(() => {
          this.getHostListEvent()
        })
      })
    },
    deleteHostEvent() {
      deleteHostRequest(this.apiId).then(response => {
        this.$message.success('删除成功')
        this.deleteHostDialogCloseEvent()
        this.getHostListEvent()
      }).catch(res => {
        this.deleteHostDialogCloseEvent()
      })
    },
    sizeChangeEvent(size) {
      this.size = size
      this.getHostListEvent()
    },
    currentChangeEvent(page) {
      this.currentPage = page
      this.getHostListEvent()
    }

  }

}
</script>

<style scoped>

</style>
