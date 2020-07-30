<template>
  <div class="mainMenu">
    <div class="formMenu">
      <el-form :inline="true" class="demo-form-inline">
        <!--输入框-->
        <el-form-item>
          <el-input v-model="projectName" placeholder="项目名称" />
        </el-form-item>
        <!--查询按钮-->
        <el-form-item>
          <el-button type="primary" @click="getProjectList({ name : projectName})">查询</el-button>
        </el-form-item>
        <!--新增按钮-->
        <el-form-item>
          <el-button type="primary" @click="addProjectDialogVisible = true ">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--数据展示table-->
    <el-table ref="multipleTable" :data="projects" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55" sortable />
      <el-table-column label="项目名称" prop="name" show-overflow-tooltip sortable />
      <el-table-column prop="version" label="项目版本" show-overflow-tooltip sortable />
      <el-table-column prop="type" label="类型" show-overflow-tooltip sortable />
      <el-table-column prop="LastUpdateTime" label="最后修改时间" show-overflow-tooltip sortable />
      <el-table-column prop="status" label="状态" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateProjectEvent(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          <el-button @click="openUpdateProjectDialogEvent(scope.row)">修改</el-button>
          <el-button type="danger" @click="openDeleteProjectDialogEvent(scope.row)">删除</el-button>
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
    <!--新增项目弹框-->
    <el-dialog
      title="创建项目"
      :visible.sync="addProjectDialogVisible"
      width="30%"
      :before-close="addProjectDialogCloseEvent"
    >
      <!--创建项目表单-->
      <el-form ref="addProjectForm" label-width="80px" :model="addProjectForm" :rules="addProjectRules">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="addProjectForm.name" />
        </el-form-item>
        <el-form-item label="项目版本" prop="version">
          <el-input v-model="addProjectForm.version" />
        </el-form-item>
        <el-form-item label="项目类型" prop="type">
          <el-select v-model="addProjectForm.type" placeholder="请选择项目类型">
            <el-option label="Web" value="Web" />
            <el-option label="App" value="App" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input v-model="addProjectForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addProjectDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="addProjectEvent">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改项目弹框-->
    <el-dialog
      title="修改项目"
      :visible.sync="updateProjectDialogVisible"
      width="30%"
      :before-close="updateProjectDialogCloseEvent"
    >
      <!--更新项目表单-->
      <el-form ref="addProjectForm" label-width="80px" :model="addProjectForm" :rules="addProjectRules">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="addProjectForm.name" />
        </el-form-item>
        <el-form-item label="项目版本" prop="version">
          <el-input v-model="addProjectForm.version" />
        </el-form-item>
        <el-form-item label="项目类型" prop="type">
          <el-select v-model="addProjectForm.type" placeholder="请选择项目类型">
            <el-option label="Web" value="Web" />
            <el-option label="App" value="App" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目描述" prop="description">
          <el-input v-model="addProjectForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateProjectDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="updateProjectFormEvent">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除项目-->
    <el-dialog
      title="删除项目"
      :visible.sync="deleteDialogVisible"
      width="30%"
      :before-close="closeDeleteProjectDialog"
    >
      <span>是否确认删除该项目？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDeleteProjectDialog">取 消</el-button>
        <el-button type="primary" @click="deleteProjectEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { projectList, addProjectRequest, updateProject, deleteProject } from '@/api/project.js'
import { sleep } from '@/utils/sleep.js'

export default {
  name: 'ProjectList',
  data() {
    var validateName = (rule, value, callback) => {
      if (/^[a-zA-Z\d_\u4e00-\u9fa5]{2,18}$/.test(value)) {
        callback()
      } else {
        callback(new Error('项目名称长度2-18包含汉字数字字母下划线'))
      }
    }
    return {
      projects: [],
      projectName: '',
      projectId: '',
      currentPage: 1,
      size: 10,
      total: 0,
      addProjectDialogVisible: false,
      updateProjectDialogVisible: false,
      deleteDialogVisible: false,
      formLabelWidth: '120px',
      addProjectForm: {
        name: '',
        version: '',
        type: '',
        description: ''
      },
      addProjectRules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        version: [
          { required: true, message: '请输入项目版本', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择项目类型', trigger: 'blur' }
        ],
        description: []

      }

    }
  },
  created() {
    this.getProjectList()
  },
  methods: {
    getProjectList(params = {}) {
      params.size = this.size
      params.page = this.currentPage
      projectList(params).then(response => {
        this.projects = response.data.results
        this.total = response.data.count
      })
    },
    addProjectEvent() {
      this.$refs.addProjectForm.validate(valid => {
        if (valid) {
          addProjectRequest(this.addProjectForm).then(res => {
            if (res.code === 20000) {
              this.getProjectList()
              this.addProjectDialogVisible = false
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
    addProjectDialogCloseEvent() {
      this.$refs.addProjectForm.resetFields()
      this.addProjectDialogVisible = false
    },
    updateProjectDialogCloseEvent() {
      this.$refs.addProjectForm.resetFields()
      this.updateProjectDialogVisible = false
    },
    updateProjectEvent(row) {
      const data = {
        name: row.name,
        version: row.version,
        type: row.type,
        status: row.status,
        description: row.description
      }

      updateProject(row.id, data).then(result => {
        this.$message.success(result.message)
        this.getProjectList()
      }).catch((result) => {
        sleep(500).then(() => {
          this.getProjectList()
        })
      })
    },
    updateProjectFormEvent() {
      this.$refs.addProjectForm.validate(valid => {
        if (valid) {
          updateProject(this.projectId, this.addProjectForm).then(res => {
            if (res.code === 20000) {
              this.getProjectList()
              this.$message.success(res.message)
              this.updateProjectDialogVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.$message.error('数据验证失败')
        }
      })
    },
    openUpdateProjectDialogEvent(row) {
      this.projectId = row.id
      this.addProjectForm.name = row.name
      this.addProjectForm.type = row.type
      this.addProjectForm.version = row.version
      this.addProjectForm.description = row.description
      this.updateProjectDialogVisible = true
    },
    openDeleteProjectDialogEvent(row) {
      this.projectId = row.id
      this.deleteDialogVisible = true
    },

    closeDeleteProjectDialog() {
      this.deleteDialogVisible = false
    },
    deleteProjectEvent() {
      deleteProject(this.projectId).then(response => {
        this.$message.success('删除成功')
        this.closeDeleteProjectDialog()
        this.getProjectList()
      }).catch(res => {
        this.closeDeleteProjectDialog()
      })
    },
    sizeChangeEvent(size) {
      this.size = size
      this.getProjectList()
    },
    currentChangeEvent(page) {
      this.currentPage = page
      this.getProjectList()
    }
  }
}
</script>

<style scoped>
  .formMenu {
    margin-top: 50px;
    background-color: #F2F2F2;
    padding-left: 10px;
    padding-top: 20px;
  }

  .mainMenu {
    margin-left: 30px;
    padding-right: 20px;
  }

  .el-form {
    line-height: 32px;
  }

  .el-dropdown-item {
    width: 100px;
  }
</style>
