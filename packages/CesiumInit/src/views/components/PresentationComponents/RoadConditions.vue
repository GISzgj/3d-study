<template>
  <div class="container">
    <!-- 风力 he 空气指数-->
    <div class="box wind">
      <div class="combination first">
        <svg-icon name="wind" fill="#FAAB6B" style="width: 30px; height: 25px"></svg-icon>
        <b class="text">大风</b>
      </div>
      <div class="combination second">
        <svg-icon name="PMCondition" fill="#FAAB6B" style="width: 25px; height: 20px"></svg-icon>
        <b class="text">良好</b>
      </div>
    </div>
    <!--  天气状况； 温度 -->
    <div class="box condition">
      <div class="combination first">
        <svg-icon name="tianqi" fill="#FAAB6B" style="width: 30px; height: 30px"></svg-icon>
        <b class="text">晴天</b>
      </div>
      <div class="combination second">
        <svg-icon name="C" fill="#FAAB6B" style="width: 25px; height: 20px"></svg-icon>
        <b class="text">13°C</b>
      </div>
    </div>
    <!-- 位置地理信息 -->
    <div class="location">
      <svg-icon name="position" fill="#FAAB6B" style="width: 25px; height: 20px"></svg-icon>
      <b class="text">湖北省宜昌市夷陵区</b>
    </div>
  </div>
</template>
<script setup></script>
<style lang="scss" scoped>
  .container {
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    margin: 5px auto;
    .text {
      color: #ccc;
      font-size: 14px;
      text-align: center;
      margin-left: 10px;
    }
    .box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      width: 100%;
      text-align: center;
      line-height: 40px;
      .combination {
        display: flex;
        align-items: center;
      }
      .first {
        flex: 3;
      }
      .second {
        flex: 2;
      }
    }
    .condition {
      margin: 10px 0;
    }
    .location {
      margin-bottom: 10px;
    }
  }
</style>
