/**
 *
 * WARNING!!!
 *
 * This file is the generated output of the delta/thematic resolver.
 * It is meant only or debugging purposes and should not be loaded directly.
 *
*/

        const config = {
          pageOverrides: {
      'aboutContent': {
          data: {"title":"About the Dashboard","description":"Visualization, Exploration, and Data Analysis (VEDA): Scalable and Interactive System for Science Data."},
          content: () => import('../mock/about.mdx')
        },
'sandbox-override': {
          data: {},
          content: () => import('../mock/sandbox-override.mdx')
        }
    }
        };

        export const getOverride = (key) => config.pageOverrides[key];

        export const thematics = {
      'agriculture': {
          data: {"id":"agriculture","name":"Agriculture","description":"Sed sed lectus vitae odio vestibulum mattis. Integer iaculis nisl lectus, vel aliquet nulla imperdiet in.","media":{"src":require('../mock/thematic/agriculture--cover.jpg'),"alt":"Maisernte","author":{"name":"no one cares","url":"https://unsplash.com/photos/l_5MJnbrmrs"}},"about":{"title":"Observing Agriculture","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit vitae ornare lectus."}},
          content: () => import('../mock/thematic/agriculture.thematic.mdx')
        },
'air-quality': {
          data: {"id":"air-quality","name":"Air Quality","description":"Sed sed lectus vitae odio vestibulum mattis. Integer iaculis nisl lectus, vel aliquet nulla imperdiet in.","media":{"src":require('../mock/thematic/air-quality--cover.jpg'),"alt":"White clouds.","author":{"name":"Keytion","url":"https://unsplash.com/photos/85Km1bnKUOE"}},"about":{"title":"Observing Air Quality","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit vitae ornare lectus."}},
          content: () => import('../mock/thematic/air-quality.thematic.mdx')
        },
'covid-19': {
          data: {"id":"covid-19","name":"COVID-19","description":"As communities around the world have changed their behavior in response to the spread of COVID-19, NASA satellites have observed changes in the environment.","media":{"src":require('../mock/thematic/covid-19--cover.jpg'),"alt":"3D rendering of the novel coronavirus observed under the microscope","author":{"name":"Fusion Medical Animation","url":"https://unsplash.com/photos/EAgGqOiDDMg"}},"about":{"title":"Observing COVID-19","description":"This experimental dashboard reflects a rapid response to COVID-19 that is currently underway and will continue to evolve as more data becomes available."}},
          content: () => import('../mock/thematic/covid-19.thematic.mdx')
        },
'void': {
          data: {"id":"void","name":"Void area","description":"This thematic area is going to be empty. No datatsets or discoveries","media":{"src":require('../mock/thematic/void-placeholder.jpg'),"alt":"Light streaks pointing to a persons silhouette","author":{"name":"Alexis Fauvet","url":"https://unsplash.com/photos/L-3oTJhmsW4"}},"about":{"title":"The void","description":"Emptyness through and through"}},
          content: () => import('../mock/thematic/void.thematic.mdx')
        }
    };
        export const datasets = {
      'nighttime-lights': {
          data: {"featuredOn":["agriculture"],"id":"nighttime-lights","name":"Nighttime Lights","description":"During the COVID-19 pandemic, researchers are using night light observations to track variations in energy use, migration, and transportation in response to social distancing and lockdown measures.","media":{"src":require('../mock/datasets/nighttime-lights--dataset-cover.jpg'),"alt":"Satellite image of Earth at night.","author":{"name":"NASA Earth Observatory","url":"https://earthobservatory.nasa.gov/images/90008/night-light-maps-open-up-new-applications"}},"thematics":["covid-19","agriculture"],"layers":[{"id":"nightlights-hd-monthly","stacCol":"nightlights-hd-monthly","name":"Nightlights Monthly","type":"raster","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sodales semper risus, suscipit varius diam facilisis non.","zoomExtent":[4,16],"sourceParams":{"bidx":1,"colormap_name":"inferno","rescale":[0,255]},"legend":{"type":"gradient","min":"Less","max":"More","stops":["#08041d","#1f0a46","#52076c","#f57c16","#f7cf39"]}}]},
          content: () => import('../mock/datasets/nighttime-lights.data.mdx')
        },
'no2': {
          data: {"id":"no2","name":"Nitrogen Dioxide","featuredOn":["covid-19"],"description":"Since the outbreak of the novel coronavirus, atmospheric concentrations of nitrogen dioxide have changed by as much as 60% in some regions.","usage":[{"url":"https://nasa-impact.github.io/veda-documentation/timeseries-stac-api.html","label":"Static notebook","title":"Time series using STAC API statistics endpoints"},{"url":"https://daskhub.veda.smce.nasa.gov/hub/user-redirect/git-pull?repo=https%3A%2F%2Fgithub.com%2Fnasa-impact%2Fveda-documentation&urlpath=lab%2Ftree%2Fveda-documentation%2Ftimeseries-stac-api.ipynb&branch=main","label":"SMCE DaskHub","title":"Time series using STAC API statistics endpoints"}],"media":{"src":require('../mock/datasets/no2--dataset-cover.jpg'),"alt":"Power plant shooting steam at the sky.","author":{"name":"Mick Truyts","url":"https://unsplash.com/photos/x6WQeNYJC1w"}},"thematics":["agriculture","air-quality","covid-19"],"layers":[{"id":"no2-monthly","stacCol":"no2-monthly","name":"No2","type":"raster","description":"Levels in 10¹⁵ molecules cm⁻². Darker colors indicate higher nitrogen dioxide (NO₂) levels associated and more activity. Lighter colors indicate lower levels of NO₂ and less activity.","zoomExtent":[0,20],"sourceParams":{"resampling_method":"bilinear","bidx":1,"color_formula":"gamma r 1.05","colormap_name":"coolwarm","rescale":[0,15000000000000000]},"compare":{"datasetId":"no2","layerId":"no2-monthly","mapLabel":({ dateFns, datetime, compareDatetime }) => {
  return `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`;
}
},"legend":{"type":"gradient","min":"Less","max":"More","stops":["#99c5e0","#f9eaa9","#f7765d","#c13b72","#461070","#050308"]}},{"id":"no2-monthly-diff","stacCol":"no2-monthly-diff","name":"No2 (Diff)","type":"raster","description":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sodales semper risus, suscipit varius diam facilisis non.","zoomExtent":[0,20],"sourceParams":{"resampling_method":"bilinear","bidx":1,"colormap_name":"rdbu_r","rescale":[-8000000000000000,8000000000000000]},"compare":{"datasetId":"no2","layerId":"no2-monthly-diff","mapLabel":({ dateFns, datetime, compareDatetime }) => {
  return `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`;
}
},"legend":{"type":"gradient","min":"< -3","max":"> 3","stops":["#3A88BD","#C9E0ED","#E4EEF3","#FDDCC9","#DD7059"]}}]},
          content: () => import('../mock/datasets/no2.data.mdx')
        },
'sandbox': {
          data: {"featuredOn":["agriculture","air-quality"],"id":"sandbox","name":"Sandbox","description":"Travel restrictions and lockdown measures have disrupted the shipping industry and the global economy broadly. NASA researchers are using artificial intelligence to track shipping activities across major ports in the U.S.","media":{"src":require('../mock/datasets/img-placeholder-4.jpg'),"alt":"Generic placeholder by Unsplash","author":{"name":"Unsplash","url":"https://unsplash.com/"}},"thematics":["agriculture","covid-19"],"layers":[{"id":"blue-tarp-planetscope","stacCol":"blue-tarp-planetscope","name":"Blue tarp test","type":"raster","description":"Blue tarp tests","zoomExtent":[10,20]},{"id":"hls-s30-002-ej","stacCol":"hls-s30-002-ej","name":"HLS","type":"raster","description":"Testing HLS","zoomExtent":[10,16],"sourceParams":{"post_process":"swir","assets":["B12","B8A","B04"]}},{"id":"social-vul-1","stacCol":"social-vulnerability-index-household","name":"Household and Disability Score","type":"raster","description":"Household Composition & Disability (Aged 65 or Older, Aged 17 or Younger, Civilian with a Disability, Single-Parent Households) - Percentile ranking","projection":{"name":"lambertConformalConic","center":[0,30],"parallels":[30,30]},"zoomExtent":[2,16],"sourceParams":{"resampling_method":"bilinear","bidx":1,"colormap_name":"oranges","rescale":[0,1]},"compare":{"datasetId":"sandbox","layerId":"social-vul-1","mapLabel":({ dateFns, datetime, compareDatetime }) => {
  return `${dateFns.format(datetime, 'LLL yyyy')} VS ${dateFns.format(compareDatetime, 'LLL yyyy')}`;
}
},"legend":{"type":"gradient","min":"0","max":"1","stops":["#fff5eb","#fdd9b4","#fda762","#f3701b","#c54102","#7f2704"]}},{"id":"social-vul-2","stacCol":"social-vulnerability-index-household","name":"Household and Disability Score 2","type":"raster","description":"Household Composition & Disability (Aged 65 or Older, Aged 17 or Younger, Civilian with a Disability, Single-Parent Households) - Percentile ranking","zoomExtent":[2,16],"sourceParams":{"resampling_method":"bilinear","bidx":1,"colormap_name":"blues","rescale":[0,0.5]},"legend":{"type":"gradient","min":"0","max":"1","stops":["#ffffff","#0000ff"]}},{"id":"epa-annual-emissions_1b1a_coal_mining_underground","stacCol":"EPA-annual-emissions_1B1a_Coal_Mining_Underground","name":"Underground Coal Mines","type":"raster","description":"Emissions from sector 1B1a from underground coal mining.","zoomExtent":[0,20],"sourceParams":{"colormap_name":"rainbow","rescale":[0,2022634652958],"nodata":0},"legend":{"type":"gradient","min":0,"max":2022634652958,"stops":["#60007d","#30137d","#1960ae","#7ac300","#f2ce00","#ef6a01","#cc0019"]}},{"id":"dev-fail","stacCol":"dev-fail","name":"Failing layer","type":"raster"}],"related":[{"type":"dataset","id":"no2","thematic":"covid-19"},{"type":"discovery","id":"air-quality-and-covid-19","thematic":"covid-19"}]},
          content: () => import('../mock/datasets/sandbox.data.mdx')
        }
    };
        export const discoveries = {
      'air-quality-and-covid-19': {
          data: {"featuredOn":["covid-19"],"id":"air-quality-and-covid-19","name":"Air Quality and COVID-19","description":"When governments began implementing shutdowns at the start of the COVID-19 pandemic, scientists wondered how the atmosphere would respond to the sudden change in human behavior.","media":{"src":require('../mock/discoveries/air-quality-and-covid-19--discovery-cover.jpg'),"alt":"Clear nightsky with crescent moon above the mountains","author":{"name":"Benjamin Voros","url":"https://unsplash.com/photos/U-Kty6HxcQc"}},"pubDate":"2020-12-01T00:00:00.000Z","thematics":["air-quality","covid-19"]},
          content: () => import('../mock/discoveries/air-quality-and-covid-19.discoveries.mdx')
        },
'life-of-water': {
          data: {"featuredOn":["agriculture"],"id":"life-of-water","name":"This is the life of water","description":"Sed sed lectus vitae odio vestibulum mattis. Integer iaculis nisl lectus, vel aliquet nulla imperdiet in.","media":{"src":require('../mock/discoveries/img-placeholder-6.jpg'),"alt":"Generic placeholder by Unsplash","author":{"name":"Unsplash","url":"https://unsplash.com/"}},"pubDate":"2022-02-09T00:00:00.000Z","thematics":["agriculture"],"related":[{"type":"dataset","id":"no2","thematic":"covid-19"},{"type":"discovery","id":"air-quality-and-covid-19","thematic":"covid-19"},{"type":"thematic","id":"covid-19"}]},
          content: () => import('../mock/discoveries/life-of-water.discoveries.mdx')
        }
    };

        // Create thematics list.
        // Merge datasets and discoveries with respective thematics.
        const toDataArray = (v) => Object.values(v).map(d => d.data);

        export default toDataArray(thematics).map((t) => {
          const filterFn = (d) => d.id && d.thematics?.includes(t.id);
          return {
            ...t,
            datasets: toDataArray(datasets).filter(filterFn),
            discoveries: toDataArray(discoveries).filter(filterFn)
          };
        });
      