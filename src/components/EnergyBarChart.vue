<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
//import * as echarts from "echarts";
// ✅ 按需引入（在组件文件的顶部）
import * as echarts from "echarts/core";
import { BarChart } from "echarts/charts";

// 注册需要的组件
echarts.use([
  BarChart, // 柱状图
]);
/*  */
export default {
  name: "EnergyBarChart",
  props: {
    data: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "能耗对比",
    },
  },
  setup(props) {
    const chartRef = ref(null);
    let chartInstance = null;

    const initChart = () => {
      if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value);
        updateChart();
      }
    };

    const updateChart = () => {
      const option = {
        title: {
          text: props.title,
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        xAxis: {
          type: "category",
          data: props.data.map((item) => item.name),
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: "value",
          name: "能耗值",
        },
        series: [
          {
            name: "用电量",
            type: "bar",
            data: props.data.map((item) => item.electricity.current),
            itemStyle: {
              color: "#5470C6",
            },
          },
          {
            name: "用水量",
            type: "bar",
            data: props.data.map((item) => item.water.current),
            itemStyle: {
              color: "#91CC75",
            },
          },
        ],
      };
      chartInstance.setOption(option);
    };

    onMounted(() => {
      initChart();
      window.addEventListener("resize", handleResize);
    });

    onBeforeUnmount(() => {
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }
      window.removeEventListener("resize", handleResize);
    });

    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    watch(
      () => props.data,
      () => {
        if (chartInstance) {
          updateChart();
        }
      },
      { deep: true }
    );

    return {
      chartRef,
    };
  },
};
</script>
