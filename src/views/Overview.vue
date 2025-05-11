<template>
  <div class="overview">
    <h1>2024年教学楼能耗监测总览</h1>

    <div class="chart-container">
      <div class="chart-section">
        <h2>四栋教学楼能耗对比</h2>
        <EnergyBarChart :data="buildings" />
      </div>

      <div class="chart-section">
        <h2>用电量占比</h2>
        <EnergyPieChart :data="buildings" type="electricity" />
      </div>
    </div>

    <div class="building-list">
      <h2>教学楼列表</h2>
      <table>
        <thead>
          <tr>
            <th>教学楼名称</th>
            <th>类型</th>
            <th>当前用电量(kWh)</th>
            <th>当前用水量(吨)</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="building in buildings" :key="building.id">
            <td>{{ building.name }}</td>
            <td>{{ building.type }}</td>
            <td
              :class="{
                exceeded:
                  building.electricity.current >
                  energySettings.thresholds.electricity,
              }"
            >
              {{ building.electricity.current }}
              <span
                v-if="
                  building.electricity.current >
                  energySettings.thresholds.electricity
                "
                class="warning-icon"
                >⚠️</span
              >
            </td>
            <td
              :class="{
                exceeded:
                  building.water.current > energySettings.thresholds.water,
              }"
            >
              {{ building.water.current }}
              <span
                v-if="building.water.current > energySettings.thresholds.water"
                class="warning-icon"
                >⚠️</span
              >
            </td>
            <td>
              <router-link :to="`/detail/${building.id}`" class="detail-link">
                查看详情
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import api from "../services/api";
import EnergyBarChart from "../components/EnergyBarChart.vue";
import EnergyPieChart from "../components/EnergyPieChart.vue";

export default {
  name: "Overview",
  components: {
    EnergyBarChart,
    EnergyPieChart,
  },
  setup() {
    const buildings = ref([]);
    const energySettings = ref({});
    const loading = ref(true);

    const fetchData = async () => {
      try {
        loading.value = true;
        buildings.value = await api.getBuildings();
        energySettings.value = await api.getEnergySettings();
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      buildings,
      energySettings,
      loading,
    };
  },
};
</script>

<style scoped>
/* 添加超标警告样式 */
.exceeded {
  color: #f56c6c;
  font-weight: bold;
}

.warning-icon {
  margin-left: 5px;
}
/* 其余样式保持不变 */
.overview {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.chart-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.building-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
/*  */
th {
  background-color: #f8f9fa;
  font-weight: 600;
}

tr:hover {
  background-color: #f5f5f5;
}

.detail-link {
  color: #409eff;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.detail-link:hover {
  background-color: #ecf5ff;
}

@media (max-width: 768px) {
  .chart-container {
    grid-template-columns: 1fr;
  }
}
</style>
