const entrypoints = {
  screen: ["sumo/scss/screen.scss"],
  common: [
    "sumo/js/i18n.js",
    "sumo/js/templates/macros.js",
    "sumo/js/templates/search-results-list.js",
    "sumo/js/templates/search-results.js",
    "sumo/js/nunjucks.js",
    "sumo/js/cached_xhr.js",
    "sumo/js/search_utils.js",
    "sumo/js/browserdetect.js",
    "sumo/js/kbox.js",
    "sumo/js/main.js",
    "sumo/js/libs/modernizr-custom-build.js",
    "sumo/js/geoip-locale.js",
    "sumo/js/ui.js",
    "sumo/js/analytics.js",
    "sumo/js/instant_search.js",
    "sumo/js/responsive-nav-toggle.js",
    "sumo/js/profile-avatars.js",
    "./webpack/protocol-compat.js",
    "protocol/js/protocol-base.js",
    "protocol/js/protocol-utils.js",
    "protocol/js/protocol-supports.js",
    "protocol/js/protocol-details.js",
    "protocol/js/protocol-footer.js",
    "protocol/js/protocol-menu.js",
    "protocol/js/protocol-modal.js",
    "protocol/js/protocol-navigation.js",
    "protocol/js/protocol-newsletter.js",
    "protocol/js/protocol-notification-bar.js",
    "protocol/js/protocol-lang-switcher.js",
    "sumo/js/protocol-nav.js",
    "sumo/js/protocol-details-init.js",
    "sumo/js/protocol-modal-init.js",
    "sumo/js/protocol-notification-init.js",
    "sumo/js/protocol-language-switcher-init.js",
    "sumo/js/sumo-tabs.js",
    "sumo/js/sumo-close-this.js",
  ],
  "common.fx.download": [
    "sumo/js/show-fx-download.js",
  ],
  community: [
    "community/js/community.js",
    "community/js/select.js",
  ],
  "community.metrics": [
    "kpi/js/kpi.browserify.js",
  ],
  questions: [
    "sumo/js/markup.js",
    "sumo/js/ajaxvote.js",
    "sumo/js/ajaxpreview.js",
    "sumo/js/remote.js",
    "sumo/js/aaq.js",
    "sumo/js/questions.js",
    "sumo/js/tags.filter.js",
    "sumo/js/tags.js",
    "sumo/js/reportabuse.js",
    "sumo/js/questions.metrics.js",
    "sumo/js/upload.js",
  ],
  "questions.metrics": [
    "sumo/js/questions.metrics-dashboard.js",
  ],
  "questions.geo": [
    "sumo/js/location.js",
  ],
  products: [
    "sumo/js/compare_versions.js",
    "sumo/js/products.js",
  ],
  search: [
    "sumo/js/search.js",
  ],
  forums: [
    "sumo/js/markup.js",
    "sumo/js/ajaxpreview.js",
    "sumo/js/forums.js",
    "sumo/js/reportabuse.js",
  ],
  gallery: [
    "sumo/js/gallery.js",
  ],
  wiki: [
    "sumo/js/markup.js",
    "sumo/js/users.autocomplete.js",
    "sumo/js/showfor.js",
    "sumo/js/ajaxvote.js",
    "sumo/js/ajaxpreview.js",
    "sumo/js/wiki.js",
    "sumo/js/tags.js",
    "sumo/js/dashboards.js",
    "sumo/js/editable.js",
    "sumo/js/wiki.metrics.js",
    "sumo/js/templates/wiki-related-doc.js",
    "sumo/js/templates/wiki-search-results.js",
    "sumo/js/wiki_search.js",
  ],
  rickshaw: [
    "d3/d3.js",
    "sumo/js/libs/d3.layout.min.js",
    "jquery-ui/ui/widgets/sortable",
    "jquery-ui/ui/widgets/slider",
    "sumo/js/rickshaw_utils.js",
  ],
  "wiki.history": [
    "sumo/js/historycharts.js",
  ],
  "wiki.diff": [
    "sumo/js/libs/diff_match_patch_uncompressed.js",
    "sumo/js/diff.js",
  ],
  "wiki.editor": [
    "sumo/js/wiki.editor.js",
  ],
  "wiki.dashboard": [
    "sumo/js/wiki.dashboard.js",
  ],
  users: [
    "sumo/js/users.js",
    "sumo/js/reportabuse.js",
  ],
  messages: [
    "sumo/js/markup.js",
    "sumo/js/users.autocomplete.js",
    "sumo/js/ajaxpreview.js",
    "sumo/js/messages.js",
  ],
  groups: [
    "sumo/js/users.autocomplete.js",
    "sumo/js/markup.js",
    "sumo/js/groups.js",
    "sumo/js/editable.js",
  ],
  "kpi.dashboard": [
    "d3/d3.js",
    "kpi/js/kpi.browserify.js",
  ],
  "gtm-snippet": [
    "sumo/js/gtm-snippet.js",
  ],
}

for (let key in entrypoints) {
  if (key !== "common") {
    // mark all entrypoints as dependent on "common" (other than itself)
    // this ensures we don't duplicate chunks across "common" and other bundles
    // and ensures "common" contains the only webpack runtime
    entrypoints[key] = {
      import: entrypoints[key],
      dependOn: "common",
    }
  }
}

module.exports = entrypoints