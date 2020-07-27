import { Component, OnInit, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

import OlTileLayer from 'ol/layer/tile';
import OlMap from 'ol/map';
import OlOverlay from 'ol/overlay';
import OlXYZ from 'ol/source/xyz';
import OlView from 'ol/view';
import OlMousePosition from 'ol/control/MousePosition';
import OlOverviewMap from 'ol/control/OverviewMap';
import OlFeature from 'ol/Feature';
import OlPoint from 'ol/geom/Point';
import OlProjection from 'ol/proj/Projection';
import { fromLonLat } from 'ol/proj';
import { coordinate } from 'ol/coordinate';
import { createStringXY } from 'ol/coordinate';
import { defaults as defaultControls, Control } from 'ol/control';
import * as Geocoder from 'ol-geocoder';
import * as OlProj from 'ol/proj.js';
import OlVectorSource from 'ol/source/Vector';
import OlVectorLayer from 'ol/layer/Vector';

import { ApiModel } from '../../api.model';


@Component({
  selector: 'streetmap',
  template: `
<div #olmap></div>
<div #olposition class="olposition"></div>
<div #olmarker class="marker"></div>
  `,
  styles: [`
  .olposition {
    display: inline-block;
    position: fixed;
    height: 20px;
    left: calc(100% - 150px);
    width: 150px;
  }
  .marker {
    width: 20px;
    height: 20px;
    border: 1px solid black;
    border-radius: 10px;
    background-color: red;
    opacity: 0.8;
  }
  `]
})
export class StreetMapComponent implements OnInit {
  oladdress: ApiModel.OlAddress = <ApiModel.IOlAddress>{};

  olmap: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;
  marker: OlOverlay;
  projection: OlProj = OlProj;

  @ViewChild('olmap') private _map: ElementRef;
  @ViewChild('olposition') private _position: ElementRef;
  @ViewChild('olmarker') private _marker: ElementRef;

  @Input() lat: number;
  @Input() lon: number;
  @Input() placeholder: string;
  @Input() lng: string;
  @Output() onAddress = new EventEmitter<ApiModel.IOlAddress>();

  toCoordinate(lan: string | number, lot: string | number): coordinate {
    if (this.olmap)
      return this.projection.transform([parseFloat(lan + ''), parseFloat(lot + '')], 'EPSG:4326', this.olmap.getView().getProjection());
    else
      return this.projection.transform([parseFloat(lan + ''), parseFloat(lot + '')], 'EPSG:4326', 'EPSG:3857');
  }

  toLonLat(coord: coordinate) {
    return this.projection.toLonLat(coord);
  }

  ngOnInit() {
    let self = this;
    this.oladdress.lat = this.lat;
    this.oladdress.lon = this.lon;

    let mousePositionControl = new OlMousePosition({
      coordinateFormat: createStringXY(6),
      projection: 'EPSG:4326',
      className: 'custom-mouse-position',
      target: this._position.nativeElement,
      undefinedHTML: '&nbsp;'
    });
    this.source = new OlXYZ({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
    });

    this.layer = new OlTileLayer({
      source: this.source
    });

    this.view = new OlView({
      center: this.toCoordinate(this.oladdress.lon, this.oladdress.lat),
      zoom: 17
    });

    this.olmap = new OlMap({
      target: this._map.nativeElement,
      layers: [this.layer],
      view: this.view,
      controls: defaultControls({
        attributionOptions: {
          // collapsible: true
        }
      }).extend([mousePositionControl, new OlOverviewMap()]),
    });

    this.marker = new OlOverlay({
      position: this.toCoordinate(this.oladdress.lon, this.oladdress.lat),
      positioning: 'center-center',
      element: this._marker.nativeElement,
      stopEvent: false
    });
    this.olmap.addOverlay(this.marker);

    this.olmap.on('click', function (args) {
      // self.reverseGeocoding(args.coordinate);
    });


    let geocoder = new Geocoder('nominatim', {
      provider: 'osm',
      targetType: 'text-input',
      lang: this.lng,
      placeholder: this.placeholder,
      limit: 10,
      keepOpen: true
    });

    this.olmap.addControl(geocoder);
    geocoder.on('addresschosen', function (evt) {
      self.reverseGeocoding(evt.coordinate);
    });


    window.setTimeout(() => {
      self.reverseGeocoding(self.toCoordinate(self.lon, self.lat), true);
    }, 500);

}

reverseGeocoding(coord: coordinate, showPos: boolean = false) {
  let lonlat = this.toLonLat(coord);
  let self = this;
  fetch('http://nominatim.openstreetmap.org/reverse?format=jsonv2&lon=' + lonlat[0] + '&lat=' + lonlat[1]).then(function (response) {
    return response.json();
  }).then(function (json) {
    self.oladdress.display_name = json.display_name;
    self.oladdress.lon = parseFloat(json.lon);
    self.oladdress.lat = parseFloat(json.lat);
    self.oladdress.street = json.address.street || '';
    self.oladdress.house_number = json.address.house_number || '';
    self.oladdress.postcode = json.address.postcode || '';
    self.oladdress.city = json.address.city_district || '';
    self.oladdress.country = json.address.country || '';
    self.oladdress.country_code = json.address.country_code || '';

    if (showPos)
      self.marker.setPosition(self.toCoordinate(self.oladdress.lon, self.oladdress.lat));

    self.onAddress.emit(self.oladdress);
  })
}

}
