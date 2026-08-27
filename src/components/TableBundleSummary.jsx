import { getBundleAvailability } from "@/lib/bundleRules"

export default function TableBundleSummary({ model }) {
  const years = []
  for (let y = model.yearStart; y <= model.yearEnd; y++) {
    years.push(y)
  }

  return (
    <div className="mb-8">
      <h4 className="mb-2 font-semibold">{model.name}</h4>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2">Year</th>
            <th className="py-2">Bundle 1</th>
            <th className="py-2">Bundle 2</th>
            <th className="py-2">Bundle 3</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year) => (
            <tr key={year} className="border-b border-border/50">
              <td className="py-2">{year}</td>
              {[1, 2, 3].map((bundleNumber) => {
                const result = getBundleAvailability(model.code, bundleNumber, year)
                return (
                  <td key={bundleNumber} className="py-2">
                    {result.available ? result.quantity : "—"}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}