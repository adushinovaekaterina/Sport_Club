<template>
    <div class="charts-wrapper" v-if="data.length > 0">
        <v-chart class="chart" :option="options"/>
    </div>
</template>

<script setup lang="ts">
import {use} from "echarts/core";
import {CanvasRenderer} from "echarts/renderers";
import {PieChart} from "echarts/charts";
import {
    GridComponent,
    TooltipComponent,
    LegendComponent,
    TitleComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import {computed} from "vue";

use([
    CanvasRenderer,
    PieChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

const props = defineProps<{
    data: {
        value: number;
        name: string;
    }[];
    name: string;
}>();

const colors = ['#4797ff', '#afafaf', '#ffa57f', '#afafaf']; // Red for berry, Gold for strawberry, AquaMarine for other

// computed
const options = computed(() => {
    return {
        title: {
            text: props.name, // Title text
            left: 'center', // Title position
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'right'
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '70%'],
                // adjust the start and end angle
                startAngle: 180,
                endAngle: 360,
                data: props.data,
                itemStyle: {
                    color: function (params) {
                        return colors[params.dataIndex];
                    }
                },
                label: {
                    show: true,
                    formatter: '{b} ({d})' // Display category name and percentage
                }
            }
        ]
    };
});
</script>

<style scoped>
.charts-wrapper {
    width: 100%;
    height: 100%;
    min-width: 200px;
    min-height: 300px;
}

.chart {
    min-height: 200px;
    min-width: 200px;
}
</style>
