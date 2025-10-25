§kamen_20251024_105748
### →dani.maps
<!-- ※[caption](url "tooltip") -->
<!-- 🎥[video_caption](video_url "video_tooltip")-->
<!-- ▧[framework_caption](framework_url "framework_tooltip")-->

<details>
  <summary> Insert the map view sub-content</summary>

```
set  AppTitle: "Dani-Geo-Coins v4"

then
Split the Constants.ContentSection.MapPoints
into two subviews 
- one for the MapPointsList 
- another for MapPointsGeoView

Their layout should be dynamic as follows:
1) When the MapPoints parent content width is higher than the height:
  position the MapPointsList on the left and MapPointsGeoView on the right
2) When the MapPoints parent content height is higher than the width:
  position the MapPointsList on top and MapPointsGeoView on the bottom
The two subviews should occupy the entire area on their parent MapPoints content,
and the MapPointsList should behave as is it's anchor is set to Dock.Left (1) above) or Dock.Top (2) above)
And the width and height of MapPoiMapPointsList div should be configurable using the Config.MapPointsList{DockLeftWidth , DockTopHeight , MinRowsVisible, MinRowWidth}
If they are 0 or negative - the framework should automatically calculate them based on the MinRowsVisible for DockTopHeight and MinRowWidth (which could be autocalculated if possible) for autocalc DockLeftWidth.

The BotttoMenu for MapPoints should introduce buttons  that allow showing/hiding any of the subviews.
Config object would define which subviews are visible initially.
The Buttons are: 
1) List - when clicked - shows List subview only and the Map  and  L+M button 
2) Map - when clicked - shows Map subview only and the List and L+M button
3) L+M - when clicked - shows List and Map subviews and the Map and List button

in the MapPointsGeoView render the leaflet map using the  following html page as example:

v4\tutorials\leaflet\LeafletTutorial1.html

---
