<template>
  <div>
    <el-row type="flex" justify="center" :gutter="20">
       <el-col :span="9">
         <div class="col_data">
            <h3>尚品总览</h3>
            <el-row>
                <el-col :span="6">400</el-col>
                <el-col :span="6">100</el-col>
                <el-col :span="6">50</el-col>
                <el-col :span="6">500</el-col>
            </el-row>
            <el-row>
                <el-col :span="6">已上架</el-col>
                <el-col :span="6">已下架</el-col>
                <el-col :span="6">库存紧张</el-col>
                <el-col :span="6">全部库存</el-col>
            </el-row>
         </div>
       </el-col>
       <el-col :span="9">
         <div class="col_data">
            <h3>用户总览</h3>
            <el-row>
                <el-col :span="6">100</el-col>
                <el-col :span="6">200</el-col>
                <el-col :span="6">1000</el-col>
                <el-col :span="6">5000</el-col>
            </el-row>
            <el-row>
                <el-col :span="6">今日新增</el-col>
                <el-col :span="6">昨日新增</el-col>
                <el-col :span="6">本月新增</el-col>
                <el-col :span="6">会员总数</el-col>
            </el-row>
         </div>
       </el-col>
    </el-row>
     <el-row type="flex" justify="center">
      <el-col :span="18">
          <div id="box"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  mounted() {
    echarts.init(document.getElementById('box')).setOption({
      toolbox:{
                feature:{
                    saveAsImage:{}
                }
         },
      legend:{//区分折线的标志
          data:["近一周订单数量"]
      },
      xAxis: {
        data: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期天"],
        boundaryGap:false
      },
      yAxis: {
        type: "value",
        data: [0,200,400,600,800,1000],
      },
      series: [
        { 
          name:"近一周订单数量",
          data: [480, 600, 430, 240, 400, 700, 800,1000],
          type: "line",
        },
      ],

    })
  },
};
</script>
<style lang="less">
.col_data{
  height: 130px;
  border: 1px solid #000;
    h3{
       background-color: #f2f6fc;
       height: 40px;
       line-height: 40px;
       padding-left: 6px;
       margin-bottom: 20px;
    }
    .el-row:nth-of-type(1) .el-col{
          color: red;
    }
    .el-row:nth-of-type(2){
       margin-top: 10px;
    }
    .el-col{
      text-align: center;
    }
}
#box {
  width: 600px;
  height: 300px;
  border: none;
  margin-top: 30px;
}
</style>