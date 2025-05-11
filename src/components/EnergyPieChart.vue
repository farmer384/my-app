<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
//import * as echarts from "echarts";
// ✅ 按需引入（在组件文件的顶部）
import * as echarts from "echarts/core";
import { PieChart } from "echarts/charts";

// 注册需要的组件
echarts.use([
  PieChart, // 饼图
]);
/*  */
export default {
  name: "EnergyPieChart",
  props: {
    data: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: "能耗占比",
    },
    type: {
      type: String,
      default: "electricity", // 'electricity' or 'water'
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
      const name = props.type === "electricity" ? "用电量占比" : "用水量占比";

      const option = {
        title: {
          text: props.title,
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: name,
            type: "pie",
            radius: "50%",
            data: props.data.map((item) => ({
              value:
                props.type === "electricity"
                  ? item.electricity.current
                  : item.water.current,
              name: item.name,
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
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
