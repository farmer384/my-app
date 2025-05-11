<template>
  <div ref="chartRef" style="width: 100%; height: 400px"></div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
//import * as echarts from "echarts";
// ✅ 按需引入（在组件文件的顶部）
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";

// 注册需要的组件
echarts.use([
  LineChart, // 折线图
]);
/*  */
export default {
  name: "EnergyLineChart",
  props: {
    trendData: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every((item) => "date" in item && "value" in item);
      },
    },
    title: {
      type: String,
      default: "用电趋势",
    },
  },
  setup(props) {
    const chartRef = ref(null);
    let chartInstance = null;

    const initChart = () => {
      if (!chartRef.value) return;

      chartInstance = echarts.init(chartRef.value);
      updateChart();
    };

    const updateChart = () => {
      // 确保数据存在且格式正确
      if (!props.trendData || props.trendData.length === 0) return;

      const option = {
        title: {
          text: props.title,
          left: "center",
          textStyle: {
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b}<br/>{a}: {c} kWh",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: props.trendData.map((item) => item.date),
          axisLine: {
            lineStyle: {
              color: "#999",
            },
          },
        },
        yAxis: {
          type: "value",
          name: "用电量(kWh)",
          nameTextStyle: {
            padding: [0, 0, 0, 40],
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#999",
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        series: [
          {
            name: "用电量",
            type: "line",
            data: props.trendData.map((item) => item.value),
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: "#5470C6",
            },
            itemStyle: {
              color: "#5470C6",
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "rgba(84, 112, 198, 0.5)" },
                { offset: 1, color: "rgba(84, 112, 198, 0.1)" },
              ]),
            },
            emphasis: {
              focus: "series",
              itemStyle: {
                borderWidth: 2,
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
      chartInstance && chartInstance.resize();
    };

    watch(() => props.trendData, updateChart, { deep: true });

    return { chartRef };
  },
};
</script>
