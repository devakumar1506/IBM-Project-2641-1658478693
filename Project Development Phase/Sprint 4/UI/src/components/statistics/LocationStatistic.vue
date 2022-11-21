<template>
  <v-card class="card">
    <v-card-text class="pa-2">
      <pie-chart :data="data" legend="right" :donut="true"></pie-chart>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      data: {'Monday': 90, 'Tuesday': 70, 'Wednesday': 40, 'Thursday': 30, 'Friday': 35, 'Saturday': 22}
    }
  }
}
</script>

<style>
  .card {
    border-radius: 3px;
    background-clip: border-box;
    border: 1px solid rgba(0, 0, 0, 0.125);
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.21);
    background-color: transparent;
  }
</style>
