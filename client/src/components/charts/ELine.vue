<template>
    <div class="charts-wrapper">
        <v-chart class="chart" :option="options" autoresize/>
    </div>
</template>

<script setup lang="ts">
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {BarChart, LineChart} from "echarts/charts";
import {
    GridComponent,
    ToolboxComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import {computed, ref} from "vue";
import type {ComputedRef} from "vue";
import type {EChartsOption} from "echarts";
import type {ISeriesLine} from "@/store/models/other";

use([
    CanvasRenderer,
    LineChart,
    ToolboxComponent,
    GridComponent,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

const props = defineProps<{
    title:string
    legend:string[]
    xAxis:string[]
    series: ISeriesLine[]
}>();

const tableContainer = ref<HTMLElement | null>(null);// computed

const options: ComputedRef<EChartsOption>  = computed(() => {
    return {
        title: {
            text: props.title
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: props.legend,
            bottom: 'bottom', // Position the legend at the bottom
            orient: 'horizontal' // Display the legend horizontally
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {},
            },

        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: props.xAxis,
            axisLabel: {
                rotate: 90, // Rotate the labels by -45 degrees
                formatter: function (value) {
                    // Set the maximum length of the label
                    const maxLength = 20;
                    // Check if the label length exceeds the maximum length
                    if (value.length > maxLength) {
                        // Shorten the label and add ellipsis
                        return value.substring(0, maxLength) + '...';
                    } else {
                        return value;
                    }
                }
            }
        },
        yAxis: {
            type: 'value'
        },
        series: props.series.map((seriesItem, index) => ({
            ...seriesItem,
            label: {
                show: true,
                position: 'top' // You can adjust the position as needed
            },
            symbolSize: (dataValue, data) => {

                if (data.dataIndex === seriesItem.data.length - 1) {
                    // Return a bigger symbol size
                    return 15;
                } else {
                    // Return default symbol size
                    return 5;
                }
            },
            itemStyle: {
                color: (params:any) => {
                    console.log(params)
                    // Check if it's the last data point
                    if (params.dataIndex === seriesItem.data.length - 1) {
                        // Return a custom color for the last point
                        return 'red'; // Change to the desired color
                    } else {
                        // Return default color for other points
                        return params.color; // or whatever default color you have
                    }
                }
            }
        }))
    };
});


</script>

<style scoped>
.charts-wrapper {
    width: 100%;
    //background-color: aqua;
    min-height: 400px;
}

.chart {
    min-height: 400px;
    min-width: 200px;
    display: flex;
    justify-content: center;
    //align-items: center;
}
</style>
