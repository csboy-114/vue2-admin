<template>
  <div>
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 卡片头部添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button @click="showAddCateDialog" type="primary"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 树形表格 -->
      <tree-table
        class="treeTable"
        :show-row-hover="false"
        border
        index-text="#"
        show-index
        :expand-type="false"
        :selection-type="false"
        :data="catelist"
        :columns="columns"
      >
        <template slot-scope="scope" slot="isok">
          <i
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
          ></i>
          <i style="color: red" v-else class="el-icon-error"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level == 1"
            size="mini"
            type="success"
            >二级</el-tag
          >
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button @click="editFormFunc(scope.row)" size="mini" type="primary" icon="el-icon-edit"
            >编辑</el-button
          >
          <el-button @click="deleteData(scope.row)" size="mini" type="danger" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addFormCate"
        :rules="addFormCateRules"
        ref="addFormCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addFormCate.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            expand-trigger="hover"
            :options="parentCataList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
      
    >
      <!-- 编辑分类的表单 -->
      <el-form
        :model="editForm"
        ref="editFormCateRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate"
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
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      catelist: [],
      // 为Table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addCateDialogVisible: false,
      addFormCate: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addFormCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCataList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedKeys: [],
      editCateDialogVisible:false,
      editForm:{}
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async deleteData(item){
     const {data:res}=  await this.$http.delete('categories/'+item.cat_id)
     if(res.meta.status!=200) this.$message.error('删除分类失败')
     this.$message.success('删除分类成功!')
     this.getCateList()
    },
    async editCate(){
   const {data:res} =  await this.$http.put('categories/'+this.editForm.cat_id,this.editForm)
   console.log(res);
      if(res.meta.status!=200) return this.$message.error('更新失败！')
      this.$message.success('更新成功！')
      this.getCateList()
      this.editCateDialogVisible=false
    },
    editFormFunc(item){
      this.editForm=item
      console.log(this.editForm);
      this.editCateDialogVisible=true
    },
    addCateDialogClosed(){
      this.$refs.addFormCateRef.resetFields()
      this.selectedKeys=[]
      this.addFormCate.cat_level=0
      this.addFormCate.cat_pid=0
    },
    addCate(){
      this.$refs.addFormCateRef.validate(async vaild=>{
        if(!vaild) return;
        const {data:res}=await this.$http.post('categories',this.addFormCate)
        if(res.meta.status!=201) this.$message.error('添加分类失败！')
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible=false
      })
    },
    parentCateChanged() {
      console.log(this.selectedKeys);
      if(this.selectedKeys.length>0){
        this.addFormCate.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
        this.addFormCate.cat_level=this.selectedKeys.length
        return;
      }else{
        this.addFormCate.cat_pid=0
        this.addFormCate.cat_level=0
      }
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status != 200)
        return this.$message.error("获取父级分类数据失败！");
      this.parentCataList = res.data;
      console.log(res.data);
    },
    showAddCateDialog() {
      //先获取父级分类的数据列表
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200)
        return this.$message.error("获取商品分类数据失败！");
      this.catelist = res.data.result;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
  },
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
