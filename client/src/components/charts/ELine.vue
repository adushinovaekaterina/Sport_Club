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
            data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']

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
            // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            data: props.xAxis
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
