  
// dit geeft alle styles die in :root zijn gedefinieerd (in de imports van main.css)
const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--book-cover-width-large') != null && rootStyles.getPropertyValue('--book-cover-width-large') !== '') {
  ready()
} else {
   // opgenomen in de hoofd index.ejs bij link van de stylesheet
   // kijkt of de main.css is loaded
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio

   FilePond.registerPlugin(
      FilePondPluginImagePreview,
      FilePondPluginImageResize,
      FilePondPluginFileEncode
   )

FilePond.setOptions({
   stylePanelAspectRatio: 1 / coverAspectRatio,
   imageResizeTargetWidth: coverWidth,
   imageResizeTargetHeight: coverHeight
})

FilePond.parse(document.body);
}