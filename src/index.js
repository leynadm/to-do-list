import { format, formatDistance, formatRelative, subDays } from 'date-fns'

format(new Date(), "'Today is a' eeee")
//=> "Today is a Sunday"
console.log(format(new Date(), "'Today is a' eeee"));

console.log(formatDistance(subDays(new Date(), 3), new Date(), { addSuffix: true }))
//=> "3 days ago"