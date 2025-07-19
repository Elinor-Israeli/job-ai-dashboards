import { BarChart } from '@mui/x-charts/BarChart'
import { LineChart } from '@mui/x-charts/LineChart'

export function ChatCharts({ mode, rows, xAxis, fields }) {
    const xAxisConfig = [{ dataKey: xAxis }]

    let dataset = [...rows]

    if (xAxis === 'date') {
        dataset = dataset.map(item => ({
            ...item,
            date: new Date(item.date)
        }))
    }
    
    dataset.sort((a, b) => {
        const aVal = a[xAxis]
        const bVal = b[xAxis]
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    })

    const series = fields.map((field) => ({
        dataKey: field.name,
        label: field.display_name
    }))

    const commonProps = {
        xAxis: xAxisConfig,
        series,
        dataset,
        height: 300,
    }

    return mode === 'bar'
        ? <BarChart {...commonProps} />
        : <LineChart {...commonProps} />
}
