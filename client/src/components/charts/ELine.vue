<template>
    <div class="charts-wrapper">
        <v-chart class="chart" :option="options" autoresize/>
    </div>
</template>

<script setup lang="ts">
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {LineChart} from "echarts/charts";
import {
    GridComponent,
    ToolboxComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import  {computed} from "vue";
import type {ComputedRef} from "vue";
import type {EChartsOption} from "echarts";
import type {ISeriesLine} from "@/store/models/other";

use([
    CanvasRenderer,
    LineChart,
    ToolboxComponent,
    GridComponent,
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

// computed
const options: ComputedRef<EChartsOption>  = computed(() => {
    return {
        title: {
            text: props.title
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Series 1', 'Series 2', 'Series 3', 'Average Line'],
            top: 'top',
            left: 'center'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: props.xAxis,
            axisLabel: {
                rotate: 90, // Rotate the labels by -45 degrees
                formatter: function (value) {
                    // Set the maximum length of the label
                    const maxLength = 10;
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
        series:props.series
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
