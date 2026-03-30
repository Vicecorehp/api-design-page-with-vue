<script setup lang="ts">
import {
  Badge,
  BaseBehavior,
  ExtensionCategory,
  Graph,
  GraphEvent,
  Label,
  Rect,
  register
} from '@antv/g6'
import { onMounted } from 'vue'

const statusColors = {
  online: '#17BEBB',
  busy: '#E36397',
  offline: '#B7AD99',
};

const DEFAULT_LEVEL = 'detailed';

class ChartNode extends Rect {
  get data() {
    return this.context.model.getElementDataById(this.id).data;
  }

  get level() {
    return this.data?.level || DEFAULT_LEVEL;
  }

  getLabelStyle(): Record<string, unknown> {
    const text = this.data?.name;
    const labelStyle =
      this.level === 'overview'
        ? {
          fill: '#fff',
          fontSize: 20,
          fontWeight: 600,
          textAlign: 'center',
          transform: [['translate', 0, 0]],
        }
        : {
          fill: '#2078B4',
          fontSize: 14,
          fontWeight: 400,
          textAlign: 'left',
          transform: [['translate', -65, -15]],
        };
    return { text, ...labelStyle };
  }

  getKeyStyle(attributes: Record<string, unknown>) {
    return {
      ...super.getKeyStyle(attributes),
      fill: this.level === 'overview' ? statusColors[this.data.status] : '#fff',
    };
  }

  getPositionStyle(attributes) {
    if (this.level === 'overview') {
      return false
    }
    return {
      text: this.data.position,
      fontSize: 8,
      fontWeight: 400,
      textTransform: 'uppercase',
      fill: '#343f4a',
      textAlign: 'left',
      transform: [['translate', -65, 0]],
    };
  }

  drawPositionShape(attributes, container: any) {
    const positionStyle = this.getPositionStyle(attributes);
    this.upsert('position', Label, positionStyle, container);
  }

  getStatusStyle() {
    if (this.level === 'overview') {
      return false
    }
    return {
      text: this.data?.status,
      fontSize: 8,
      textAlign: 'left',
      transform: [['translate', 40, -16]],
      padding: [0, 4],
      fill: '#fff',
      backgroundFill: statusColors[this.data?.status],
    };
  }

  drawStatusShape(attributes, container: any) {
    const statusStyle = this.getStatusStyle();
    this.upsert('status', Badge, statusStyle, container);
  }

  getPhoneStyle(): Record<string, unknown> | false {
    if (this.level === 'overview') {
      return false
    }
    return {
      text: this.data?.phone,
      fontSize: 8,
      fontWeight: 300,
      textAlign: 'left',
      transform: [['translate', -65, 20]],
    };
  }

  drawPhoneShape(container: any) {
    const style = this.getPhoneStyle();
    this.upsert('phone', Label, style, container);
  }

  render(attributes = this.parsedAttributes, container = this) {
    super.render(attributes, container);

    this.drawPositionShape(attributes, container);
    this.drawStatusShape(attributes, container);
    this.drawPhoneShape(container);
  }
}

/**
 * Implement a level of detail rendering, which will show different details based on the zoom level.
 */
class LevelOfDetail extends BaseBehavior {
  prevLevel = DEFAULT_LEVEL;
  levels = {
    ['overview']: [0, 0.6],
    ['detailed']: [0.6, Infinity],
  };

  constructor(context, options) {
    super(context, options);
    this.bindEvents();
  }

  update(options) {
    this.unbindEvents();
    super.update(options);
    this.bindEvents();
  }

  updateZoomLevel = async (e) => {
    if ('scale' in e.data) {
      const scale = e.data.scale;
      const level = Object.entries(this.levels).find(([key, [min, max]]) => scale > min && scale <= max)?.[0];
      if (level && this.prevLevel !== level) {
        const { graph } = this.context;
        graph.updateNodeData((prev) => prev.map((node) => ({ ...node, data: { ...node.data, level } })));
        await graph.draw();
        this.prevLevel = level;
      }
    }
  };

  bindEvents() {
    const { graph } = this.context;
    graph.on(GraphEvent.AFTER_TRANSFORM, this.updateZoomLevel);
  }

  unbindEvents() {
    const { graph } = this.context;
    graph.off(GraphEvent.AFTER_TRANSFORM, this.updateZoomLevel);
  }

  destroy() {
    this.unbindEvents();
    super.destroy();
  }
}

onMounted(() => {
  register(ExtensionCategory.NODE, 'chart-node', ChartNode);
  register(ExtensionCategory.BEHAVIOR, 'level-of-detail', LevelOfDetail);

  fetch('https://assets.antv.antgroup.com/g6/organization-chart.json')
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      const graph = new Graph({
        container: 'department-container',
        data,
        node: {
          type: 'chart-node',
          style: {
            labelPlacement: 'center',
            lineWidth: 1,
            ports: [{ placement: 'top' }, { placement: 'bottom' }],
            radius: 2,
            shadowBlur: 10,
            shadowColor: '#e0e0e0',
            shadowOffsetX: 3,
            size: [150, 60],
            stroke: '#C0C0C0',
          },
        },
        edge: {
          type: 'polyline',
          style: {
            router: {
              type: 'orth',
            },
            stroke: '#C0C0C0',
          },
        },
        layout: {
          type: 'dagre',
        },
        autoFit: 'view',
        behaviors: ['level-of-detail', 'zoom-canvas', 'drag-canvas'],
      });

      graph.render();
    });
})
</script>

<template>
  <div id="department-container" />
</template>

<style scoped>
#department-container {
  height: 100vh;
  width: 100vw;
}
</style>