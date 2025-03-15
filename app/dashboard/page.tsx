import { Redis } from '@upstash/redis'
import { formatDistanceToNow } from 'date-fns'

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
})

const ITEMS_PER_PAGE = 10

type EventData = {
  event: string
  timestamp: string
  format?: string
  paperStyle?: string
  error?: boolean
  font?: string
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const currentPage = Number(searchParams.page) || 1
  const events: EventData[] = await redis.lrange('app_events', 0, -1)
  
  const parsedEvents = events.map(event => {
    try {
      return event as EventData
    } catch {
      console.error('Failed to parse event:', event)
      return {
        event: 'parse_error',
        timestamp: new Date().toISOString(),
        error: true
      } as EventData
    }
  }).filter(event => event !== null)

  const totalPages = Math.ceil(parsedEvents.length / ITEMS_PER_PAGE)
  const paginatedEvents = parsedEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const metrics = {
    total: parsedEvents.length,
    byFormat: {} as Record<string, number>,
    byPaperStyle: {} as Record<string, number>,
    byFont: {} as Record<string, number>,
    errors: parsedEvents.filter(e => e.event === 'note_export_error' || e.event === 'parse_error').length
  }

  parsedEvents.forEach(event => {
    if (event.format) {
      metrics.byFormat[event.format] = (metrics.byFormat[event.format] || 0) + 1
    }
    if (event.paperStyle) {
      metrics.byPaperStyle[event.paperStyle] = (metrics.byPaperStyle[event.paperStyle] || 0) + 1
    }
    if (event.font) {
      metrics.byFont[event.font] = (metrics.byFont[event.font] || 0) + 1
    }
  })

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Export Analytics Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Exports</h3>
            <p className="text-3xl font-bold">{metrics.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Success Rate</h3>
            <p className="text-3xl font-bold">
              {metrics.total ? 
                `${(((metrics.total - metrics.errors) / metrics.total) * 100).toFixed(1)}%` 
                : '0%'}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">PNG Exports</h3>
            <p className="text-3xl font-bold">{metrics.byFormat['png'] || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">PDF Exports</h3>
            <p className="text-3xl font-bold">{metrics.byFormat['pdf'] || 0}</p>
          </div>
        </div>

        {/* Font Usage Analytics */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Font Usage</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(metrics.byFont).sort((a, b) => b[1] - a[1]).map(([font, count]) => (
                <div key={font} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Font</div>
                  <div className="font-medium" style={{ fontFamily: font }}>{font}</div>
                  <div className="text-2xl font-bold mt-1">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Events Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Export Events</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paper Style</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEvents.map((event, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDistanceToNow(new Date(event.timestamp))} ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.event}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.format}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.paperStyle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.event.includes('error') 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {event.event.includes('error') ? 'Failed' : 'Success'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <a
                href={`/dashboard?page=${currentPage - 1}`}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </a>
              <a
                href={`/dashboard?page=${currentPage + 1}`}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, parsedEvents.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{parsedEvents.length}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <a
                      key={page}
                      href={`/dashboard?page=${page}`}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-black border-black text-white'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } ${page === 1 ? 'rounded-l-md' : ''} ${
                        page === totalPages ? 'rounded-r-md' : ''
                      }`}
                    >
                      {page}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 