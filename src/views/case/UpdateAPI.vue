<template>
  <div class="mainContent">
    <el-row>
      <el-col :span="12">
        <el-button
          icon="el-icon-d-arrow-left"
          class="radiuButton"
          @click="$router.push({name:'testCaseAPI',params:{case_id:apiForm.case_id}})"
        >返回用例列表
        </el-button>
      </el-col>
      <el-col :offset="8" :span="4">
        <el-button type="primary" class="radiuButton" @click="addAPIDialogVisible=true">提交</el-button>
        <el-button class="radiuButton" @click="addAPIDialogCloseEvent">取消</el-button>
      </el-col>
    </el-row>

    <!--请求行-->
    <el-card shadow="always">
      <el-form ref="apiForm" :model="apiForm" :rules="apiFormRules" label-width="80px">
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="apiForm.name" />
        </el-form-item>
        <el-form-item label="url" prop="url">
          <el-row type="flex" justify="space-between">
            <el-col :span="3">
              <el-select v-model="apiForm.method" placeholder="请选择">
                <el-option
                  v-for="item in methodOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="2">
              <el-select v-model="apiForm.http" placeholder="请选择">
                <el-option
                  v-for="item in httpOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-input v-model="apiForm.url" />
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-card>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="请求头部" name="1">
        <el-form :rules="apiFormRules">
          <el-form-item label="">
            <el-table
              :data="apiForm.headers"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="关键字"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" placeholder="请输入关键字" />
                </template>
              </el-table-column>
              <el-table-column
                prop="value"
                label="参数"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value" placeholder="请输入参数" />
                </template>
              </el-table-column>
              <el-table-column
                prop="value"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" @click="removeFormEvent(apiForm.headers,scope.row)" />
                  <el-button icon="el-icon-plus" @click="addFormEvent(apiForm.headers,scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

        </el-form>
      </el-collapse-item>
      <el-collapse-item title="请求参数" name="2">
        <el-form :model="apiForm">
          <el-form-item label="">
            <el-tabs type="border-card">
              <el-tab-pane>
                <span slot="label"><el-radio
                  v-model="apiForm.dataType"
                  label="formdata"
                >表单数据(form-data)</el-radio></span>
                <el-table
                  :data="apiForm.params"
                  style="width: 100%"
                >
                  <el-table-column
                    prop="name"
                    label="关键字"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.name" placeholder="请输入关键字" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="value"
                    label="参数"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.value" placeholder="请输入参数" />
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="value"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        @click="removeFormEvent(apiForm.params,scope.row)"
                      />
                      <el-button icon="el-icon-plus" @click="addFormEvent(apiForm.params,scope.row)" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane>
                <span slot="label"><el-radio v-model="apiForm.dataType" label="raw">源数据(raw)</el-radio></span>
                <el-input
                  v-model="apiForm.body"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 10}"
                  placeholder="请输入内容"
                />
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="响应断言" name="3">
        <el-form :model="apiForm">
          <el-form-item label="">
            <el-table
              :data="apiForm.APIAssert"
              style="width: 100%"
            >
              <el-table-column
                prop="name"
                label="断言方式"
              >
                <template slot-scope="scope">
                  <el-select v-model="scope.row.type" placeholder="请选择">
                    <el-option
                      v-for="item in assertOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                prop="pattern"
                label="匹配模式"
              >
                <template slot-scope="scope">
                  <el-input v-if="scope.row.type === 'json'" v-model="scope.row.pattern" placeholder="请输入jsonpath" />
                  <el-input v-else-if="scope.row.type === 'reg'" v-model="scope.row.pattern" placeholder="请输入正则表达式" />
                </template>
              </el-table-column>
              <el-table-column
                prop="value"
                label="预期结果"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.expect" placeholder="请输入预期结果" />
                </template>
              </el-table-column>
              <el-table-column
                prop="value"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" @click="removeFormEvent(apiForm.APIAssert,scope.row)" />
                  <el-button icon="el-icon-plus" @click="addFormEvent(apiForm.APIAssert,scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

        </el-form>
      </el-collapse-item>
      <el-collapse-item title="提取响应数据" name="4">
        <el-form :model="apiForm">
          <el-form-item label="">
            <el-table
              :data="apiForm.APIRelate"
              style="width: 100%"
            >
              <el-table-column
                label="关联方式"
              >
                <template slot-scope="scope">
                  <el-select v-model="scope.row.type" placeholder="请选择">
                    <el-option
                      v-for="item in relateOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column
                label="变量名"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" placeholder="请输入变量名" />
                </template>
              </el-table-column>
              <el-table-column
                label="匹配模式"
              >
                <template slot-scope="scope">
                  <el-input v-if="scope.row.type === 'json'" v-model="scope.row.pattern" placeholder="请输入jsonpath" />
                  <el-input v-else-if="scope.row.type === 'reg'" v-model="scope.row.pattern" placeholder="请输入正则表达式" />
                </template>

              </el-table-column>
              <el-table-column
                prop="value"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="danger" icon="el-icon-delete" @click="removeFormEvent(apiForm.APIRelate,scope.row)" />
                  <el-button icon="el-icon-plus" @click="addFormEvent(apiForm.APIRelate,scope.row)" />
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>

        </el-form>
      </el-collapse-item>
    </el-collapse>

    <el-dialog
      title="提示"
      :visible.sync="addAPIDialogVisible"
      width="30%"
      :before-close="addAPIDialogCloseEvent"
    >
      <span>是否确认提交</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAPIDialogCloseEvent">取 消</el-button>
        <el-button type="primary" @click="addAPIEvent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { addAPIRequest, getAPIDetailRequest } from '@/api/project'
import { json_to_obj } from '@/utils/dataFormat.js'

export default {
  name: 'UpdateAPI',
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      addAPIDialogVisible: false,
      methodOptions: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' }
      ],
      httpOptions: [
        { label: 'HTTP', value: 'HTTP' },
        { label: 'HTTPS', value: 'HTTPS' }
      ],
      assertOptions: [
        { label: '响应正文断言', value: 'contains' },
        { label: 'json断言', value: 'json' },
        { label: '正则表达式断言', value: 'reg' },
        { label: '响应状态码断言', value: 'status_code' }
      ],
      relateOptions: [
        { label: 'json提取', value: 'json' },
        { label: '正则表达式提取', value: 'reg' }
      ],
      apiForm: {
        http: 'HTTP',
        name: '',
        method: 'GET',
        url: '',
        dataType: 'formdata',
        headers: [{ 'name': 'Content-Type', 'value': 'application/json' }],
        params: [{ 'name': '', 'value': '' }],
        body: '',
        APIAssert: [{ 'type': '', 'pattern': '', 'expect': '' }],
        APIRelate: [{ 'name': '', 'pattern': '', 'type': '' }]
      },
      apiFormRules: {
        name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入接口地址', trigger: 'blur' }]
      }

    }
  },
  created() {
    if (this.$route.params.api_id) {
      this.getAPIDetailEvent(this.$route.params.api_id)
    }
  },
  methods: {
    getAPIDetailEvent(id) {
      getAPIDetailRequest(id).then((response) => {
        this.apiForm = response.data
        if (this.apiForm.headers) {
          this.apiForm.headers = json_to_obj(this.apiForm.headers)
        } else {
          this.apiForm.headers = [{ 'name': '', 'value': '' }]
        }
        if (this.apiForm.params) {
          this.apiForm.params = json_to_obj(this.apiForm.params)
        } else {
          this.apiForm.params = [{ 'name': '', 'value': '' }]
        }
      })
    },
    removeFormEvent(form, row) {
      var index = form.indexOf(row)
      if (index !== -1 && form.length !== 1) {
        form.splice(index, 1)
      }
    },
    addFormEvent(form, row) {
      var index = form.indexOf(row)
      if (index !== -1) {
        form.splice(index + 1, 0, { name: '', value: '' })
      }
    },
    removeResponseFormEvent(form, row) {
      var index = form.indexOf(row)
      if (index !== -1 && form.length !== 1) {
        form.splice(index, 1)
      }
    },
    addResponseFormEvent(form, row) {
      var index = form.indexOf(row)
      if (index !== -1) {
        form.splice(index + 1, 0, { type: '', pattern: '', expect: '' })
      }
    },
    addAPIDialogCloseEvent() {
      this.$refs.apiForm.resetFields()
      this.addAPIDialogVisible = false
    },
    addAPIEvent() {
      this.addAPIDialogVisible = false
      addAPIRequest(this.apiForm).then(response => {
        this.$message.success(response.message)
        this.$router.push({ name: 'testCaseAPI', params: { case_id: this.apiForm.case_id }})
      })
    }
  }
}
</script>

<style scoped>
  .mainContent {
    width: 90%;
    margin: 20px auto;
  }

  .el-card {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .radiuButton {
    border-radius: 30px
  }
</style>
