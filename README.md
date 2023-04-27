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

## Selecting the right global chart:
Global charts are made by shifting data according to the hour angle of the data's longitude coordinates, so that the daily highs represent the maximum among the 24 hours between ~ local solar midnight. The dateline for these hour-angle adjusted charts is a vertical line  between hour angles +12 and -11. However, the real dateline is a non-straight line derived from local timezones, as shown on this [map](https://earthsky.org/upl/2016/02/Standard_World_Time_Zones.png). This means that in timezones outside of the the range \[-11, +12\], the local date label does not match the date label of the data corresponding to that days highs and lows. Instead, the local date label must be incremented forwards by one for timezones > -11, and one day back for timezones > +12.

### Specific Walkthrough:
For timezone UTC-12, the local highs for 01-02J refers to the chart that contains the highs for 01-02T12:00Z (01-02T00:00J) to 01-03T12:00Z (01:03T00:00J) in UTC-hour-angle +12, which is chart 01-03Z (see first bullet point below)

For timezone UTC+14, the local highs for 01-02J refers to the chart that contains the highs for 01-01T10:00Z (01-02T00:00J) to 01-02T10:00Z (01:03T00:00J)  in UTC-hour-angle -10, which is chart 01-01Z (see second bullet point below)

Due to UTC-hour-angle adjustmenthe chart for 01-02Z contains:
- at hour angle UTC+12, max from 01-01T12:00Z to 01-02T12:00Z
- at hour angle UTC-10, max from 01-02T10:00Z to 01-03T10:00Z
