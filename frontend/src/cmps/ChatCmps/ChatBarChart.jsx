import { BarChart } from '@mui/x-charts/BarChart'

export function ChatBarChart({ mode, rows, xAxis, fields }) {
    console.log('fields', fields)
    const seriesFromFields = fields.map((field) => ({
        dataKey: field.name,
        label: field.display_name
    }))

    return (
        <BarChart
            xAxis={[
                {
                    dataKey: xAxis,
                },
            ]}
            series={seriesFromFields}
            dataset={rows}
            height={300}
        />
    )
}