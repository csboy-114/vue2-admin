<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            clearable
            @clear="getUsersList"
            v-model="queryInfo.query"
            placeholder="请输入内容"
          >
            <el-button
              @click="getUsersList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible = true" type="primary"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table border stripe :data="userList">
        <el-table-column type="index">
          <template slot="header">
            <span>#</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="userStateChanged(scope.row)"
              v-model="scope.row.mg_state"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item type="password" label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
          class="demo-ruleForm"
          @close="editDialogClosed"
        >
          <el-form-item label="用户名" prop="username">
            <el-input disabled v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUsersList();
  },
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail =
        /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号码"));
    };
    return {
      userId: "",
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      editForm: {},
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3-10个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在6-15个字符之间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    "queryInfo.query"(val) {
      if (val == "") {
        this.getUsersList();
      }
    },
  },
  methods: {
    async removeUserById(id){
     const confirmResult= await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       }).catch(err=>err)
      if(confirmResult!='confirm'){
        return this.$message.info('已取消删除')
      }
      const {data:res} = await this.$http.delete('users/'+id)
      if(res.meta.status!=200) return this.$message.error('删除失败！')
      this.$message.success('删除成功！')
      this.getUsersList()
    },
    editUserInfo() {
      this.$refs["editFormRef"].validate(async (vaild) => {
        if (vaild) {
          let { data: res } = await this.$http.put(
            "users/" + this.editForm.id,
            this.editForm
          );
          console.log(res);
          if (res.meta.status == 200) {
            this.editDialogVisible = false;
            this.$message.success("更新用户信息成功！");
            this.getUsersList();
           
          } else {
            this.$message.error("更新用户信息失败");
          }
        } else {
          return this.$message.error("数据格式错误,无法修改！");
        }
      });
    },
    async showEditDialog(id) {
      let { data: res } = await this.$http.get(`users/${id}`);
      console.log(res);
      if (res.meta.status == 200) {
        this.editForm = res.data;
      } else {
        this.$message.error("查询用户信息失败");
      }
      this.editDialogVisible = true;
    },
    addUser() {
      this.$refs["addFormRef"].validate(async (vaild) => {
        if (!vaild) return this.$message.error("请完善数据格式！");
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status == 201) {
          this.$message.success("添加用户成功");
          this.addDialogVisible = false;
          this.getUsersList();
        } else {
          this.$message.error("添加用户失败!");
        }
      });
    },
    addDialogClosed() {
      this.$refs["addFormRef"].resetFields();
    },
    editDialogClosed() {
      this.$refs["editFormRef"].resetFields();
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status == 200) {
        this.$message.success(res.meta.msg);
      } else {
        this.userInfo.mg_state = !this.userInfo.mg_state;
        this.$message.error("更新用户状态失败!");
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUsersList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUsersList();
    },
    async getUsersList() {
      const { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      if (res.meta.status == 200) {
        this.userList = res.data.users;
        this.total = res.data.total;
      } else {
        this.$message.error("获取用户列表失败");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>
