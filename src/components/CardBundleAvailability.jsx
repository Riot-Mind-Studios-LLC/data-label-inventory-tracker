import { Card, CardContent } from "@/components/ui/card"

export default function CardBundleAvailability({ year, availability }) {
  const { available, quantity, limitingProduct } = availability

  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <p className="font-mono text-sm">{year}</p>

        {available ? (
          <div className="text-right">
            <p className="text-lg font-semibold">{quantity} available</p>
            {limitingProduct && (
              <p className="text-xs text-muted-foreground">
                Limited by {limitingProduct}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Not offered</p>
        )}
      </CardContent>
    </Card>
  )
}