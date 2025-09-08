import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl lg:text-3xl font-bold">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
            <CardDescription>Customer review sentiment trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Positive</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 sm:w-32 h-2 bg-muted rounded-full">
                    <div className="w-18 sm:w-24 h-2 bg-accent rounded-full"></div>
                  </div>
                  <span className="text-sm">75%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Neutral</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 sm:w-32 h-2 bg-muted rounded-full">
                    <div className="w-4 sm:w-6 h-2 bg-secondary rounded-full"></div>
                  </div>
                  <span className="text-sm">18%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Negative</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 sm:w-32 h-2 bg-muted rounded-full">
                    <div className="w-1 sm:w-2 h-2 bg-destructive rounded-full"></div>
                  </div>
                  <span className="text-sm">7%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Revenue charts and analytics would be implemented here using a charting library.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
