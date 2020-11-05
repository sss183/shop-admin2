<template>
     <el-dialog :title="tip" :visible.sync="dialogVisible" width="40%" @open="$emit('getdata')" @close="$emit('reset')">
           <el-form :model="formData" :rules="rules" ref="roleForm" label-width="100px">
            <el-form-item label="角色名称" prop="rolename">
              <el-input v-model="formData.rolename"></el-input>
            </el-form-item>
            <el-form-item label="菜单权限">
                  <el-tree
                       ref="tree" 
                      check-strictly
                      :data="menuData"
                      show-checkbox
                      :default-checked-keys="checklist"
                       node-key="id"
                      :props="{children:'children',label:'title'
                        }">
                  </el-tree>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch v-model="formData.status"></el-switch>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="$emit('submitfn','roleForm')">确 定</el-button>
          </span>
    </el-dialog>
</template>
<script>
export default {
    props:{
        dialogVisible:[Boolean],
        formData:[Object],
        rules:[Object,String],
        checklist:[Array],
        tip:[String],
        menuData:[Array]

    },
    methods:{

    }
}
</script>