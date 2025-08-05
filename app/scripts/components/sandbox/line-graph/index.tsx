import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface TimeSeriesDataPoint {
  date: string;
  min: number;
  max: number;
  mean: number;
  count: number;
  sum: number;
  std: number;
  median: number;
  majority: number;
  minority: number;
  unique: number;
  histogram: [number[], number[]];
  valid_percent: number;
  masked_pixels: number;
  valid_pixels: number;
  percentile_2: number;
  percentile_98: number;
}

interface LineGraphProps {
  data: TimeSeriesDataPoint[];
  attribute: keyof Omit<TimeSeriesDataPoint, 'date' | 'histogram'>;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const LineGraph: React.FC<LineGraphProps> = ({
  data,
  attribute,
  width = 800,
  height = 400,
  margin = { top: 20, right: 30, bottom: 40, left: 50 }
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  console.log(data);
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates and prepare data
    const parseDate = d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ');
    const processedData = data
      .map((d) => ({
        date: d.date,
        value: d[attribute] as number
      }))
      .filter((d) => d.date !== null)
      .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    
    // Set up scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(processedData, (d) => d.date!) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(processedData, (d) => d.value) as [number, number])
      .nice()
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3
      .line<{ date: Date | null; value: number }>()
      .x((d) => xScale(d.date!))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %Y')));

    g.append('g').call(d3.axisLeft(yScale));

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - innerHeight / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text(attribute);

    g.append('text')
      .attr(
        'transform',
        `translate(${innerWidth / 2}, ${innerHeight + margin.bottom})`
      )
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Date');

    // Add the line
    g.append('path')
      .datum(processedData)
      .attr('fill', 'none')
      .attr('stroke', '#007bff')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots for data points
    g.selectAll('.dot')
      .data(processedData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.date!))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', 4)
      .attr('fill', '#007bff')
      .style('cursor', 'pointer');

    // Add tooltip functionality
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'line-graph-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    // Add hover interactions
    g.selectAll('.dot')
      .on('mouseover', function (event, d) {
        d3.select(this).attr('r', 6).attr('fill', '#0056b3');

        tooltip
          .style('opacity', 1)
          .html(
            `<strong>Date:</strong> ${d3.timeFormat('%b %d, %Y')(d.date!)}<br/>
             <strong>${attribute}:</strong> ${d.value.toFixed(4)}`
          )
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px');
      })
      .on('mouseout', function () {
        d3.select(this).attr('r', 4).attr('fill', '#007bff');
        tooltip.style('opacity', 0);
      });

    // Cleanup function
    return () => {
      d3.select('body').selectAll('.line-graph-tooltip').remove();
    };
  }, [data, attribute, width, height, margin]);

  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>
        Time Series: {attribute}
      </h3>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #ddd' }}
      />
    </div>
  );
};

export default LineGraph;
