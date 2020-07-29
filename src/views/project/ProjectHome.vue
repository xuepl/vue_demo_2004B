<template>
  <div class="main">
    <h2> 项目概况 </h2>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="fontContent">{{ projects.type }}</div>
          <div class="fontTitle">项目类型</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="fontContent">{{ projects.version }}</div>
          <div class="fontTitle">版本</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="fontContent">{{ projects.LastUpdateTime | dateOnly }}</div>
          <div class="fontTitle">最近更新时间</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="fontContent">{{ projects.apiCount }}</div>
          <div class="fontTitle">接口数量</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="fontContent">{{ projects.apiCount }}</div>
          <div class="fontTitle">通用状态码</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="fontContent">{{ projects.apiCount }}</div>
          <div class="fontTitle">项目三天内动态</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="fontContent">{{ projects.memberCount }}</div>
          <div class="fontTitle">项目组成员</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="fontContent">鼠标悬浮时显示</div>
          <div class="fontTitle">自由测试接口并生成测试报告</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="fontContent">{{ projects.createTime | dateOnly }}</div>
          <div class="fontTitle">创建时间</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { projectInfo } from '@/api/project.js'

export default {
  name: 'ProjectHome',
  data() {
    return {
      projects: {
        'id': 4151,
        'name': 'test',
        'version': 'test01',
        'type': 'Web',
        'status': true,
        'LastUpdateTime': '2020-07-16 17:34:17',
        'createTime': '2020-07-16 17:34:17',
        'apiCount': 0,
        'dynamicCount': 2,
        'memberCount': 1,
        'description': '',
        'user': ''
      }
    }
  }
  // cteated() {
  //   this.getProjectInfo()
  // },
  // methods: {
  //   getProjectInfo() {
  //     projectInfo({ project_id: 4151 }).then(result => {
  //       this.projects = result.data.data
  //     })
  //   }
  // }
}
</script>

<style scoped>
  .main {
    margin-left: 30px;
  }

  .fontTitle {
    margin-top: 20px;
  }

  .fontContent {
    margin-top: 30px;
    font-size: 2em;
    font-weight: bold;
  }

  .el-row {
    margin-top: 20px;
  }

</style>
