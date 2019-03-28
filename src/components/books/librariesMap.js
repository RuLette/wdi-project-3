import React from 'react'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN

import Auth from '../../lib/auth'

class LibrariesMap extends React.Component {
  constructor() {
    super()

    this.markers = []
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapDiv,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: this.props.center,
      zoom: 14.5
    })

    this.map.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken
    }))

    this.setLibraryMarkers()
  }

  setLibraryMarkers() {
    console.log(Auth.getPayload().sub)
    const libraries = this.props.points.filter(library => library._id !== Auth.getPayload().sub )
    console.log(libraries)
    this.markers = this.props.points.map(point => {
      const customMarker = document.createElement('div')
      customMarker.className = 'marker-libraries'

      const markerText = document.createElement('span')
      markerText.innerHTML = point.books.length

      customMarker.appendChild(markerText)

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <h2>${point.libraryName}</h2>
          <p>Number of books: ${point.books.length}</p>
        `)

      return new mapboxgl.Marker(customMarker)
        .setLngLat(point.location)
        .setPopup(popup)
        .addTo(this.map)
    })
  }

  setUserMarker() {
    return new mapboxgl.Marker()
      .setLngLat(this.props.center)
      .addTo(this.map)
  }


  render() {
    return (
      <div className="map-libraries" ref={el => this.mapDiv = el} />
    )
  }
}

export default LibrariesMap
