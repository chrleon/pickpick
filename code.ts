// This plugin picks everything on screeen for the user
const ux: number = Number(figma.activeUsers[0]?.position?.x.toFixed(0))
const uy: number = Number(figma.activeUsers[0]?.position?.y.toFixed(0))
let selection: SceneNode[] = []

// Skip over invisible nodes and their descendants inside instances
// for faster performance.
figma.skipInvisibleInstanceChildren = true

figma.parameters.on('input', ({ query, result }) => {
  result.setSuggestions(
    ['right','below','above','left']
  .filter(s => s.includes(query)))
})



//  later we can filter the selection
//  const texts = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })
//  const boxes = figma.currentPage.findAllWithCriteria({ types: ['GROUP'] })

//  filter layers with:
// coordinates below and to the right of the user position
// whose root node is the PAGE
figma.on('run', ({ command, parameters }: RunEvent) => {
  selection = figma.currentPage.children.filter((item) => {
    // return item?.y > uy && item?.x > ux && item?.parent?.type == 'PAGE'
    switch (parameters?.direction) {
      case 'right':
        return item?.x > ux && item?.parent?.type == 'PAGE'
      case 'left':
        return item?.x < ux && item?.parent?.type == 'PAGE'
      case 'above':
        return item?.y < uy && item?.parent?.type == 'PAGE'
      case 'below':
        return item?.y > uy && item?.parent?.type == 'PAGE'
      default:
        return item?.x > ux && item?.parent?.type == 'PAGE'

    }
  })

  const message = selection.length + " layers plucked. Do your thing!"
  figma.notify(message);

  // set the selection
  figma.currentPage.selection = selection

  //console.log(ux,uy,'run')
  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  figma.closePlugin();
})