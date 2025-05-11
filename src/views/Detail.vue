<template>
  <div class="detail">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <template v-else>
      <div class="header">
        <h1>{{ building.name }}能耗详情</h1>
        <router-link to="/" class="back-link">返回总览</router-link>
      </div>

      <div class="info-card">
        <div class="info-item">
          <span class="label">建筑类型:</span>
          <span class="value">{{ building.type }}</span>
        </div>
        <div class="info-item">
          <span class="label">建筑面积:</span>
          <span class="value">{{ building.area }} 平方米</span>
        </div>
      </div>

      <div class="chart-container">
        <div class="chart-section">
          <h2>用电趋势</h2>
          <EnergyLineChart
            :trend-data="building.electricity.trend"
            type="electricity"
          />
        </div>

        <div class="chart-section">
          <h2>用水趋势</h2>
          <EnergyLineChart :trend-data="building.water.trend" type="water" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";
import EnergyLineChart from "../components/EnergyLineChart.vue";

export default {
  name: "Detail",
  components: {
    EnergyLineChart,
  },
  props: {
    id: {
      type: String,
    },
  },
  setup(props) {
    const route = useRoute();
    const building = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const fetchData = async (id) => {
      try {
        loading.value = true;
        building.value = await api.getBuilding(id);
      } catch (err) {
        error.value = err.message || "获取详情失败";
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchData(props.id || route.params.id);
    });

    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          fetchData(newId);
        }
      }
    );

    return {
      building,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
.detail {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  margin: 0;
  color: #333;
}

.back-link {
  color: #409eff;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 4px;
  border: 1px solid #409eff;
  transition: all 0.3s;
}

.back-link:hover {
  color: #fff;
  background-color: #409eff;
}

.info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-weight: bold;
  color: #666;
  margin-bottom: 5px;
}

.value {
  color: #333;
  font-size: 1.1em;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #666;
}

.error {
  color: #f56c6c;
  text-align: center;
  padding: 20px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .back-link {
    align-self: flex-end;
  }
}
</style>
