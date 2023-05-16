<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="需求标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入需求标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="需求类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择需求类型" clearable>
          <el-option
            v-for="dict in dict.type.odd_job_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="需求详情" prop="info">
        <el-input
          v-model="queryParams.info"
          placeholder="请输入需求详情"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布用户" prop="uid">
        <el-input
          v-model="queryParams.uid"
          placeholder="请输入发布用户"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系方式"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="需求状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入需求状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="需求地点" prop="adress">
        <el-input
          v-model="queryParams.adress"
          placeholder="请输入需求地点"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="需求所属的大行业" prop="professionPid">
        <el-input
          v-model="queryParams.professionPid"
          placeholder="请输入需求所属的大行业"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="需求所属的行业细分" prop="profession">
        <el-input
          v-model="queryParams.profession"
          placeholder="请输入需求所属的行业细分"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['odd-job:job:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['odd-job:job:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['odd-job:job:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['odd-job:job:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="需求标题" align="center" prop="title" />
      <el-table-column label="需求类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.odd_job_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="需求详情" align="center" prop="info" />
      <el-table-column label="发布用户" align="center" prop="uid" />
      <el-table-column label="联系方式" align="center" prop="phone" />
      <el-table-column label="需求状态" align="center" prop="state">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.odd_job_state" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <el-table-column label="需求地点" align="center" prop="adress" />
      <el-table-column label="需求所属的大行业" align="center" prop="professionPid" />
      <el-table-column label="需求所属的行业细分" align="center" prop="profession" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['odd-job:job:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['odd-job:job:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改零工需求管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="需求标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入需求标题" />
        </el-form-item>
        <el-form-item label="需求类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择需求类型">
            <el-option
              v-for="dict in dict.type.odd_job_type"
              :key="dict.value"
              :label="dict.label"
:value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求详情" prop="info">
          <el-input v-model="form.info" placeholder="请输入需求详情" />
        </el-form-item>
        <el-form-item label="发布用户" prop="uid">
          <el-input v-model="form.uid" placeholder="请输入发布用户" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="需求状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入需求状态" />
        </el-form-item>
        <el-form-item label="需求地点" prop="adress">
          <el-input v-model="form.adress" placeholder="请输入需求地点" />
        </el-form-item>
        <el-form-item label="需求所属的大行业" prop="professionPid">
          <el-input v-model="form.professionPid" placeholder="请输入需求所属的大行业" />
        </el-form-item>
        <el-form-item label="需求所属的行业细分" prop="profession">
          <el-input v-model="form.profession" placeholder="请输入需求所属的行业细分" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listJob, getJob, delJob, addJob, updateJob } from "@/api/odd-job/job";

export default {
  name: "Job",
  dicts: ['odd_job_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 零工需求管理表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        type: null,
        info: null,
        uid: null,
        phone: null,
        state: null,
        adress: null,
        professionPid: null,
        profession: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询零工需求管理列表 */
    getList() {
      this.loading = true;
      listJob(this.queryParams).then(response => {
        this.jobList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        type: null,
        info: null,
        uid: null,
        phone: null,
        state: null,
        adress: null,
        professionPid: null,
        profession: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加零工需求管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getJob(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改零工需求管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateJob(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addJob(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除零工需求管理编号为"' + ids + '"的数据项？').then(function() {
        return delJob(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('odd-job/job/export', {
        ...this.queryParams
      }, `job_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
