# w4h-frontend
React frontend for [weatherforhumans.com](https://www.weatherforhumans.com): a site providing forecasts of [Universal Thermal Climate Index](https://utci.lobelia.earth/what-is-utci) (UTCI) and [Wet Bulb Globe Temperature](https://www.weather.gov/news/211009-WBGT) (WBGT) using data from the [Global Forecast System](https://www.ncei.noaa.gov/products/weather-climate-models/global-forecast) (GFS)

## Some nice features:
- Client-side control of image-cache: 
	 - global chart images are updated only once new images are fully loaded, resulting in zero loss of data display during transmission or network interruptions
	 - chart images for the date before and the date after the currently visible date are pre-loaded once the visible image has been fetched
- Designed with international use in-mind:
	- language-sensitive formatting of dates and times
	- accurate selection of the global chart that displays the daily highs or lows for the selected date in the user's timezone (see notes on "selecting the right global chart" below)
- Stays updated with the latest data:
	- polls the backend for a "status" every 5 minutes, which lists the latest available forecasts and global charts. If newer charts or forecasts are available, they are fetched and replace the old data only once fully loaded
 - Search errors always animate into view: try searching "asdfghjkl", scroll down enough to hide the error from view, then search "indian ocean"
 - Designed for any screen 320px or larger: try clicking "show key" on the global chart and slowly resize your browser from its full width down to 320px
 - Click on a day on a forecast and the chart animates to an hourly view from the start of that day. Click again to animate back to the daily view. Works from any horizontal scroll position. To avoid a dizzyingly busy animation, horizontal gridlines are static and x-axis labels are hidden before animation and fade back in after.
 - Forecast labels stay in view when possible, and fade out when they would otherwise be partially obscured
 - Users can pin forecasts to create and persist a dashboard of forcasts across local browser sessions without needed to create an account
