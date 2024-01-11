var $4xljF$reactjsxruntime = require("react/jsx-runtime");
var $4xljF$react = require("react");
var $4xljF$d3 = require("d3");
var $4xljF$d3scalechromatic = require("d3-scale-chromatic");
var $4xljF$styledcomponents = require("styled-components");
var $4xljF$devseeduithemeprovider = require("@devseed-ui/theme-provider");
var $4xljF$recharts = require("recharts");
var $4xljF$reactcooldimensions = require("react-cool-dimensions");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

$parcel$export(module.exports, "BlockChart", function () { return $9bcf144ec7818985$export$2e2bcd8739ae039; });





function $32e8f6e70cff9e35$export$2077e0241d6afd3c(value, decimals = 2) {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
function $32e8f6e70cff9e35$export$7ecd32ca6b3ae583(value, decimals = 2) {
    if (value / 1e9 >= 1) return {
        num: $32e8f6e70cff9e35$export$2077e0241d6afd3c(value / 1e9, decimals),
        unit: "B"
    };
    else if (value / 1e6 >= 1) return {
        num: $32e8f6e70cff9e35$export$2077e0241d6afd3c(value / 1e6, decimals),
        unit: "M"
    };
    else if (value / 1e3 >= 1) return {
        num: $32e8f6e70cff9e35$export$2077e0241d6afd3c(value / 1e3, decimals),
        unit: "K"
    };
    return {
        num: value,
        unit: ""
    };
}
function $32e8f6e70cff9e35$export$aa9294712332dc16(num, options) {
    const opts = {
        decimals: 2,
        separator: ",",
        forceDecimals: false,
        shorten: false,
        ...options
    }; // isNaN(null) === true
    if (isNaN(num) || !num && num !== 0) return "--";
    const repeat = (char, length)=>{
        let str = "";
        for(let i = 0; i < length; i++)str += char + "";
        return str;
    };
    const sign = num < 0 ? "-" : "";
    const absNum = Math.abs(num);
    let [int, dec] = Number($32e8f6e70cff9e35$export$2077e0241d6afd3c(absNum, opts.decimals)).toString().split(".");
    let largeNumUnit = "";
    if (opts.shorten) {
        const { num: num1 , unit: unit  } = $32e8f6e70cff9e35$export$7ecd32ca6b3ae583(Number(int), 0);
        int = num1.toString();
        largeNumUnit = unit;
    } // Space the integer part of the number.
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, opts.separator); // Round the decimals.
    dec = (dec || "").substring(0, opts.decimals); // Add decimals if forced.
    dec = opts.forceDecimals ? `${dec}${repeat(0, opts.decimals - dec.length)}` : dec;
    return dec !== "" ? `${sign}${int}.${dec} ${largeNumUnit}` : `${sign}${int} ${largeNumUnit}`;
}
function $32e8f6e70cff9e35$export$3cdc770bf8b2ed3d(num, length = 2) {
    const prefix = num < 0 ? "-" : "";
    const abdsNum = Math.abs(num);
    const wholeNum = Math.floor(abdsNum);
    const padLength = Math.max(length - String(wholeNum).length, 0);
    const pads = new Array(padLength + 1).join("0");
    return prefix + pads + abdsNum;
}
function $32e8f6e70cff9e35$export$a5c7fd3700da7bdd(num, decimals = 2) {
    if (!isFinite(num)) return `${Math.sign(num) === -1 ? "-" : ""}∞`;
    const [coefficient, exponent] = num.toExponential().split("e").map((item)=>Number(item));
    const sups = "⁰\xb9\xb2\xb3⁴⁵⁶⁷⁸⁹";
    const exponentSup = Math.abs(exponent).toString().split("").map((v)=>sups[v]).join("");
    const sign = exponent < 0 ? "⁻" : "";
    return `${$32e8f6e70cff9e35$export$2077e0241d6afd3c(coefficient, decimals)}x10${sign}${exponentSup}`;
}






class $df0edcff7a0fbd2f$export$5e2fc0291e57f772 extends Error {
    constructor(message, hints = []){
        super(message);
        this.hints = hints;
    }
}
const $df0edcff7a0fbd2f$export$5f71c1e53eaf1d93 = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "hinted-error__ErrorBlock",
    componentId: "sc-k8xz19-0"
})([
    "margin:",
    ";padding:",
    ";"
], (0, $4xljF$devseeduithemeprovider.glsp)(1, 0), (0, $4xljF$devseeduithemeprovider.glsp)(0, 1));
const $df0edcff7a0fbd2f$export$8a35684520b35731 = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "hinted-error__ErrorBlockInner",
    componentId: "sc-k8xz19-1"
})([
    "width:100%;color:",
    ";border:3px solid ",
    ";padding:",
    ";> div{max-width:48rem;margin:0 auto;> *{display:block;}}"
], (0, $4xljF$devseeduithemeprovider.themeVal)("color.danger"), (0, $4xljF$devseeduithemeprovider.themeVal)("color.danger"), (0, $4xljF$devseeduithemeprovider.glsp)(3));
const $df0edcff7a0fbd2f$export$3beebeb686a5eb38 = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "hinted-error__ErrorHints",
    componentId: "sc-k8xz19-2"
})([
    "margin-top:",
    ";color:",
    ";pre{font-size:0.875rem;}"
], (0, $4xljF$devseeduithemeprovider.glsp)(), (0, $4xljF$devseeduithemeprovider.themeVal)("color.base"));
const $df0edcff7a0fbd2f$var$ErrorSubtitle = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "hinted-error__ErrorSubtitle",
    componentId: "sc-k8xz19-3"
})([
    "color:",
    ";font-size:0.875rem;"
], (0, $4xljF$devseeduithemeprovider.themeVal)("color.base"));
function $df0edcff7a0fbd2f$export$295970e1d7fe83c4(props) {
    const { className: className , hints: hints , message: message , title: title , subtitle: subtitle  } = props;
    return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($df0edcff7a0fbd2f$export$5f71c1e53eaf1d93, {
        className: className,
        children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($df0edcff7a0fbd2f$export$8a35684520b35731, {
            children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)("div", {
                children: [
                    /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("small", {
                        children: title
                    }),
                    /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("strong", {
                        children: message
                    }),
                    subtitle && /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($df0edcff7a0fbd2f$var$ErrorSubtitle, {
                        children: subtitle
                    }),
                    !!hints?.length && /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)($df0edcff7a0fbd2f$export$3beebeb686a5eb38, {
                        children: [
                            /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("p", {
                                children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("strong", {
                                    children: "Hints:"
                                })
                            }),
                            hints.map((e, i)=>typeof e === "string" ? /* eslint-disable-next-line react/no-array-index-key */ /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("p", {
                                    children: e
                                }, i) : /* eslint-disable-next-line react/no-array-index-key */ /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$react.Fragment), {
                                    children: e
                                }, i))
                        ]
                    })
                ]
            })
        })
    });
}
const $df0edcff7a0fbd2f$export$ee7e8e40289d22e = /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)("p", {
    children: [
        "\uD83D\uDCDC Find all documentation in our",
        " ",
        /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("a", {
            href: "https://github.com/NASA-IMPACT/veda-config/blob/main/docs/MDX_BLOCKS.md",
            target: "_blank",
            rel: "noreferrer nofollow",
            children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("strong", {
                children: "Github repo"
            })
        }),
        "."
    ]
});


const $555a761aa876ed68$export$5a00511f040384d7 = (time, dateFormat)=>{
    return $555a761aa876ed68$export$406508d2ca449bd(new Date(time), dateFormat);
};
const $555a761aa876ed68$export$406508d2ca449bd = (date, dateFormat)=>{
    const format = (0, $4xljF$d3.timeFormat)(dateFormat);
    return format(date);
};
const $555a761aa876ed68$export$6bcf10fa924b8f90 = ({ timeString: timeString , dateFormat: dateFormat  })=>{
    if (!timeString) return undefined;
    const parseDate = (0, $4xljF$d3.timeParse)(dateFormat);
    if (!parseDate(timeString)) throw new (0, $df0edcff7a0fbd2f$export$5e2fc0291e57f772)(`Failed to parse time with the dateFormat provided: ${dateFormat}.`, [
        `The data has "${timeString}" as value.`,
        `Please check if you are using the right time format: https://github.com/d3/d3-time-format.`
    ]);
    return parseDate(timeString)?.getTime();
};
function $555a761aa876ed68$export$ab9a23b9671556a6({ timeSeriesData: timeSeriesData , dates: dates , dateFormat: dateFormat , uniqueKeys: uniqueKeys ,  }) {
    /* eslint-disable-next-line fp/no-mutating-methods */ return timeSeriesData.map((e, idx)=>{
        const currentStat = e;
        const date = $555a761aa876ed68$export$6bcf10fa924b8f90({
            timeString: dates[idx],
            dateFormat: dateFormat
        }) ?? 0;
        return {
            date: date,
            dateFormat: dateFormat,
            ...uniqueKeys.reduce((acc, curr)=>{
                return {
                    ...acc,
                    [curr.label]: currentStat[curr.value]
                };
            }, {})
        };
    }).sort((a, b)=>a.date - b.date);
}
function $555a761aa876ed68$export$776836780a938436({ data: data , idKey: idKey , xKey: xKey , yKey: yKey , dateFormat: dateFormat  }) {
    // Throw an error if no key is found.
    const columnErrors = [
        xKey,
        yKey,
        idKey
    ].map((key)=>({
            key: key,
            noErr: Object.keys(data[0]).includes(key)
        })).filter((e)=>!e.noErr).map((e)=>`"${e.key}" is not found in columns. Please check if the data has "${e.key}" column.`);
    if (columnErrors.length > 0) throw new (0, $df0edcff7a0fbd2f$export$5e2fc0291e57f772)("Key not found", columnErrors); // Check sensitivity value
    const collator = new Intl.Collator("en", {
        numeric: true
    });
    /* eslint-disable-next-line fp/no-mutating-methods */ const uniqueKeys = [
        ...Array.from(new Set(data.map((d)=>d[idKey])))
    ].sort(collator.compare); // Format csv/json data into chart suitable data
    // ## From:
    // {
    //   "xkey": xKey value,
    //   "yKey": yKey value,
    //   "idKey": idKey value
    // }
    // ## to
    // {
    //   "xkey": xKey value,
    //   "idKey value": yKey value
    // }
    // This reduce function will yield an object with x values as keys / data units as values
    // we will use the values of this object
    const fData = data.reduce((keyObject, entry)=>{
        if (!keyObject[entry[xKey]]) keyObject[entry[xKey]] = {
            date: $555a761aa876ed68$export$6bcf10fa924b8f90({
                timeString: entry[xKey],
                dateFormat: dateFormat
            }),
            [entry[idKey]]: parseFloat(entry[yKey])
        };
        else keyObject[entry[xKey]] = {
            ...keyObject[entry[xKey]],
            [entry[idKey]]: parseFloat(entry[yKey])
        };
        return keyObject;
    }, {});
    return {
        uniqueKeys: uniqueKeys,
        fData: Object.values(fData)
    };
}
function $555a761aa876ed68$var$getInterpolateFunction(colorScheme) {
    const fnName = `interpolate${colorScheme[0].toUpperCase() + colorScheme.slice(1)}`;
    return $4xljF$d3scalechromatic[fnName];
}
const $555a761aa876ed68$export$6cee60e8aa85e528 = function({ steps: steps , colorScheme: colorScheme = "viridis"  }) {
    const colorFn = $555a761aa876ed68$var$getInterpolateFunction(colorScheme);
    return new Array(steps).fill(0).map((e, idx)=>colorFn(idx / steps));
};
function $555a761aa876ed68$export$104b63ca24cf6df9(x) {
    if (x === undefined || isNaN(x)) return "n/a";
    if (x === 0) return "0"; // Between 0.001 and 1000 just round.
    if (Math.abs(x) < 1000 && Math.abs(x) >= 0.001) return (0, $32e8f6e70cff9e35$export$2077e0241d6afd3c)(x, 3).toString();
    return (0, $32e8f6e70cff9e35$export$a5c7fd3700da7bdd)(x);
}


const $7b9d438d36f20548$export$e975f927c24cf4a8 = 200;
const $7b9d438d36f20548$export$40697364cff166fb = 500;
const $7b9d438d36f20548$export$a9c4ee88674b7001 = 1.77; // 16:9
const $7b9d438d36f20548$export$6728fea658cfb92e = {
    top: 20,
    right: 30,
    left: 20,
    bottom: 20
};
const $7b9d438d36f20548$export$563283a51474d23c = "color.info-300a";
const $7b9d438d36f20548$export$7b93c9150739f7ee = "rgba(46, 134, 171, 0.32)";
const $7b9d438d36f20548$export$56d5855bc94e5e87 = /(?:\.([^.]+))?$/;
const $7b9d438d36f20548$export$9521120b43092a8d = 700;
const $7b9d438d36f20548$export$b4f2afed5884b447 = 50;
const $7b9d438d36f20548$export$c38fa016fa5e23fe = {
    with: {
        xAxisHeight: 50,
        labelOffset: -16
    },
    without: {
        xAxisHeight: 30,
        labelOffset: -5
    }
};











const $ff15672b36855f32$var$TooltipWrapper = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "tooltip__TooltipWrapper",
    componentId: "sc-yu7bps-0"
})([
    "background-color:",
    ";border:1px solid ",
    ";padding:",
    ";border-radius:",
    ";font-size:0.75rem;> div:not(:last-child){padding-bottom:",
    ";}"
], (0, $4xljF$devseeduithemeprovider.themeVal)("color.surface"), (0, $4xljF$devseeduithemeprovider.themeVal)("color.base-300a"), (0, $4xljF$devseeduithemeprovider.glsp)(0.5), (0, $4xljF$devseeduithemeprovider.themeVal)("shape.rounded"), (0, $4xljF$devseeduithemeprovider.glsp)(0.25));
const $ff15672b36855f32$export$a7b06bfba60a8a78 = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "tooltip__ListItem",
    componentId: "sc-yu7bps-1"
})([
    "width:12px;height:12px;background-color:",
    ";display:inline-block;margin-right:",
    ";"
], (props)=>props.color, (0, $4xljF$devseeduithemeprovider.glsp)(0.2));
const $ff15672b36855f32$var$TooltipItem = (0, ($parcel$interopDefault($4xljF$styledcomponents)))($ff15672b36855f32$export$a7b06bfba60a8a78).withConfig({
    displayName: "tooltip__TooltipItem",
    componentId: "sc-yu7bps-2"
})([
    "margin-right:",
    ";"
], (0, $4xljF$devseeduithemeprovider.glsp)(0.5));
function $ff15672b36855f32$export$2e2bcd8739ae039(props) {
    const { dateFormat: dateFormat , uniqueKeys: uniqueKeys , active: active , payload: payload , label: label  } = props;
    const inactiveKeys = uniqueKeys.filter((e)=>!e.active).map((e)=>e.label);
    if (active && payload && payload.length) return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)($ff15672b36855f32$var$TooltipWrapper, {
        children: [
            /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("div", {
                children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("strong", {
                    children: (0, $555a761aa876ed68$export$5a00511f040384d7)(label, dateFormat)
                })
            }),
            uniqueKeys.filter((key)=>!inactiveKeys.includes(key.label)).map((key)=>{
                const point = payload[0].payload[key.label];
                return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)("div", {
                    children: [
                        /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($ff15672b36855f32$var$TooltipItem, {
                            color: key.color
                        }),
                        /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("strong", {
                            children: key.label
                        }),
                        " ",
                        !!key.label.length && ":",
                        (0, $555a761aa876ed68$export$104b63ca24cf6df9)(point)
                    ]
                }, `${key.label}-key`);
            })
        ]
    });
    return null;
}




function $38e8fc58c3b6579f$export$2e2bcd8739ae039(props) {
    const { title: title , desc: desc  } = props;
    return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)((0, $4xljF$reactjsxruntime.Fragment), {
        children: [
            /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("title", {
                children: title
            }),
            /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)("desc", {
                children: desc
            })
        ]
    });
}








const $96acddacc9e95800$export$d2e34c56e9db10e3 = (0, ($parcel$interopDefault($4xljF$styledcomponents))).ul.withConfig({
    displayName: "legend__LegendWrapper",
    componentId: "sc-1alfkzc-0"
})([
    "margin:0 auto;margin-top:",
    ";text-align:center;",
    ";"
], (0, $4xljF$devseeduithemeprovider.glsp)(0.75), ({ width: width  })=>width && (0, $4xljF$styledcomponents.css)([
        "max-width:",
        "px;"
    ], width));
const $96acddacc9e95800$export$590bd3a1b15e3e13 = (0, ($parcel$interopDefault($4xljF$styledcomponents))).li.withConfig({
    displayName: "legend__LegendItem",
    componentId: "sc-1alfkzc-1"
})([
    "display:inline-flex;list-style:none;margin-right:",
    ";font-size:0.75rem;color:",
    ";*{align-self:center;}"
], (0, $4xljF$devseeduithemeprovider.glsp)(0.25), (0, $4xljF$devseeduithemeprovider.themeVal)("color.base-400"));
const $96acddacc9e95800$var$HighlightLabel = (0, ($parcel$interopDefault($4xljF$styledcomponents))).text.withConfig({
    displayName: "legend__HighlightLabel",
    componentId: "sc-1alfkzc-2"
})([
    "font-size:0.75rem;dominant-baseline:hanging;"
]);
const $96acddacc9e95800$var$HighlightLabelMarker = (0, ($parcel$interopDefault($4xljF$styledcomponents))).rect.withConfig({
    displayName: "legend__HighlightLabelMarker",
    componentId: "sc-1alfkzc-3"
})([
    "width:12px;height:12px;fill:",
    ";"
], (0, $4xljF$devseeduithemeprovider.themeVal)((0, $7b9d438d36f20548$export$563283a51474d23c)));
function $96acddacc9e95800$export$47c6a27fae70e16c(props) {
    const { width: width , highlightLabel: highlightLabel  } = props;
    return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)("g", {
        transform: `translate(${width ? width - 100 : 0}, 0) rotate(0)`,
        children: [
            /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($96acddacc9e95800$var$HighlightLabelMarker, {}),
            /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($96acddacc9e95800$var$HighlightLabel, {
                transform: "translate(15, 0)",
                children: highlightLabel
            })
        ]
    });
}
function $96acddacc9e95800$export$78003ba218df33f3(props) {
    const { payload: payload , width: width  } = props;
    if (payload) return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($96acddacc9e95800$export$d2e34c56e9db10e3, {
        width: width,
        children: payload.map((entry)=>/*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)($96acddacc9e95800$export$590bd3a1b15e3e13, {
                children: [
                    /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $ff15672b36855f32$export$a7b06bfba60a8a78), {
                        color: entry.color
                    }),
                    entry.value
                ]
            }, `item-${entry.value}`))
    });
    return null;
}











const $24ea36edb2a4e5b2$export$683480f191c0e3ea = (ref, { initialWidth: initialWidth  } = {})=>{
    const [width, setWidth] = (0, $4xljF$react.useState)(initialWidth ?? 0);
    (0, $4xljF$react.useEffect)(()=>{
        const observeTarget = ref.current;
        if (!observeTarget) return;
        const resizeObserver = new ResizeObserver((entries)=>{
            entries.forEach((entry)=>{
                setWidth(entry.contentRect.width);
            });
        });
        resizeObserver.observe(observeTarget);
        return ()=>{
            resizeObserver.unobserve(observeTarget);
        };
    }, [
        ref
    ]);
    return width;
};


/**
 * 
 * @param  {[Date, Date]} domain Overall domain for the brush
 * @param {[Date, Date]} currentValues Current start and end for the brush selection. This state needs to be managed from outside the hook.
 * @param {function} changeCallback Callback to call when user updated brush. Receives a [Date, Date] argument
 * @param {number} minBrushWidthPx Minimum Width of the brush allowed, defaults to 10
 * @returns {{ wrapperRef, onBrushMouseDown, containerStyles}} 
 */ function $388f3dba740979ca$var$useBrush(domain, currentValues, changeCallback, minBrushWidthPx = 10) {
    const wrapperRef = (0, $4xljF$react.useRef)(null);
    const [dragging, setDragging] = (0, $4xljF$react.useState)(null);
    const initialOffsetX = (0, $4xljF$react.useRef)(0);
    const wrapperWidth = (0, $24ea36edb2a4e5b2$export$683480f191c0e3ea)(wrapperRef, {
        initialWidth: 300
    });
    const scale = (0, $4xljF$react.useMemo)(()=>{
        return (0, $4xljF$d3.scaleTime)().domain(domain).range([
            0,
            wrapperWidth
        ]);
    }, [
        domain,
        wrapperWidth
    ]);
    const brushX = (0, $4xljF$react.useMemo)(()=>{
        return scale(currentValues[0]);
    }, [
        scale,
        currentValues
    ]);
    const brushWidth = (0, $4xljF$react.useMemo)(()=>{
        return scale(currentValues[1]) - scale(currentValues[0]);
    }, [
        scale,
        currentValues
    ]);
    const onBrushMouseDown = (0, $4xljF$react.useCallback)((e)=>{
        setDragging(e.target.dataset.role);
    }, []);
    const onBrushMouseUp = (0, $4xljF$react.useCallback)(()=>{
        setDragging(null);
        initialOffsetX.current = 0;
    }, []);
    const onBrushMouseMove = (0, $4xljF$react.useCallback)((e)=>{
        if (!dragging) return;
        const baseX = wrapperRef.current ? wrapperRef.current.getBoundingClientRect().x : 0;
        const wrapperOffsetedX = e.clientX - baseX;
        if (initialOffsetX.current === 0) initialOffsetX.current = e.offsetX;
        let newStart = currentValues[0];
        let newEnd = currentValues[1];
        if (dragging === "drag") {
            const dragOffsetedX = wrapperOffsetedX - initialOffsetX.current; // Check that drag is not going below or above range
            if (dragOffsetedX <= 0) {
                newStart = scale.invert(0);
                newEnd = scale.invert(brushWidth);
            } else if (dragOffsetedX + brushWidth > wrapperWidth) {
                newEnd = scale.invert(wrapperWidth);
                newStart = scale.invert(wrapperWidth - brushWidth);
            } else {
                newStart = scale.invert(dragOffsetedX);
                newEnd = scale.invert(dragOffsetedX + brushWidth);
            }
        } else {
            if (dragging === "start") {
                const currentEndX = scale(currentValues[1]);
                newStart = currentEndX - wrapperOffsetedX < minBrushWidthPx ? currentValues[0] : scale.invert(wrapperOffsetedX);
            } else {
                const currentStartX = scale(currentValues[0]);
                newEnd = wrapperOffsetedX - currentStartX < minBrushWidthPx ? currentValues[1] : scale.invert(wrapperOffsetedX);
            } // Check that drag start/end is not going below or above range
            newStart = newStart < domain[0] ? domain[0] : newStart;
            newEnd = newEnd > domain[1] ? domain[1] : newEnd;
        }
        changeCallback([
            newStart,
            newEnd
        ]);
    }, [
        dragging,
        changeCallback,
        scale,
        brushWidth,
        currentValues,
        domain,
        minBrushWidthPx,
        wrapperWidth
    ]);
    (0, $4xljF$react.useEffect)(()=>{
        document.addEventListener("mouseup", onBrushMouseUp);
        document.addEventListener("mousemove", onBrushMouseMove);
        return ()=>{
            document.removeEventListener("mouseup", onBrushMouseUp);
            document.removeEventListener("mousemove", onBrushMouseMove);
        };
    }, [
        onBrushMouseUp,
        onBrushMouseMove
    ]);
    const containerStyles = (0, $4xljF$react.useMemo)(()=>{
        return {
            left: `${brushX}px`,
            width: `${brushWidth}px`
        };
    }, [
        brushX,
        brushWidth
    ]);
    return {
        wrapperRef: wrapperRef,
        onBrushMouseDown: onBrushMouseDown,
        containerStyles: containerStyles
    };
}
var $388f3dba740979ca$export$2e2bcd8739ae039 = $388f3dba740979ca$var$useBrush;


const $1cb9a027733fd182$var$BrushWrapper = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "brush__BrushWrapper",
    componentId: "sc-1fi2de4-0"
})([
    "position:absolute;left:0;top:0;width:100%;"
]);
const $1cb9a027733fd182$var$BrushContainer = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "brush__BrushContainer",
    componentId: "sc-1fi2de4-1"
})([
    "position:absolute;top:0;height:",
    "px;"
], ({ height: height  })=>height);
const $1cb9a027733fd182$var$BrushComponent = (0, ($parcel$interopDefault($4xljF$styledcomponents))).button.withConfig({
    displayName: "brush__BrushComponent",
    componentId: "sc-1fi2de4-2"
})([
    "position:absolute;height:100%;padding:0;border:1px solid rgb(110,110,110);"
]);
const $1cb9a027733fd182$var$BrushTraveller = (0, ($parcel$interopDefault($4xljF$styledcomponents)))($1cb9a027733fd182$var$BrushComponent).withConfig({
    displayName: "brush__BrushTraveller",
    componentId: "sc-1fi2de4-3"
})([
    "width:7px;cursor:col-resize;z-index:1;padding:0;background:rgb(110,110,110);display:flex;justify-content:center;align-items:center;&:after{content:' ';border:1px solid white;opacity:0.7;width:3px;height:10px;display:block;border-top-width:0;border-bottom-width:0;}"
]);
const $1cb9a027733fd182$var$BrushTravellerStart = (0, ($parcel$interopDefault($4xljF$styledcomponents)))($1cb9a027733fd182$var$BrushTraveller).withConfig({
    displayName: "brush__BrushTravellerStart",
    componentId: "sc-1fi2de4-4"
})([
    "left:-3px;"
]);
const $1cb9a027733fd182$var$BrushTravellerEnd = (0, ($parcel$interopDefault($4xljF$styledcomponents)))($1cb9a027733fd182$var$BrushTraveller).withConfig({
    displayName: "brush__BrushTravellerEnd",
    componentId: "sc-1fi2de4-5"
})([
    "right:-3px;"
]);
const $1cb9a027733fd182$var$BrushDrag = (0, ($parcel$interopDefault($4xljF$styledcomponents)))($1cb9a027733fd182$var$BrushComponent).withConfig({
    displayName: "brush__BrushDrag",
    componentId: "sc-1fi2de4-6"
})([
    "width:100%;cursor:move;background:rgba(110,110,110,0.3);"
]);
function $1cb9a027733fd182$var$Brush(props) {
    const { availableDomain: availableDomain , brushRange: brushRange , onBrushRangeChange: onBrushRangeChange  } = props;
    const changeCallback = (0, $4xljF$react.useCallback)((newSelection)=>{
        onBrushRangeChange(newSelection);
    }, [
        onBrushRangeChange
    ]);
    const { onBrushMouseDown: onBrushMouseDown , wrapperRef: wrapperRef , containerStyles: containerStyles  } = (0, $388f3dba740979ca$export$2e2bcd8739ae039)(availableDomain, brushRange, changeCallback);
    return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($1cb9a027733fd182$var$BrushWrapper, {
        ref: wrapperRef,
        children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)($1cb9a027733fd182$var$BrushContainer, {
            height: (0, $7b9d438d36f20548$export$b4f2afed5884b447),
            onMouseDown: onBrushMouseDown,
            style: containerStyles,
            children: [
                /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($1cb9a027733fd182$var$BrushTravellerStart, {
                    "data-role": "start"
                }),
                /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($1cb9a027733fd182$var$BrushDrag, {
                    "data-role": "drag"
                }),
                /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($1cb9a027733fd182$var$BrushTravellerEnd, {
                    "data-role": "end"
                })
            ]
        })
    });
}
var $1cb9a027733fd182$export$2e2bcd8739ae039 = $1cb9a027733fd182$var$Brush;






let $b83a8f355fb4cece$var$scrollbarWidthCache;
function $b83a8f355fb4cece$export$ace028f8da1a6300() {
    if ($b83a8f355fb4cece$var$scrollbarWidthCache !== undefined) return $b83a8f355fb4cece$var$scrollbarWidthCache;
    const el = document.createElement("div");
    el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
    document.body.appendChild(el);
    const width = el.offsetWidth - el.clientWidth;
    el.remove();
    $b83a8f355fb4cece$var$scrollbarWidthCache = width;
    return width;
}
function $b83a8f355fb4cece$export$b9a207ff02cf03ea(varName = "--scrollbar-width") {
    (0, $4xljF$react.useEffect)(()=>{
        const width = $b83a8f355fb4cece$export$ace028f8da1a6300();
        document.documentElement.style.setProperty(varName, width + "px");
        return ()=>{
            document.documentElement.style.removeProperty(varName);
        };
    }, [
        varName
    ]);
}


function $7ab8f904dd46e1e3$export$32d5543ab307c01() {
    const theme = (0, $4xljF$styledcomponents.useTheme)();
    if (!theme.mediaRanges) throw new Error("There are no media ranges defined in the theme");
    const ranges = Object.entries(theme.mediaRanges); // Create breakpoints from media ranges.
    const breakpoints = (0, $4xljF$react.useMemo)(()=>ranges.reduce((acc, [breakpoint, [lowerBound]])=>({
                ...acc,
                [breakpoint]: lowerBound ?? 0
            }), {}), [
        ranges
    ]);
    const { observe: observe , currentBreakpoint: currentBreakpoint , width: calculatedWidth  } = (0, ($parcel$interopDefault($4xljF$reactcooldimensions)))({
        breakpoints: breakpoints,
        updateOnBreakpointChange: true
    });
    (0, $4xljF$react.useEffect)(()=>{
        observe(document.body);
    }, [
        observe
    ]); // Account for the scrollbar width because the css media queries will.
    const scrollbarWidth = (0, $b83a8f355fb4cece$export$ace028f8da1a6300)(); // On first mount react-cool-dimension will return a width of 0, which breaks
    // the media queries styles because there's a mismatch between the css media
    // queries and the js.
    const width = calculatedWidth + scrollbarWidth || (typeof window !== "undefined" ? window.innerWidth + scrollbarWidth : 0);
    const rangeBooleans = (0, $4xljF$react.useMemo)(()=>ranges.reduce((acc, [rangeKey, bounds])=>{
            const upper = `${rangeKey.charAt(0).toUpperCase()}${rangeKey.slice(1)}`;
            const makeKey = (b)=>`is${upper}${b}`;
            let [lBound, uBound] = bounds;
            lBound = lBound ?? -Infinity;
            uBound = uBound ?? Infinity;
            return {
                ...acc,
                [makeKey("Up")]: width >= lBound,
                [makeKey("Only")]: width >= lBound && width <= uBound,
                [makeKey("Down")]: width <= uBound
            };
        }, {}), [
        ranges,
        width
    ]);
    return (0, $4xljF$react.useMemo)(()=>({
            current: currentBreakpoint,
            ...rangeBooleans
        }), [
        currentBreakpoint,
        rangeBooleans
    ]);
}


const $5f7e20cca7ff1f78$var$LineChartWithFont = (0, ($parcel$interopDefault($4xljF$styledcomponents)))((0, $4xljF$recharts.LineChart)).withConfig({
    displayName: "chart__LineChartWithFont",
    componentId: "sc-dqmq3z-0"
})([
    "font-size:0.8rem;"
]);
const $5f7e20cca7ff1f78$var$ChartWrapper = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "chart__ChartWrapper",
    componentId: "sc-dqmq3z-1"
})([
    "width:100%;grid-column:1/-1;.label-y{text-anchor:middle;}"
]);
const $5f7e20cca7ff1f78$var$BrushContainer = (0, ($parcel$interopDefault($4xljF$styledcomponents))).div.withConfig({
    displayName: "chart__BrushContainer",
    componentId: "sc-dqmq3z-2"
})([
    "width:100%;position:relative;border:1px solid #efefef;border-radius:0.25rem;"
]);
function $5f7e20cca7ff1f78$var$CustomCursor(props) {
    // work around to disable cursor line when there is no matching index found
    // eslint-disable-next-line react/prop-types
    if (props.payloadIndex < 0) return null;
    return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.Curve), {
        ...props
    });
}
var $5f7e20cca7ff1f78$export$2e2bcd8739ae039 = /*#__PURE__*/ (0, $4xljF$react.forwardRef)(function RLineChart(props, ref) {
    const { chartData: chartData , uniqueKeys: uniqueKeys , colors: colors , colorScheme: colorScheme = "viridis" , dateFormat: dateFormat , altTitle: altTitle , altDesc: altDesc , renderLegend: renderLegend = false , renderBrush: renderBrush = false , syncId: syncId , highlightStart: highlightStart , highlightEnd: highlightEnd , highlightLabel: highlightLabel , xAxisLabel: xAxisLabel , yAxisLabel: yAxisLabel , availableDomain: availableDomain , brushRange: brushRange , onBrushRangeChange: onBrushRangeChange  } = props;
    const [chartMargin, setChartMargin] = (0, $4xljF$react.useState)((0, $7b9d438d36f20548$export$6728fea658cfb92e));
    const { isMediumUp: isMediumUp  } = (0, $7ab8f904dd46e1e3$export$32d5543ab307c01)();
    (0, $4xljF$react.useEffect)(()=>{
        if (!isMediumUp) setChartMargin({
            ...(0, $7b9d438d36f20548$export$6728fea658cfb92e),
            left: 0
        });
    }, [
        isMediumUp
    ]);
    const lineColors = (0, $4xljF$react.useMemo)(()=>{
        return colors ? colors : (0, $555a761aa876ed68$export$6cee60e8aa85e528)({
            steps: uniqueKeys.length,
            colorScheme: colorScheme
        });
    }, [
        uniqueKeys,
        colorScheme,
        colors
    ]);
    const uniqueKeysWithColors = (0, $4xljF$react.useMemo)(()=>{
        return uniqueKeys.map((e, idx)=>({
                ...e,
                color: lineColors[idx]
            }));
    }, [
        uniqueKeys,
        lineColors
    ]);
    const renderHighlight = !!(highlightStart ?? highlightEnd);
    const xAxisDomain = (0, $4xljF$react.useMemo)(()=>{
        if (!renderBrush || !brushRange) return null;
        return [
            +brushRange[0],
            +brushRange[1]
        ];
    }, [
        renderBrush,
        brushRange
    ]);
    const brushXAxisDomain = (0, $4xljF$react.useMemo)(()=>{
        if (!renderBrush || !availableDomain) return null;
        return [
            +availableDomain[0],
            +availableDomain[1]
        ];
    }, [
        renderBrush,
        availableDomain
    ]); // Generate fake values before and after data range in order for recharts to show ticks - see  - needed because https://github.com/recharts/recharts/issues/2126
    const chartDataWithFakeValues = (0, $4xljF$react.useMemo)(()=>{
        if (!renderBrush || !availableDomain || chartData.length <= 1) return chartData;
        const firstDate = chartData[0].date;
        const lastDate = chartData[chartData.length - 1].date;
        const interval = chartData[1].date - firstDate;
        let currentFakeDate = firstDate;
        let prependValues = [];
        while(currentFakeDate > +availableDomain[0]){
            currentFakeDate -= interval;
            prependValues = [
                {
                    date: currentFakeDate
                },
                ...prependValues
            ];
        }
        currentFakeDate = lastDate;
        let appendValues = [];
        while(currentFakeDate < +availableDomain[1]){
            currentFakeDate += interval;
            appendValues = [
                ...appendValues,
                {
                    date: currentFakeDate
                }
            ];
        }
        return [
            ...prependValues,
            ...chartData,
            ...appendValues
        ];
    }, [
        renderBrush,
        chartData,
        availableDomain
    ]); // This is a hack to manually compute xAxis interval - needed because https://github.com/recharts/recharts/issues/2126
    const xAxisInterval = (0, $4xljF$react.useMemo)(()=>{
        if (!renderBrush || !brushRange) return null;
        const numValuesInBrushRange = chartDataWithFakeValues.filter((d)=>d.date > +brushRange[0] && d.date < +brushRange[1]).length;
        return Math.round(numValuesInBrushRange / 5);
    }, [
        renderBrush,
        chartDataWithFakeValues,
        brushRange
    ]);
    return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)($5f7e20cca7ff1f78$var$ChartWrapper, {
        children: [
            /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.ResponsiveContainer), {
                aspect: (0, $7b9d438d36f20548$export$a9c4ee88674b7001),
                debounce: 500,
                height: "auto",
                minHeight: (0, $7b9d438d36f20548$export$e975f927c24cf4a8),
                maxHeight: (0, $7b9d438d36f20548$export$40697364cff166fb),
                children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)($5f7e20cca7ff1f78$var$LineChartWithFont, {
                    ref: ref,
                    data: chartDataWithFakeValues,
                    margin: chartMargin,
                    syncId: syncId,
                    syncMethod: "value",
                    children: [
                        /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $38e8fc58c3b6579f$export$2e2bcd8739ae039), {
                            title: altTitle,
                            desc: altDesc
                        }),
                        /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.CartesianGrid), {
                            stroke: "#efefef",
                            vertical: false
                        }),
                        /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.XAxis), {
                            type: "number",
                            scale: "time",
                            domain: xAxisDomain ?? [
                                "dataMin",
                                "dataMax"
                            ],
                            dataKey: "date",
                            axisLine: false,
                            tickFormatter: (t)=>(0, $555a761aa876ed68$export$5a00511f040384d7)(t, dateFormat),
                            allowDataOverflow: true,
                            interval: xAxisInterval ?? "preserveEnd",
                            height: renderBrush ? (0, $7b9d438d36f20548$export$c38fa016fa5e23fe).with.xAxisHeight : (0, $7b9d438d36f20548$export$c38fa016fa5e23fe).without.xAxisHeight,
                            children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.Label), {
                                value: xAxisLabel,
                                offset: renderBrush ? (0, $7b9d438d36f20548$export$c38fa016fa5e23fe).with.labelOffset : (0, $7b9d438d36f20548$export$c38fa016fa5e23fe).without.labelOffset,
                                position: "bottom"
                            })
                        }),
                        /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.YAxis), {
                            axisLine: false,
                            domain: [
                                "auto",
                                "auto"
                            ],
                            tickFormatter: (t)=>(0, $555a761aa876ed68$export$104b63ca24cf6df9)(t),
                            children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.Label), {
                                className: "label-y",
                                value: yAxisLabel,
                                angle: -90,
                                position: "left"
                            })
                        }),
                        renderHighlight && /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)((0, $4xljF$reactjsxruntime.Fragment), {
                            children: [
                                /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.ReferenceArea), {
                                    x1: (0, $555a761aa876ed68$export$6bcf10fa924b8f90)({
                                        timeString: highlightStart,
                                        dateFormat: dateFormat
                                    }),
                                    x2: (0, $555a761aa876ed68$export$6bcf10fa924b8f90)({
                                        timeString: highlightEnd,
                                        dateFormat: dateFormat
                                    }),
                                    fill: (0, $7b9d438d36f20548$export$7b93c9150739f7ee),
                                    isFront: true
                                }),
                                !!highlightLabel && /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.Customized), {
                                    component: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $96acddacc9e95800$export$47c6a27fae70e16c), {
                                        highlightLabel: highlightLabel
                                    })
                                })
                            ]
                        }),
                        uniqueKeysWithColors.map((k)=>{
                            return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.Line), {
                                type: "linear",
                                isAnimationActive: false,
                                dot: false,
                                activeDot: {
                                    r: 3
                                },
                                dataKey: k.label,
                                strokeWidth: 2,
                                stroke: k.active ? k.color : "transparent"
                            }, `${k.value}-line`);
                        }),
                        /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.Tooltip), {
                            cursor: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)($5f7e20cca7ff1f78$var$CustomCursor, {}),
                            content: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $ff15672b36855f32$export$2e2bcd8739ae039), {
                                dateFormat: dateFormat,
                                uniqueKeys: uniqueKeysWithColors
                            })
                        }),
                        renderLegend && uniqueKeysWithColors.length > 1 && /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.Legend), {
                            verticalAlign: "bottom",
                            width: (0, $7b9d438d36f20548$export$9521120b43092a8d),
                            wrapperStyle: {
                                width: "100%"
                            },
                            content: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $96acddacc9e95800$export$78003ba218df33f3), {})
                        })
                    ]
                })
            }),
            renderBrush && brushXAxisDomain && availableDomain && brushRange && onBrushRangeChange && /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)($5f7e20cca7ff1f78$var$BrushContainer, {
                children: [
                    /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.ResponsiveContainer), {
                        aspect: (0, $7b9d438d36f20548$export$a9c4ee88674b7001),
                        maxHeight: (0, $7b9d438d36f20548$export$b4f2afed5884b447),
                        width: "100%",
                        children: /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsxs)((0, $4xljF$recharts.LineChart), {
                            data: chartDataWithFakeValues,
                            margin: {
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0
                            },
                            children: [
                                /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.XAxis), {
                                    type: "number",
                                    scale: "time",
                                    domain: brushXAxisDomain,
                                    dataKey: "date",
                                    hide: true
                                }),
                                uniqueKeysWithColors.map((k)=>{
                                    return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $4xljF$recharts.Line), {
                                        type: "linear",
                                        isAnimationActive: false,
                                        dot: false,
                                        activeDot: false,
                                        dataKey: k.label,
                                        strokeWidth: 0.5,
                                        stroke: k.active ? k.color : "transparent"
                                    }, `${k.value}-line-brush_`);
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $1cb9a027733fd182$export$2e2bcd8739ae039), {
                        availableDomain: availableDomain,
                        brushRange: brushRange,
                        onBrushRangeChange: onBrushRangeChange
                    })
                ]
            })
        ]
    });
});



// BlockErrorBoundary doesn't catch async errors. To catch async errors we use
// this workaround - it works if an error is thrown in useState hook. More in
// this thread: https://github.com/facebook/react/issues/14981
const $c6b51e033825bb17$var$useAsyncError = ()=>{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setError] = (0, $4xljF$react.useState)();
    return (0, $4xljF$react.useCallback)((e)=>{
        setError(()=>{
            throw e;
        });
    }, [
        setError
    ]);
};
var $c6b51e033825bb17$export$2e2bcd8739ae039 = $c6b51e033825bb17$var$useAsyncError;


const $9bcf144ec7818985$var$subIdKey = "subIdeKey";
function $9bcf144ec7818985$var$BlockChart(props) {
    const { dataPath: dataPath , idKey: idKey , xKey: xKey , yKey: yKey , dateFormat: dateFormat  } = props;
    const [chartData, setChartData] = (0, $4xljF$react.useState)([]);
    const [uniqueKeys, setUniqueKeys] = (0, $4xljF$react.useState)([]);
    const newDataPath = dataPath.split("?")[0];
    const extension = (0, $7b9d438d36f20548$export$56d5855bc94e5e87).exec(newDataPath)[1];
    const throwAsyncError = (0, $c6b51e033825bb17$export$2e2bcd8739ae039)();
    (0, $4xljF$react.useEffect)(()=>{
        const getData = async ()=>{
            try {
                const data = extension === "csv" ? await (0, $4xljF$d3.csv)(dataPath) : await (0, $4xljF$d3.json)(dataPath).then((d)=>[
                        d
                    ].flat()); // if no idKey is provided (when there are only two columns in the data), sub it with empty data
                const dataToUse = idKey ? data : data.map((e)=>({
                        ...e,
                        [$9bcf144ec7818985$var$subIdKey]: ""
                    }));
                const { fData: fData , uniqueKeys: uniqueKeys  } = (0, $555a761aa876ed68$export$776836780a938436)({
                    data: dataToUse,
                    idKey: idKey ? idKey : $9bcf144ec7818985$var$subIdKey,
                    xKey: xKey,
                    yKey: yKey,
                    dateFormat: dateFormat
                });
                const formattedUniqueKeys = uniqueKeys.map((e)=>({
                        label: e,
                        value: e,
                        active: true
                    }));
                setChartData(fData);
                setUniqueKeys(formattedUniqueKeys);
            } catch (e) {
                throwAsyncError(e);
            }
        };
        getData();
    }, [
        setChartData,
        setUniqueKeys,
        throwAsyncError,
        extension,
        idKey,
        xKey,
        yKey,
        dataPath,
        dateFormat
    ]);
    return /*#__PURE__*/ (0, $4xljF$reactjsxruntime.jsx)((0, $5f7e20cca7ff1f78$export$2e2bcd8739ae039), {
        ...props,
        chartData: chartData,
        uniqueKeys: uniqueKeys,
        renderLegend: true
    });
}
var $9bcf144ec7818985$export$2e2bcd8739ae039 = $9bcf144ec7818985$var$BlockChart;




//# sourceMappingURL=export-components.js.map
