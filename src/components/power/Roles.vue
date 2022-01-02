<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="rolesAddDialogVisible = true" type="primary"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <el-table :data="rolelist" border stripe>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            :class="['bdbottom', 'vcenter', i1 == 0 ? 'bdtop' : '']"
            :key="item1.id"
            v-for="(item1, i1) in scope.row.children"
          >
            <el-col :span="5">
              <el-tag @close="removeRightById(scope.row, item1.id)" closable>
                {{ item1.authName }}
              </el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row
                :class="[i2 != 0 ? 'bdtop' : '', 'vcenter']"
                :key="item2.id"
                v-for="(item2, i2) in item1.children"
              >
                <el-col :span="6">
                  <el-tag
                    @close="removeRightById(scope.row, item2.id)"
                    closable
                    type="success"
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    @close="removeRightById(scope.row, item3.id)"
                    closable
                    type="warning"
                    :key="item3.id"
                    v-for="(item3, i3) in item2.children"
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button
            @click="getRole(scope.row.id)"
            size="mini"
            type="primary"
            icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button
            @click="deleteRole(scope.row.id)"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            >删除</el-button
          >
          <el-button
            @click="showSetRightDialog(scope.row)"
            size="mini"
            type="warning"
            icon="el-icon-setting"
            >分配权限</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="添加角色"
      :visible.sync="rolesAddDialogVisible"
      width="50%"
    >
      <el-form
        :model="roleAddForm"
        :rules="roleAddFormrules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleAddForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleAddForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改角色"
      :visible.sync="rolesEditDialogVisible"
      width="50%"
    >
      <el-form
        :model="roleEditForm"
        :rules="roleEditFormrules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleEditForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleEditForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :default-checked-keys="defKeys"
        default-expand-all
        node-key="id"
        show-checkbox
        :data="rightslist"
        :props="treeProps"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色渲染列表
      rolelist: [],
      // 添加角色相关变量
      rolesAddDialogVisible: false,
      roleAddForm: {
        roleName: "",
        roleDesc: "",
      },
      roleAddFormrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 修改角色相关变量
      rolesEditDialogVisible: false,
      roleEditForm: {
        roleName: "",
        roleDesc: "",
      },
      roleEditFormrules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      setRightsDialogVisible: false,
      rightslist: [],
      treeProps: {
        children: "children",
        label: "authName",
      },
      //默认选中的节点ID值
      defKeys:[],
      roleId:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async allotRights(){
      const keys=[...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr=keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status!=200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightsDialogVisible=false
    },
    setRightDialogClosed(){
      this.defKeys=[]
    },
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    async showSetRightDialog(role) {
      this.roleId=role.id
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200)
        return this.$message.error("获取权限数据失败！");
      this.rightslist = res.data;
      console.log(res);
      this.getLeafKeys(role,this.defKeys)
      this.setRightsDialogVisible = true;
    },
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("请求角色列表失败！");
      this.rolelist = res.data;
    },
    async addRole() {
      const { data: res } = await this.$http.post("roles", this.roleAddForm);
      if (res.meta.status != 201) return this.$message.error("添加角色失败！");
      this.$message.success("添加角色成功！");
      this.getRolesList();
      this.rolesAddDialogVisible = false;
    },
    async editRole() {
      const { data: res } = await this.$http.put(
        "roles/" + this.roleEditForm.roleId,
        this.roleEditForm
      );
      if (res.meta.status != 200) return this.$message.error("编辑角色失败");
      this.$message.success("修改角色成功！");
      this.getRolesList();
      this.rolesEditDialogVisible = false;
    },
    async getRole(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status != 200) return this.$message.error("编辑角色失败");
      this.roleEditForm = res.data;
      this.rolesEditDialogVisible = true;
    },
    deleteRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete("roles/" + id);
          if (res.meta.status != 200) return this.$message.error("删除失败");
          this.$message.success("删除成功");
          this.getRolesList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      console.log(res);
      if (res.meta.status != 200) return this.$message.error("删除权限失败!");
      role.children = res.data;
      this.$message.success("删除权限成功!");
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
