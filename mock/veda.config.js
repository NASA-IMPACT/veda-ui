module.exports = {
  datasets: './datasets/*.data.mdx',
  stories: './stories/*.stories.mdx',

  pageOverrides: {
    aboutContent: './about.mdx',
    'sandbox-override': './sandbox-override.mdx',

    '/disclaimer': './custom-pages/disclaimer.mdx',
    '/custom-page': './custom-pages/custom.mdx',
    '/aparam/:id': './custom-pages/aparam.mdx'
  },

  // customScripts: [
  //   {
  //     src: "https://dap.digitalgov.gov/Universal-Federated-Analytics-Min.js?agency=NASA&subagency=HQ",
  //     id: "_fed_an_ua_tag",
  //     type: "text/javascript",
  //     async: true,
  //   },
  //   {
  //     "src": "//static.ctctcdn.com/js/signup-form-widget/current/signup-form-widget.min.js",
  //     "id": "signupScript",
  //     "defer": true,
  //     "async": true,
  //   },
  //   {
  //     "id": "ctct-inline-script",
  //     "inlineScript": 'var _ctct_m = "659a6c1e1b34f5b0f7de2c2640663bee";',
  //   }
  // ],

  strings: {
    stories: {
      one: 'Story',
      other: 'Stories'
    }
  }
};
