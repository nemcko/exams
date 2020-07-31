import { Component, ViewChild, ElementRef, HostListener, Input, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
declare let $: any;
import { } from "googlemaps";

//https://nominatim.openstreetmap.org/search?q=slavnica&format=json
@Component({
  selector: 'place',
  template: `
  <input #searchElement class="controls" type="text" placeholder="Enter a location" value="">
  <div #gmap style="width:100%;height:400px"></div>
  <div #searchDetail></div>
  <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=places" async defer></script>
  <script>
  function initMap(){   
    window['angularComponent'].zone.run(() => {
      runThisFunctionFromOutside(); 
    });
  }  
  </script>
  `,
  styles: [`
  :host {  
    width: 100%; 
    height: 100%; 
  }

  #map, #details {
    width:100%;
    height:50%;
  }
  
  #details {
    background: #efefef;
    color: #000;
    overflow:scroll;
    padding:.5rem;
  }
  #details strong {
    color: #c00;
  }
  
  .controls {
    background-color: #fff;
    border-radius: 2px;
    border: 1px solid transparent;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    font-family: Roboto;
    font-size: 15px;
    font-weight: 300;
    height: 29px;
    margin-left: 17px;
    margin-top: 10px;
    outline: none;
    padding: 0 11px 0 13px;
    text-overflow: ellipsis;
    width: 400px;
  }
  
  .controls:focus {
    border-color: #4d90fe;
  }
  
  `],

})
export class PlaceComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() latitude: number = 48.99823049999999;
  @Input() longitude: number = 18.17737790000001;

  @ViewChild('gmap') gmapElement: any;
  public map: google.maps.Map;
  @ViewChild('searchElement') private _searchElement: ElementRef;
  @ViewChild('searchDetail') private _searchDetail: ElementRef;

  protected autocomplete: google.maps.places.Autocomplete;
  protected infowindow: google.maps.InfoWindow;
  protected marker: google.maps.Marker;
  protected placesService: google.maps.places.PlacesService;
  protected place: google.maps.places.PlaceResult;

  protected placeId: string;

  constructor(private _ngZone: NgZone) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    let options = {
      types: ['(cities)']
    };

    // if (typeof(google) != 'undefined') {
    //   $('input.loc_autocomplete').each(function(idx, el) {
    //     new google.maps.places.Autocomplete(el, options);
    //   });
    // }


    let position = new google.maps.LatLng(this.latitude, this.longitude);
    this.map = new google.maps.Map(this.gmapElement.nativeElement, {
      center: {
        lat: this.latitude,
        lng: this.longitude
      },
      zoom: 13,
      streetViewControl: false
    });

    this.infowindow = new google.maps.InfoWindow();
    this.marker = new google.maps.Marker({ 
      position: position, 
      map: this.map,
      title: 'Kukuk' 
    });

    this.marker.addListener('click', () => {
      this.infowindow.open(this.map, this.marker);
    });


    // let mapProp = {
    //   center: position,
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.TERRAIN
    // };
    // this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    // this.map.setCenter(position);

    // setTimeout(() => {
      /*
    this.autocomplete = new google.maps.places.Autocomplete(this._searchElement.nativeElement, options);
    this.autocomplete.bindTo('bounds', this.map);

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this._searchElement.nativeElement);


    this.autocomplete.addListener('place_changed', this.onSearchComplete);

    this.placesService = new google.maps.places.PlacesService(this.map);

    this.placesService.getDetails({
      placeId: this.place.place_id
    }, (place, status) => {
      this.placeId = this.place.place_id;
      // this.searchDetail..innerHTML = 
      //   '<p><strong>Place ID:</strong> <code>' + place.place_id + '</code></p>' +
      //   '<p><strong>Location:</strong> <code>' + place.geometry.location.lat() + ', ' + place.geometry.location.lng() + '</code></p>' +
      //   '<p><strong>Formatted address:</strong> <code>' + place.formatted_address + '</code></p>' +
      //   '<p><strong>GMap Url:</strong> <code>' + place.url + '</code></p>' +
      //   '<p><strong>Place details:</strong></p>' +
      //   '<pre>' + JSON.stringify(place, null, " ") + '</pre>';

    });
    // }, 1500);

*/
  }

  public onSearchComplete() {
    this.infowindow.close();
    let place = this.autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }
    this.placeId = this.place.place_id;


    if (place.geometry.viewport) {
      this.map.fitBounds(place.geometry.viewport);
    } else {
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location.
    this.marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    this.marker.setVisible(true);

    this.infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
      'Place ID: ' + place.place_id + '<br>' +
      place.formatted_address);

    this.infowindow.open(this.map, this.marker);

  }

}
