module.exports = {
    "id": "power-meteorology",
    "type": "Collection",
    "links": [
    ],
    "title": "POWER Monthly Meteorological Dataset",
    "assets": {
        "zarr": {
            "href": "s3://power-analysis-ready-datastore/power_901_monthly_meteorology_utc.zarr",
            "type": "application/vnd+zarr",
            "roles": [
                "data",
                "zarr"
            ],
            "title": "power-meteorology Zarr root",
            "description": "",
            "xarray:open_kwargs": {
                "chunks": {},
                "engine": "zarr",
                "consolidated": true
            }
        }
    },
    "extent": {
        "spatial": {
            "bbox": [
                [
                    -180,
                    -90,
                    180,
                    90
                ]
            ]
        },
        "temporal": {
            "interval": [
                [
                    "1981-01-31T12:00:00Z",
                    "2021-12-31T12:00:00Z"
                ]
            ]
        }
    },
    "license": "CC0-1.0",
    "description": "",
    "stac_version": "1.0.0",
    "cube:variables": {
        "TS_MAX_AVG": {
            "type": "data",
            "unit": "temperature",
            "attrs": {
                "units": "temperature",
                "long_name": "ADD ME"
            },
            "shape": [
                492,
                361,
                576
            ],
            "chunks": [
                492,
                25,
                25
            ],
            "dimensions": [
                "time",
                "lat",
                "lon"
            ],
            "description": "The average temperature at the earth's surface."
        }
    },
    "cube:dimensions": {
        "lat": {
            "axis": "y",
            "type": "spatial",
            "extent": [
                -90,
                90
            ],
            "description": "latitude",
            "reference_system": 4326
        },
        "lon": {
            "axis": "x",
            "type": "spatial",
            "extent": [
                -180,
                179.4
            ],
            "description": "longitude",
            "reference_system": 4326
        },
        "time": {
            "step": "P1DT0H0M0S",
            "type": "temporal",
            "extent": [
                "1981-01-31T12:00:00Z",
                "2021-12-31T12:00:00Z"
            ],
            "description": "time"
        }
    },
    "stac_extensions": [
        "https://stac-extensions.github.io/datacube/v2.0.0/schema.json"
    ],
    "dashboard:is_periodic": true,
    "dashboard:time_density": "month",
    "summaries": {
        "datetime": [
            "1981-01-31T12:00:00Z",
            "2021-12-31T12:00:00Z"            
        ]
    }
}
