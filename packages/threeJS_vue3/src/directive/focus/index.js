export default app => {
  app.directive('Gfocus', {
    mounted(el) {
      el.focus()
    }
  })
}
