import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  Eye,
  IndianRupee,
  Volume2,
  Calendar,
  Sparkles,
  ShoppingBag,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { MonthlyTrendData } from '../types';
import { speakAloud } from '../utils/audioService';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';

interface ArtisanTrendsChartProps {
  data: MonthlyTrendData[];
  language?: string;
}

type MetricViewMode = 'both' | 'sales' | 'views';

export const ArtisanTrendsChart: React.FC<ArtisanTrendsChartProps> = ({
  data,
}) => {
  const { language, t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [dimensions, setDimensions] = useState({ width: 0, height: 260 });
  const [viewMode, setViewMode] = useState<MetricViewMode>('both');
  const [timeRange, setTimeRange] = useState<'8m' | '4m'>('8m');
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);

  const speechLang = getSpeechLangCode(language);

  // Filter data based on selected time range
  const filteredData = useMemo(() => {
    if (timeRange === '4m') {
      return data.slice(-4);
    }
    return data;
  }, [data, timeRange]);

  // Aggregate stats
  const totalSales = useMemo(
    () => filteredData.reduce((acc, d) => acc + d.sales, 0),
    [filteredData]
  );
  const totalViews = useMemo(
    () => filteredData.reduce((acc, d) => acc + d.views, 0),
    [filteredData]
  );
  const totalOrders = useMemo(
    () => filteredData.reduce((acc, d) => acc + d.ordersCount, 0),
    [filteredData]
  );
  const peakMonth = useMemo(() => {
    return [...filteredData].sort((a, b) => b.sales - a.sales)[0];
  }, [filteredData]);

  // Measure container width responsively with ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const newWidth = Math.floor(entry.contentRect.width);
      if (newWidth > 0) {
        setDimensions((prev) => ({
          ...prev,
          width: newWidth,
          height: newWidth < 420 ? 240 : 270,
        }));
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // D3 Chart Rendering
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || filteredData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const isSmallScreen = dimensions.width < 460;
    const margin = {
      top: 24,
      right: viewMode === 'sales' ? 18 : isSmallScreen ? 34 : 44,
      bottom: 34,
      left: viewMode === 'views' ? 20 : isSmallScreen ? 42 : 54,
    };

    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) return;

    // Create main grouping
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradient definitions
    const defs = svg.append('defs');

    // Sales gradient (Terracotta #9C3D25)
    const salesGradient = defs
      .append('linearGradient')
      .attr('id', 'sales-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    salesGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#9C3D25')
      .attr('stop-opacity', 0.28);
    salesGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#9C3D25')
      .attr('stop-opacity', 0.01);

    // Views gradient (Forest Green #2D5A43)
    const viewsGradient = defs
      .append('linearGradient')
      .attr('id', 'views-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    viewsGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#2D5A43')
      .attr('stop-opacity', 0.25);
    viewsGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#2D5A43')
      .attr('stop-opacity', 0.01);

    // Subtle drop shadow filter for active point markers
    const filter = defs.append('filter').attr('id', 'point-glow').attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
    filter.append('feDropShadow').attr('dx', '0').attr('dy', '2').attr('stdDeviation', '3').attr('flood-opacity', '0.25');

    // X Scale (point scale for discrete months)
    const xScale = d3
      .scalePoint<string>()
      .domain(filteredData.map((d) => d.monthLabel))
      .range([0, width])
      .padding(0.2);

    // Y Scale for Sales (Left)
    const maxSales = d3.max(filteredData, (d: MonthlyTrendData) => d.sales) ?? 10000;
    const ySalesScale = d3
      .scaleLinear()
      .domain([0, Number(maxSales) * 1.15])
      .nice()
      .range([height, 0]);

    // Y Scale for Views (Right)
    const maxViews = d3.max(filteredData, (d: MonthlyTrendData) => d.views) ?? 500;
    const yViewsScale = d3
      .scaleLinear()
      .domain([0, Number(maxViews) * 1.18])
      .nice()
      .range([height, 0]);

    // Horizontal grid lines (based on sales or views)
    const yTicks = isSmallScreen ? 4 : 5;
    const gridScale = viewMode === 'views' ? yViewsScale : ySalesScale;
    const gridGroup = g.append('g').attr('class', 'grid-lines');

    gridGroup
      .selectAll('line.grid-line')
      .data(gridScale.ticks(yTicks))
      .enter()
      .append('line')
      .attr('class', 'grid-line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => gridScale(d))
      .attr('y2', (d) => gridScale(d))
      .attr('stroke', '#E8DFD5')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    // Bottom X Axis
    const xAxis = d3
      .axisBottom(xScale)
      .tickSize(0)
      .tickPadding(10)
      .tickFormat((d) => {
        const item = filteredData.find((pt) => pt.monthLabel === d);
        if (!item) return d;
        return language === 'hi' ? item.monthHindi : item.monthLabel;
      });

    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#D9C8B7').attr('stroke-width', 1.2);
    xAxisGroup
      .selectAll('.tick text')
      .attr('fill', '#6B5E57')
      .attr('font-size', isSmallScreen ? '10px' : '11px')
      .attr('font-weight', '600');

    // Left Y Axis (Sales in ₹)
    if (viewMode !== 'views') {
      const yAxisSales = d3
        .axisLeft(ySalesScale)
        .ticks(yTicks)
        .tickSize(0)
        .tickPadding(8)
        .tickFormat((d) => `₹${Number(d) >= 1000 ? `${(Number(d) / 1000).toFixed(0)}k` : d}`);

      const yAxisSalesGroup = g.append('g').call(yAxisSales);
      yAxisSalesGroup.select('.domain').remove();
      yAxisSalesGroup
        .selectAll('.tick text')
        .attr('fill', '#9C3D25')
        .attr('font-size', isSmallScreen ? '10px' : '11px')
        .attr('font-weight', '700');
    }

    // Right Y Axis (Product Views count)
    if (viewMode !== 'sales') {
      const yAxisViews = d3
        .axisRight(yViewsScale)
        .ticks(yTicks)
        .tickSize(0)
        .tickPadding(8)
        .tickFormat((d) => `${d}`);

      const yAxisViewsGroup = g
        .append('g')
        .attr('transform', `translate(${width}, 0)`)
        .call(yAxisViews);

      yAxisViewsGroup.select('.domain').remove();
      yAxisViewsGroup
        .selectAll('.tick text')
        .attr('fill', '#2D5A43')
        .attr('font-size', isSmallScreen ? '10px' : '11px')
        .attr('font-weight', '700');
    }

    // Line and Area Generators
    const salesLineGenerator = d3
      .line<MonthlyTrendData>()
      .x((d) => xScale(d.monthLabel) || 0)
      .y((d) => ySalesScale(d.sales))
      .curve(d3.curveMonotoneX);

    const salesAreaGenerator = d3
      .area<MonthlyTrendData>()
      .x((d) => xScale(d.monthLabel) || 0)
      .y0(height)
      .y1((d) => ySalesScale(d.sales))
      .curve(d3.curveMonotoneX);

    const viewsLineGenerator = d3
      .line<MonthlyTrendData>()
      .x((d) => xScale(d.monthLabel) || 0)
      .y((d) => yViewsScale(d.views))
      .curve(d3.curveMonotoneX);

    const viewsAreaGenerator = d3
      .area<MonthlyTrendData>()
      .x((d) => xScale(d.monthLabel) || 0)
      .y0(height)
      .y1((d) => yViewsScale(d.views))
      .curve(d3.curveMonotoneX);

    // Render Product Views Area & Line
    if (viewMode !== 'sales') {
      g.append('path')
        .datum(filteredData)
        .attr('fill', 'url(#views-area-gradient)')
        .attr('d', viewsAreaGenerator);

      g.append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', '#2D5A43')
        .attr('stroke-width', 2.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', viewsLineGenerator);

      // Circles on Views points
      g.selectAll<SVGCircleElement, MonthlyTrendData>('circle.views-dot')
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('class', 'views-dot')
        .attr('cx', (d: MonthlyTrendData) => xScale(d.monthLabel) || 0)
        .attr('cy', (d: MonthlyTrendData) => yViewsScale(d.views))
        .attr('r', 3.5)
        .attr('fill', '#FFFFFF')
        .attr('stroke', '#2D5A43')
        .attr('stroke-width', 2);
    }

    // Render Sales Area & Line
    if (viewMode !== 'views') {
      g.append('path')
        .datum(filteredData)
        .attr('fill', 'url(#sales-area-gradient)')
        .attr('d', salesAreaGenerator);

      g.append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', '#9C3D25')
        .attr('stroke-width', 3)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', salesLineGenerator);

      // Circles on Sales points
      g.selectAll<SVGCircleElement, MonthlyTrendData>('circle.sales-dot')
        .data(filteredData)
        .enter()
        .append('circle')
        .attr('class', 'sales-dot')
        .attr('cx', (d: MonthlyTrendData) => xScale(d.monthLabel) || 0)
        .attr('cy', (d: MonthlyTrendData) => ySalesScale(d.sales))
        .attr('r', 4)
        .attr('fill', '#FFFFFF')
        .attr('stroke', '#9C3D25')
        .attr('stroke-width', 2.2);
    }

    // Interactive Vertical Guideline & Highlight Nodes
    const focusGroup = g.append('g').attr('class', 'focus-indicators').style('display', 'none');

    const focusLine = focusGroup
      .append('line')
      .attr('class', 'focus-line')
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#5E534D')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.85);

    const focusSalesDot = focusGroup
      .append('circle')
      .attr('class', 'focus-sales-dot')
      .attr('r', 6)
      .attr('fill', '#9C3D25')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2.5)
      .attr('filter', 'url(#point-glow)');

    const focusViewsDot = focusGroup
      .append('circle')
      .attr('class', 'focus-views-dot')
      .attr('r', 5.5)
      .attr('fill', '#2D5A43')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2.5)
      .attr('filter', 'url(#point-glow)');

    // Transparent overlay for scrub / pointer interaction
    const overlay = g
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    const updateFocus = (mouseX: number) => {
      // Find closest month
      const domain = xScale.domain();
      const range = xScale.range();
      const step = (range[1] - range[0]) / Math.max(1, domain.length - 1);

      let closestIdx = 0;
      let minDistance = Infinity;

      domain.forEach((d, i) => {
        const xPos = xScale(d) || 0;
        const dist = Math.abs(mouseX - xPos);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      });

      const activeItem = filteredData[closestIdx];
      if (!activeItem) return;

      setActivePointIndex(closestIdx);

      const targetX = xScale(activeItem.monthLabel) || 0;
      focusGroup.style('display', null);
      focusLine.attr('x1', targetX).attr('x2', targetX);

      if (viewMode !== 'views') {
        focusSalesDot
          .style('display', null)
          .attr('cx', targetX)
          .attr('cy', ySalesScale(activeItem.sales));
      } else {
        focusSalesDot.style('display', 'none');
      }

      if (viewMode !== 'sales') {
        focusViewsDot
          .style('display', null)
          .attr('cx', targetX)
          .attr('cy', yViewsScale(activeItem.views));
      } else {
        focusViewsDot.style('display', 'none');
      }
    };

    overlay
      .on('mousemove', (event: MouseEvent) => {
        const [x] = d3.pointer(event);
        updateFocus(x);
      })
      .on('mouseleave', () => {
        // keep latest selected or reset
        // we can keep activePointIndex or reset on demand
      })
      .on('touchstart touchmove', (event: TouchEvent) => {
        if (event.touches.length > 0) {
          const touch = event.touches[0];
          const rect = svgRef.current?.getBoundingClientRect();
          if (rect) {
            const x = touch.clientX - rect.left - margin.left;
            updateFocus(Math.max(0, Math.min(width, x)));
          }
        }
      });

    // If there is an active point index, show it
    if (activePointIndex !== null && filteredData[activePointIndex]) {
      const item = filteredData[activePointIndex];
      const targetX = xScale(item.monthLabel) || 0;
      focusGroup.style('display', null);
      focusLine.attr('x1', targetX).attr('x2', targetX);
      if (viewMode !== 'views') {
        focusSalesDot
          .style('display', null)
          .attr('cx', targetX)
          .attr('cy', ySalesScale(item.sales));
      }
      if (viewMode !== 'sales') {
        focusViewsDot
          .style('display', null)
          .attr('cx', targetX)
          .attr('cy', yViewsScale(item.views));
      }
    } else {
      // Default highlight the latest month
      const lastIdx = filteredData.length - 1;
      setActivePointIndex(lastIdx);
    }
  }, [dimensions, filteredData, viewMode, language]);

  // Handle Voice Readout of Trends
  const handleListenTrends = () => {
    const text = `${t('screens.trends.title')}: ${t('screens.trends.totalEarnings')} ₹${totalSales.toLocaleString('en-IN')}, ${totalViews.toLocaleString('en-IN')} ${t('screens.trends.views')}, ${totalOrders} ${t('screens.trends.orders')}.`;
    speakAloud(text, { lang: speechLang });
  };

  const activeDataPoint =
    activePointIndex !== null && filteredData[activePointIndex]
      ? filteredData[activePointIndex]
      : filteredData[filteredData.length - 1];

  return (
    <div
      id="artisan-trends-chart-card"
      className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-3xl p-4 sm:p-5 shadow-xs space-y-4"
    >
      {/* Header & Voice Controls */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FDF1EC] text-[#9C3D25] flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-[#201A18] leading-tight">
                {t('screens.trends.title')}
              </h2>
              <div className="text-[11px] sm:text-xs text-[#5E534D] flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#9C3D25]" />
                <span>
                  {`${filteredData[0]?.monthLabel} - ${filteredData[filteredData.length - 1]?.monthLabel} 2026`}
                </span>
                <span>•</span>
                <span className="text-[#2D5A43] font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('common.verified')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Readout Button */}
        <button
          id="btn-listen-trends-voice"
          type="button"
          onClick={handleListenTrends}
          className="px-3 py-1.5 rounded-full bg-[#FAF6F0] hover:bg-[#F4EBE1] text-[#9C3D25] border border-[#E3D5C5] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs active:scale-95 flex-shrink-0"
          title={t('common.listen')}
          aria-label={t('common.listen')}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">
            {t('common.listen')}
          </span>
        </button>
      </div>

      {/* KPI Chips Row */}
      <div className="grid grid-cols-3 gap-2 pt-0.5">
        {/* Total Sales */}
        <div
          onClick={() => setViewMode(viewMode === 'sales' ? 'both' : 'sales')}
          className={`cursor-pointer rounded-2xl p-2.5 sm:p-3 border transition-all ${
            viewMode === 'sales' || viewMode === 'both'
              ? 'bg-[#FAF6F0] border-[#9C3D25]/40 ring-1 ring-[#9C3D25]/20'
              : 'bg-white border-[#E3D5C5] opacity-60'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[#9C3D25] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#9C3D25]" />
            <IndianRupee className="w-3.5 h-3.5" />
            <span className="truncate">{t('screens.trends.sales')}</span>
          </div>
          <div className="font-display font-extrabold text-base sm:text-lg text-[#201A18] mt-1">
            ₹{totalSales.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#2D5A43] font-bold flex items-center gap-0.5 mt-0.5">
            <span>+{Math.round((filteredData[filteredData.length - 1]?.sales / (filteredData[0]?.sales || 1) - 1) * 100)}%</span>
            <span>↑</span>
          </div>
        </div>

        {/* Total Views */}
        <div
          onClick={() => setViewMode(viewMode === 'views' ? 'both' : 'views')}
          className={`cursor-pointer rounded-2xl p-2.5 sm:p-3 border transition-all ${
            viewMode === 'views' || viewMode === 'both'
              ? 'bg-[#FAF6F0] border-[#2D5A43]/40 ring-1 ring-[#2D5A43]/20'
              : 'bg-white border-[#E3D5C5] opacity-60'
          }`}
        >
          <div className="flex items-center gap-1.5 text-[#2D5A43] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2D5A43]" />
            <Eye className="w-3.5 h-3.5" />
            <span className="truncate">{t('screens.trends.views')}</span>
          </div>
          <div className="font-display font-extrabold text-base sm:text-lg text-[#201A18] mt-1">
            {totalViews.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#2D5A43] font-bold flex items-center gap-0.5 mt-0.5">
            <span>+{Math.round((filteredData[filteredData.length - 1]?.views / (filteredData[0]?.views || 1) - 1) * 100)}%</span>
            <span>↑</span>
          </div>
        </div>

        {/* Fulfilled Orders & Peak */}
        <div className="bg-white border border-[#E3D5C5] rounded-2xl p-2.5 sm:p-3">
          <div className="flex items-center gap-1.5 text-[#7B5500] text-xs font-bold">
            <ShoppingBag className="w-3.5 h-3.5 text-[#7B5500]" />
            <span className="truncate">{t('screens.trends.orders')}</span>
          </div>
          <div className="font-display font-extrabold text-base sm:text-lg text-[#201A18] mt-1">
            {totalOrders}
          </div>
          <div className="text-[10px] text-[#5E534D] truncate mt-0.5">
            {peakMonth ? `Peak: ${peakMonth.monthLabel}` : t('common.verified')}
          </div>
        </div>
      </div>

      {/* Filter & Range Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs pt-1">
        {/* Metric Mode Filter */}
        <div className="inline-flex bg-[#F4EBE1] p-0.5 rounded-xl border border-[#E3D5C5]">
          <button
            type="button"
            id="filter-trend-both"
            onClick={() => setViewMode('both')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewMode === 'both'
                ? 'bg-white text-[#201A18] shadow-2xs'
                : 'text-[#6B5E57] hover:text-[#201A18]'
            }`}
          >
            {t('common.all')}
          </button>
          <button
            type="button"
            id="filter-trend-sales"
            onClick={() => setViewMode('sales')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              viewMode === 'sales'
                ? 'bg-[#9C3D25] text-white shadow-2xs'
                : 'text-[#9C3D25] hover:bg-white/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{t('screens.trends.sales')}</span>
          </button>
          <button
            type="button"
            id="filter-trend-views"
            onClick={() => setViewMode('views')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
              viewMode === 'views'
                ? 'bg-[#2D5A43] text-white shadow-2xs'
                : 'text-[#2D5A43] hover:bg-white/50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span>{t('screens.trends.views')}</span>
          </button>
        </div>

        {/* Time Range Toggle */}
        <div className="inline-flex bg-[#F4EBE1] p-0.5 rounded-xl border border-[#E3D5C5]">
          <button
            type="button"
            id="btn-range-4m"
            onClick={() => setTimeRange('4m')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              timeRange === '4m'
                ? 'bg-white text-[#201A18] shadow-2xs'
                : 'text-[#6B5E57] hover:text-[#201A18]'
            }`}
          >
            4M
          </button>
          <button
            type="button"
            id="btn-range-8m"
            onClick={() => setTimeRange('8m')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              timeRange === '8m'
                ? 'bg-white text-[#201A18] shadow-2xs'
                : 'text-[#6B5E57] hover:text-[#201A18]'
            }`}
          >
            8M
          </button>
        </div>
      </div>

      {/* D3 SVG Container with ResizeObserver */}
      <div
        ref={containerRef}
        id="d3-chart-wrapper"
        className="w-full relative overflow-hidden select-none bg-[#FAF6F0]/60 rounded-2xl border border-[#E3D5C5]/60 pt-2 pb-1"
        style={{ minHeight: '240px' }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width || '100%'}
          height={dimensions.height}
          className="overflow-visible block mx-auto"
        />

        {/* Legend Indicator Pills */}
        <div className="absolute top-2.5 left-3 flex items-center gap-3 text-[11px] font-bold pointer-events-none">
          {viewMode !== 'views' && (
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-[#9C3D25]/20 text-[#9C3D25]">
              <span className="w-2.5 h-0.5 bg-[#9C3D25] rounded-full" />
              <span>{t('screens.trends.sales')}</span>
            </div>
          )}
          {viewMode !== 'sales' && (
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-[#2D5A43]/20 text-[#2D5A43]">
              <span className="w-2.5 h-0.5 bg-[#2D5A43] rounded-full" />
              <span>{t('screens.trends.views')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Detail Card for Active Data Point */}
      {activeDataPoint && (
        <div
          id="active-point-details-card"
          className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-2xl p-3 sm:p-3.5 space-y-2 animate-fade-in"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[#201A18] font-display">
                {activeDataPoint.monthLabel || activeDataPoint.month}
              </span>
              <span className="text-[11px] text-[#5E534D] font-semibold">
                ({activeDataPoint.month})
              </span>
            </div>

            {activeDataPoint.highlight && (
              <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#7B5500] border border-[#E5A93C]/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#E5A93C]" />
                <span>{activeDataPoint.highlight}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#E3D5C5]/70">
            <div>
              <div className="text-[10px] text-[#5E534D] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9C3D25]" />
                <span>{t('screens.trends.sales')}</span>
              </div>
              <div className="font-display font-extrabold text-sm sm:text-base text-[#9C3D25] mt-0.5">
                ₹{activeDataPoint.sales.toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#5E534D] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43]" />
                <span>{t('screens.trends.views')}</span>
              </div>
              <div className="font-display font-extrabold text-sm sm:text-base text-[#2D5A43] mt-0.5">
                {activeDataPoint.views.toLocaleString('en-IN')}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-[#5E534D] font-bold flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-[#7B5500]" />
                <span>{t('screens.trends.orders')}</span>
              </div>
              <div className="font-display font-extrabold text-sm sm:text-base text-[#201A18] mt-0.5">
                {activeDataPoint.ordersCount}
                <span className="text-[10px] text-[#5E534D] font-normal ml-1">
                  ({((activeDataPoint.ordersCount / activeDataPoint.views) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Voice Prompt for This Specific Month */}
          <div className="pt-1 flex items-center justify-between text-[11px] text-[#5E534D]">
            <span className="italic flex items-center gap-1">
              <Info className="w-3 h-3 text-[#9C3D25]" />
              {t('screens.trends.sub')}
            </span>
            <button
              type="button"
              onClick={() => {
                const msg = `${activeDataPoint.monthLabel}: ₹${activeDataPoint.sales.toLocaleString('en-IN')}, ${activeDataPoint.views} ${t('screens.trends.views')}, ${activeDataPoint.ordersCount} ${t('screens.trends.orders')}.`;
                speakAloud(msg, { lang: speechLang });
              }}
              className="text-[#9C3D25] font-bold hover:underline flex items-center gap-0.5"
            >
              <span>{t('common.listen')}</span>
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

