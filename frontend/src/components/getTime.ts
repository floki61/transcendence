export const getTime = (date1: Date, date2: Date) => {
	const diffInMs = Math.abs(date2.getTime() - date1.getTime());
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Difference in hours
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // Difference in hours
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Difference in days
	const diffInWeeks = Math.floor(diffInDays / 7); // Difference in weeks
	const diffInMonths = Math.floor(diffInDays / 30); // Approximate difference in months
  
	// Return the time difference in different units
	return {
	  minutes: diffInMinutes,
	  hours: diffInHours,
	  days: diffInDays,
	  weeks: diffInWeeks,
	  months: diffInMonths,
	};
};