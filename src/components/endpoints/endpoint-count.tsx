interface EndpointCountProps {
  showing: number
  total: number
}

export function EndpointCount({ showing, total }: EndpointCountProps) {
  return (
    <p className="text-sm text-muted-foreground">
      Showing {showing} of {total} endpoints
    </p>
  )
}
